# backend/main.py

import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import google.generativeai as genai

# --- CONFIGURATION ---
# TODO: REPLACE THIS WITH YOUR ACTUAL GEMINI API KEY
os.environ["GEMINI_API_KEY"] = "AIzaSyCzewYAfJ4AWMXaLNRYDav95xgTp0FtS7w"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

app = FastAPI()

# --- CORS (Allow Frontend to talk to Backend) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODEL (Strict Typing) ---
# This accepts the raw JSON from your React Frontend
class SurveySubmission(BaseModel):
    answers: Dict[str, Any]       # Catches all q1, q2... inputs
    gps_location: Optional[Dict[str, float]] = None

# --- 1. THE MATHS ENGINE (Deterministic Logic) ---
def run_agricultural_maths(data: Dict[str, Any]):
    """
    Performs hard calculations that LLMs often mess up.
    """
    results = {}
    
    # Example: Parse Area (Sanitizing input)
    try:
        area_raw = data.get("q9_area_total", "0")
        area = float(str(area_raw).strip())
    except:
        area = 0.0

    # CALCULATION 1: Fertilizer Estimation (Baseline: 120kg N per hectare for Wheat)
    # 1 Acre = 0.4 Hectares approx.
    if area > 0:
        nitrogen_needed = area * 40 # Approx 40kg per acre baseline
        results['calc_nitrogen_kg'] = round(nitrogen_needed, 2)
        results['calc_urea_bags'] = round(nitrogen_needed / 46 * 100 / 45, 1) # Urea is 46% N, ~45kg bag
    else:
        results['calc_nitrogen_kg'] = 0
    
    # CALCULATION 2: Financial Health Score
    # Simple logic: If debt > cash_in_hand, risky.
    cash_str = data.get("q29_cash", "Less than") # Simplified parsing
    debt_str = data.get("q33_debt", "No Debt")
    
    # (You can make this logic more complex based on your exact dropdown values)
    results['financial_status'] = "Stable"
    if "More than" in debt_str and "Less than" in cash_str:
        results['financial_status'] = "Critical Liquidity Crunch"

    return results

# --- 2. THE PROMPT ENGINE ---
def construct_ai_prompt(user_answers, math_results):
    """
    Combines raw user data + calculated math into a prompt for Gemini.
    """
    
    # We construct a context string from the answers
    context_str = json.dumps(user_answers, indent=2)
    math_str = json.dumps(math_results, indent=2)

    return f"""
    You are an Expert Agricultural AI. Analyze the following farmer profile and calculated metrics.
    
    USER DATA:
    {context_str}

    CALCULATED METRICS (Mathematically verified):
    {math_str}

    TASK:
    Generate a strategic advisory plan in strict JSON format.
    The response MUST contain exactly three scenarios: "lowRisk", "balanced", and "highRisk".
    
    1. lowRisk: Conservative. Traditional crops, low debt, high stability.
    2. balanced: Moderate. Mix of cash crops, calculated loans, modern techniques.
    3. highRisk: Aggressive. High value crops (exotic/horticulture), heavy investment, max profit potential.

    Each scenario should have:
    - "Profit": Estimated annual profit in rupees.
    - "ROI": Estimated Return on Investment percentage.
    - (summarise all the main details very briefly)
    - (suggest a roadmap to achieve this scenario)
    - (highlight potential risks, like climate issues, market volatility, susceptable plant diseases at the time and their prevention and cure)
    - (keep a point elaborating long term profits and benefits if the farm is mechanized, with downsides, if any)

    CRITICAL FORMATTING RULES (Markdown):
    1. **Bold Labels**: Every label (like "Name:", "Profit:", "Target:") MUST be wrapped in double asterisks. Example: **Name:**
    2. **Double Newlines**: You MUST use '\\n\\n' (double newline) after EVERY single field to force a line break on the website.
    3. **Bullet Points**: Use '\\n* ' for lists.

    Structure: 
    **Name:** \\n \\n
    **Place:** (fetch the city name using the gps coords...in the format "city,state") \\n  \\n
    **Old Budget:** (from the data) \\n \\n
    **Suggested Budget:** \\n \\n
    **Profits:** \\n \\n
    **ROI:** \\n \\n
    **Crops to plant right now:** \\n \\n
    **Fertiliser usage:** (n-p-k calues and mop, dap and other fertiliser use per acre or wtvr land unit chosen by farmer) \\n
    **Pesticide usage: (similar pattern as that of fertiliser usage) \\n \\n
    \\n \\n
    **Target:** (a target to acheive....like...let's say the data says that there is high erosion in soil.....then the primary target should be reducing soil erosion) [less than 30 words/max 2 sentences] \\n \\n
    \\n \\n
    **Roadmap:** (a roadmap to acheive the target) [more of a detailed essay....around 150 words] \\n \\n
    * (Risk 1) \\n \\n
    * (Risk 2) \\n \\n
    * (Risk 3) \\n \\n
    \\n \\n
    **Lookouts:** (plants diseases during the time and their precautions, climate changes, etc...) [in bullet points, as a list in separate lines] \\n \\n
    \\n \\n
    **Optionals:** \\n \\n
    (can include mechanization of farms and list out the potential benefits...like higher profits.....and and risks in a structured way) [a small paragraph of about 120 words] \\n \\n
    \\n \\n
    **Future recommendations:** [another paragraph of about 120 words] \\n \\n

    (Basically, follow the above structure strictly for each of the three scenarios such that it renders with the newlines and bullet points perfectly in the website. It renders text enclosed in ** as bold and * as bullet points and new line characters as new lines. Do NOT use any other formatting like markdown or html tags.)

    Sources:
    - Use local Indian agricultural data where possible.
    - Assume average market conditions.
    - Consider climate change impacts.
    - Factor in government schemes for farmers.
    - Consider soil health and crop rotation benefits.
    REMEMBER: The calculations provided earlier are accurate. Do NOT contradict them. Stick to the provided data of the farmer and prepare report accordingly. The report should not exceed 250 words.

    OUTPUT FORMAT (Strict JSON, no markdown):
    {{
        "lowRisk": {{ "title": "...", "content": "..." }},
        "balanced": {{ "title": "...", "content": "..." }},
        "highRisk": {{ "title": "...", "content": "..." }}
    }}
    """

# --- API ENDPOINT ---
@app.post("/submit-survey")
async def process_survey(submission: SurveySubmission):
    print("Received Data...")
    
    # 1. Run the Maths
    math_results = run_agricultural_maths(submission.answers)
    print(f"Maths Calculated: {math_results}")

    # 2. Build the Prompt
    final_prompt = construct_ai_prompt(submission.answers, math_results)

    # 3. Call Gemini (The Brain)
    try:
        model = genai.GenerativeModel('gemini-2.5-pro') # Using Gemini 2 pro
        response = model.generate_content(final_prompt)
        
        # Clean up the response (remove ```json marks if Gemini adds them)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        
        # Parse into Python Dict to ensure validity before sending to frontend
        ai_data = json.loads(clean_text)
        
        return ai_data

    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback if AI fails (prevents app crash)
        return {
            "lowRisk": {"title": "Error", "content": "AI Service Unavailable"},
            "balanced": {"title": "Error", "content": "Please check backend logs."},
            "highRisk": {"title": "Error", "content": str(e)}
        }

# --- RUN INSTRUCTION ---
# Run with: uvicorn main:app --reload