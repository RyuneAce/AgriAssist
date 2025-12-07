import React, { useState, useRef } from 'react';
import { MapPin, Leaf, Sprout, ChevronRight, Loader2 } from 'lucide-react';
import { fullQuestionnaire, modulesList } from './questionData';
import ResultsCarousel from './components/ResultsCarousel';

// --- FIXED: Component moved OUTSIDE of App to prevent focus loss ---
const NextJsField = ({ question, answers, onInputChange, gpsCoords, onGpsClick }) => {
  if (question.hideIfGps && gpsCoords) return null;

  // 1. GPS Button Style
  if (question.type === 'gps_button') {
      return (
          <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Detect your location automatically</label>
              <button 
                  onClick={onGpsClick}
                  disabled={!!gpsCoords}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left
                      ${gpsCoords 
                          ? 'bg-green-50 border-green-500 text-green-800' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:shadow-md'
                      }`}
              >
                  <div className={`p-2 rounded-full ${gpsCoords ? 'bg-green-200' : 'bg-gray-100'}`}>
                      <MapPin size={20} className={gpsCoords ? 'text-green-700' : 'text-gray-500'} />
                  </div>
                  <div>
                      <span className="block font-medium">{gpsCoords ? 'Location Captured' : 'Use My Current Location'}</span>
                      <span className="text-xs text-gray-400">{gpsCoords ? 'Coordinates saved' : 'Auto-fills state & soil data'}</span>
                  </div>
              </button>
          </div>
      );
  }

  // 2. Standard Input Style
  return (
      <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">
              {question.label}
          </label>
          
          {question.type === 'text' || question.type === 'number' ? (
              <input
                  type={question.type}
                  // Fix: Use empty string fallback to control the input
                  value={answers[question.id] || ''} 
                  placeholder={question.placeholder || 'Type here...'}
                  onChange={(e) => onInputChange(question.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder-gray-400"
              />
          ) : question.type === 'dropdown' ? (
              <div className="relative">
                  <select
                      value={answers[question.id] || ''}
                      onChange={(e) => onInputChange(question.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 outline-none appearance-none"
                  >
                      <option value="">Select an option...</option>
                      {question.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">▼</div>
              </div>
          ) : question.type === 'radio' ? (
              <div className="space-y-2">
                  {question.options?.map((opt, i) => (
                      <label key={i} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${answers[question.id] === opt ? 'bg-green-50 border-green-500 ring-1 ring-green-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                          <input
                              type="radio"
                              name={question.id}
                              value={opt}
                              checked={answers[question.id] === opt}
                              onChange={(e) => onInputChange(question.id, e.target.value)}
                              className="w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="ml-3 text-gray-700 font-medium">{opt}</span>
                      </label>
                  ))}
              </div>
          ) : null}
      </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [answers, setAnswers] = useState({});
  const [gpsCoords, setGpsCoords] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const resultsRef = useRef(null);

const visibleQuestions = fullQuestionnaire.filter(q => {
      // Don't count the GPS Button itself as a question
      if (q.type === 'gps_button') return false;
      // Don't count questions hidden by GPS
      if (gpsCoords && q.hideIfGps) return false;
      return true;
  });

  const totalQuestions = visibleQuestions.length;
  
  // Count answers (Checking for undefined or empty string, but allowing "0")
  const answeredCount = visibleQuestions.filter(q => {
      const val = answers[q.id];
      return val !== undefined && val !== ''; 
  }).length;

  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

const handleGpsClick = () => {
    // 1. Check support
    if (!("geolocation" in navigator)) {
      alert("GPS not supported by this browser.");
      return;
    }

    // 2. Options to force a response
    const gpsOptions = {
      enableHighAccuracy: true, // Try to use GPS hardware, not just IP wifi
      timeout: 10000,           // GIVE UP after 10 seconds (prevents hanging forever)
      maximumAge: 0             // Don't use old cached positions
    };

    console.log("Requesting Real GPS...");

    // 3. The Real Call
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // --- SUCCESS CASE ---
        console.log("Real GPS found:", position.coords);
        
        const realCoords = { 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        };
        
        setGpsCoords(realCoords);

        // --- INTELLIGENT AUTO-FILL ---
        // Since we don't have a Geocoding API (Google Maps) connected to convert 
        // Lat/Lng into "Odisha", we simulate that part for the prototype.
        // But the Lat/Lng stored are 100% REAL from your device.
        setAnswers(prev => ({ 
           ...prev, 
           q3_state: "Odisha", 
           q12_soil_type: "Alluvial / River Soil"
        }));

        alert(`Success! Found you at: ${realCoords.lat.toFixed(4)}, ${realCoords.lng.toFixed(4)}`);
      },
      (error) => {
        // --- ERROR CASE ---
        console.error("GPS Error:", error);
        
        // Helpful error messages for you
        let msg = "An unknown error occurred.";
        if (error.code === 1) msg = "User denied permission.";
        if (error.code === 2) msg = "Position unavailable (low signal).";
        if (error.code === 3) msg = "Request timed out (took too long).";
        
        alert(`GPS Failed: ${msg}`);
      },
      gpsOptions
    );
  }
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        const response = await fetch('http://127.0.0.1:8000/submit-survey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, gps_location: gpsCoords })
        });
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        setApiResponse(data);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch  {
        alert("Backend connection failed. Is the Python terminal open?");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg text-white shadow-lg shadow-green-200">
                  <Leaf size={24} fill="currentColor" />
              </div>
              <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">AgriAssist</h1>
                  <p className="text-xs text-gray-500 font-medium">Smart Agricultural Analysis</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <Sprout size={16} />
                <span>{answeredCount} / {totalQuestions}</span>
              </div>
          </div>
          <div className="h-1 w-full bg-gray-100">
            <div className="h-1 bg-green-500 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32">
        {modulesList.map((moduleName, mIndex) => {
           const moduleQuestions = fullQuestionnaire.filter(q => q.moduleIndex === mIndex);
           if(moduleQuestions.length === 0) return null;

           return (
            <div key={mIndex} className="mb-8">
                <div className="bg-green-50/50 border border-green-100 rounded-t-2xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-200 text-green-700 flex items-center justify-center font-bold text-sm">
                        {mIndex + 1}
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">{moduleName}</h2>
                </div>
                
                <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl p-6 shadow-sm">
                    {moduleQuestions.map(q => (
                       <NextJsField 
                          key={q.id} 
                          question={q} 
                          answers={answers}
                          onInputChange={handleInputChange}
                          gpsCoords={gpsCoords}
                          onGpsClick={handleGpsClick}
                       />
                    ))}
                </div>
            </div>
           )
        })}

        {!apiResponse && (
            <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-30 pointer-events-none">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`
                        pointer-events-auto shadow-2xl shadow-green-200 transform transition-all active:scale-95
                        px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2
                        ${isSubmitting ? 'bg-gray-800 text-white cursor-wait' : 'bg-green-600 hover:bg-green-700 text-white'}
                    `}
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Generate Strategy'}
                </button>
            </div>
        )}

        <div ref={resultsRef}>
            {apiResponse && <ResultsCarousel data={apiResponse} />}
        </div>
      </main>
    </div>
  );
}

export default App;