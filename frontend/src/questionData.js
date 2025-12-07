// src/questionData.js

// Minimized Module List for Demo
export const modulesList = [
  "Farmer Identity & Location", 
  "Land Profile", 
  "Financial Health", // Critical for Math
  "Symptoms & Disease", 
  "Crop History",
  "Market & Logistics"
];

export const fullQuestionnaire = [
  // --- MODULE 1: IDENTITY (The Intro) ---
  {
    id: "q1_name",
    moduleIndex: 0,
    label: "1. Farmer Name:",
    type: "text",
    placeholder: "Enter full name"
  },
  {
    id: "q_gps_trigger",
    moduleIndex: 0,
    label: "Auto-Detect Location",
    type: "gps_button",
    info: "Uses device GPS to skip State/District selections."
  },
  {
    id: "q3_state",
    moduleIndex: 0,
    label: "3. State:",
    type: "dropdown",
    options: ["Punjab", "Odisha", "Maharashtra", "Haryana", "Madhya Pradesh", "Uttar Pradesh"],
    hideIfGps: true // Hides if GPS is used
  },

  // --- MODULE 2: LAND (The Math Inputs) ---
  {
    id: "q9_area_total",
    moduleIndex: 1,
    label: "9. Total Area Size (Numerical):", 
    type: "number",
    placeholder: "e.g., 5.5" 
    // CRITICAL: Used by Python for Nitrogen Calc
  },
  {
    id: "q9_area_unit",
    moduleIndex: 1,
    label: "Unit for Area:",
    type: "dropdown",
    options: ["Acres", "Hectares", "Bigha"]
  },
  {
    id: "q12_soil_type",
    moduleIndex: 1,
    label: "12. Soil Type (Visual):",
    type: "radio",
    options: ["Black Soil", "Red Soil", "Alluvial / River Soil", "Sandy", "Rocky"]
  },

  // --- MODULE 3: FINANCIAL (The Logic Engine) ---
  {
    id: "q29_cash",
    moduleIndex: 2,
    label: "29. Cash in Hand (Ready for Inputs):",
    type: "dropdown",
    options: ["Less than ₹5,000", "₹5,000 – ₹20,000", "More than ₹50,000"]
    // CRITICAL: Used by Python for Financial Health Score
  },
  {
    id: "q33_debt",
    moduleIndex: 2,
    label: "33. Current Bank Debt:",
    type: "dropdown",
    options: ["No Debt", "Less than ₹50,000", "More than ₹1 Lakh"]
    // CRITICAL: Used by Python for Financial Health Score
  },
  {
    id: "q39_risk_appetite",
    moduleIndex: 2,
    label: "39. Risk Appetite:",
    type: "radio",
    options: ["Low (Minimize Loss)", "Medium (Balanced)", "High (Max Profit)"]
  },

  // --- MODULE 4: DISEASE (The AI "Doctor" Demo) ---
  {
    id: "q41_leaf_color",
    moduleIndex: 3,
    label: "41. Leaf Color Changes:",
    type: "radio",
    options: ["Healthy Green", "Yellowing (Chlorosis)", "Reddish / Purple", "Pale White"]
  },
  {
    id: "q51_visible_insects",
    moduleIndex: 3,
    label: "51. Visible Insects:",
    type: "dropdown",
    options: ["None", "Caterpillars", "Whitefly / Aphids", "Beetles"]
  },

  // --- MODULE 5: HISTORY (Crop Rotation Logic) ---
  {
    id: "q56_last_season_crop",
    moduleIndex: 4,
    label: "56. Last Season Crop:",
    type: "dropdown",
    options: ["Paddy (Rice)", "Wheat", "Maize", "Cotton", "Pulses", "Fallow (Empty)"]
  },
  {
    id: "q57_last_yield",
    moduleIndex: 4,
    label: "57. Last Yield (Quintals per Acre):",
    type: "number",
    placeholder: "e.g., 20"
  },

  // --- MODULE 6: MARKET (Logistics) ---
  {
    id: "q85_selling_point",
    moduleIndex: 5,
    label: "85. Primary Selling Point:",
    type: "radio",
    options: ["APMC Mandi", "Local Market", "Middleman", "Direct to Company"]
  },
  {
    id: "q86_distance_mandi",
    moduleIndex: 5,
    label: "86. Distance to Nearest Mandi:",
    type: "dropdown",
    options: ["< 5 km", "5 – 15 km", "> 30 km"]
  }
];