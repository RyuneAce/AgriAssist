# AgriAssist: AI Agricultural Strategy Generator
*AgriAssist is a smart farming advisory tool. It collects farm data (location, soil type, financial health) and uses Google's Gemini AI to generate three distinct farming strategies: Low Risk, Balanced, and High Risk. It also performs mathematical calculations for fertilizer usage and financial stability.*

---

## Quick Start (For Developers)

*If you already have Node.js, Python, and Git installed, skip to here!*

### Backend (Python):

> Bash
> - cd backend
> - pip install fastapi uvicorn google-generativeai pydantic
> -  Add your GEMINI_API_KEY in `main.py`
> - uvicorn main:app --reload

### Frontend (React/Vite):

> Bash
> - cd frontend
> - npm install
> - npm run dev

---

## Complete Setup Guide (From Scratch)
Follow this guide if you are setting up this project on a new computer.

### Phase 1: Install Prerequisites
Before running the code, you need two main tools installed on your computer.

1. Download & Install Node.js: [Click here to download (LTS Version)](https://nodejs.org/). This runs the website interface.
2. Download & Install Python: [Click here to download](https://www.python.org/downloads/). This runs the AI logic.
3. Important: During installation, check the box that says "Add Python to PATH".

### Phase 2: Set Up the Backend
The "Backend" performs the calculations and talks to the AI.

1. Open your project folder.
2. Look for the folder named backend (where main.py is located).
3. Right-click inside that folder and select "Open in Terminal" (or Command Prompt).
4. Install the required libraries by typing this command and hitting Enter:

> Bash
> - pip install fastapi uvicorn google-generativeai pydantic


Add your API Key:

1. Open main.py in a text editor (like Notepad or VS Code).
2. Find the line: os.environ["GEMINI_API_KEY"] = "..."
3. Replace the text inside the quotes with your actual Google Gemini API Key. (You can get one from [Google AI Studio](https://aistudio.google.com/)).
4. Start the Server: Type the following command in the terminal:

> Bash
> - uvicorn main:app --reload

If successful, you will see a message saying: Uvicorn running on http://127.0.0.1:8000. 
⚠ KEEP THIS WINDOW OPEN. Do not close it, or the AI will stop working.

### Phase 3: Set Up the Frontend
The "Frontend" is what you see and click on.

1. Go back to your main project folder.
2. Open the folder named frontend (where package.json and src are located).
3. Right-click and select "Open in Terminal". (This opens a second terminal window).

Install the dependencies by typing:

> Bash 
> - npm install

This might take a minute as it downloads React, Lucide icons, and the PDF generator.

To start the Website: Type the following command:

> Bash
> - npm run dev
 
To open the App: 
The terminal will show a link (usually http://localhost:5173). Control-click that link (or copy-paste it into your browser).

---

## How to Use AgriAssist

1. *Fill in the Data: Enter the farmer's name, land size, and financial details.*
2. *Auto-Detect Location: Click the "Use My Current Location" button to simulate GPS detection (simulates Odisha/Alluvial Soil).*
3. *Submit: Click "Generate Strategy".**
4. *Wait for AI: The backend will calculate fertilizer needs and ask Gemini for a roadmap.*
5. *View Results: Swipe through the Low Risk, Balanced, and High Risk cards.*
6. *Download: Click the "Save PDF" button to download a formal report for the farmer.*

---

## Troubleshooting

*"Network Error" when submitting:*

- Check if your Python Backend terminal is still running. It must be open for the website to work.
- Ensure the backend is running on port 8000.

*"AI Service Unavailable":*

- Check your internet connection.
- Verify your API Key in main.py is correct and has quota remaining.

*"npm is not recognized":*

- You might not have installed Node.js correctly. Try reinstalling it and restarting your computer.

---

## Project Structure
For developers looking to edit the code:

*backend/main.py:* The FastAPI server. Contains the run_agricultural_maths function and the prompt engineering logic for Gemini.
*frontend/src/App.jsx:* The main interface code.
*frontend/src/questionData.js:* Edit this file to change the questions in the survey.
*frontend/src/components/ResultsCarousel.jsx:* The component that displays the 3 strategy cards and handles PDF generation.
*frontend/src/components/ProgressBar.jsx:* The component that displays the progress bar at the top in percentage format.
*frontend/src/components/QuestionField.jsx:* The component that beautifies the question palette.
