import React from 'react';
import { MapPin } from 'lucide-react'; // Assuming you installed lucide-react

const QuestionField = ({ question, value, onChange, onGpsClick, gpsActive }) => {
  const baseLabelStyle = "block text-sm font-medium text-gray-700 mb-2";
  const baseInputStyle = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border";

  // --- Special GPS Button Handler ---
  if (question.type === 'gps_button') {
     return (
        <div className="my-4 bg-blue-50 p-3 rounded-md border border-blue-200 flex items-center justify-between">
            <div>
                <label className="block text-sm font-medium text-blue-800">{question.label}</label>
                <p className="text-xs text-blue-600">{question.info}</p>
            </div>
            <button 
                onClick={onGpsClick}
                disabled={gpsActive}
                className={`flex items-center px-3 py-2 rounded text-sm font-bold ${gpsActive ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
                <MapPin size={16} className="mr-1" />
                {gpsActive ? 'GPS Detected' : 'Detect'}
            </button>
        </div>
     )
  }

  // --- Standard Inputs ---
  return (
    <div className="pb-2">
      <label htmlFor={question.id} className={baseLabelStyle}>
        {question.label}
      </label>

      {/* RENDER BASED ON TYPE */}
      {question.type === 'text' || question.type === 'number' ? (
        <input
          type={question.type}
          id={question.id}
          value={value}
          placeholder={question.placeholder || ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          className={baseInputStyle}
        />
      ) : question.type === 'dropdown' ? (
        <select
          id={question.id}
          value={value}
          onChange={(e) => onChange(question.id, e.target.value)}
          className={baseInputStyle}
        >
          <option value="">-- Select --</option>
          {question.options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      ) : question.type === 'radio' ? (
        <div className="mt-2 space-y-2">
          {question.options.map((opt, idx) => (
            <div key={idx} className="flex items-center">
              <input
                id={`${question.id}_${idx}`}
                name={question.id}
                type="radio"
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(question.id, e.target.value)}
                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
              />
              <label htmlFor={`${question.id}_${idx}`} className="ml-3 block text-sm font-medium text-gray-700">
                {opt}
              </label>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default QuestionField;