import React, { useState, useRef } from 'react'; // Added useRef
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js'; // Added Import
import { Download, Share2, Sprout, AlertTriangle, Shield, TrendingUp, Zap, Loader2 } from 'lucide-react';

const ResultsCarousel = ({ data }) => {
  const [activeTab, setActiveTab] = useState('balanced');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // 1. Create a reference to the content we want to print
  const printRef = useRef();

  if (!data) return null;

  const currentStrategy = data[activeTab];
  const markdownContent = currentStrategy?.content || "No content available.";
  const title = currentStrategy?.title || "Strategy Analysis";

  // 2. The Download Function
  const handleDownload = () => {
    setIsDownloading(true);
    const element = printRef.current;
    
    const opt = {
      margin:       [0.5, 0.5],
      filename:     `AgriAssist_${activeTab}_Strategy.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 }, // Higher scale = better text quality
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => setIsDownloading(false));
  };

  return (
    <div className="w-full mt-8 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* --- Header --- */}
        <div className="bg-green-600 p-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sprout className="text-green-200" />
                Farm Strategy Report
              </h2>
              <p className="text-green-100 text-sm mt-1">AI-Generated Agricultural Roadmap</p>
            </div>
            
            {/* --- DOWNLOAD BUTTON --- */}
            <div className="flex gap-2">
               <button 
                 onClick={handleDownload}
                 disabled={isDownloading}
                 className="flex items-center gap-2 p-2 bg-green-700/50 hover:bg-green-500 rounded-lg transition-colors disabled:opacity-50" 
                 title="Save PDF"
               >
                 {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                 {/* Added text for clarity */}
                 <span className="text-sm font-medium hidden md:block">
                    {isDownloading ? 'Saving...' : 'Save PDF'}
                 </span>
               </button>
            </div>
          </div>

          {/* --- Tabs --- */}
          <div className="flex p-1 bg-green-800/30 rounded-xl gap-1">
            <button 
              onClick={() => setActiveTab('lowRisk')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'lowRisk' ? 'bg-white text-green-700 shadow-md' : 'text-green-100 hover:bg-green-700/50'}`}
            >
              <Shield size={16} /> Low Risk
            </button>
            <button 
              onClick={() => setActiveTab('balanced')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'balanced' ? 'bg-white text-green-700 shadow-md' : 'text-green-100 hover:bg-green-700/50'}`}
            >
              <TrendingUp size={16} /> Balanced
            </button>
            <button 
              onClick={() => setActiveTab('highRisk')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'highRisk' ? 'bg-white text-green-700 shadow-md' : 'text-green-100 hover:bg-green-700/50'}`}
            >
              <Zap size={16} /> High Risk
            </button>
          </div>
        </div>

        {/* --- Main Content Area (This is what gets printed) --- */}
        <div ref={printRef} className="p-6 md:p-8 bg-gray-50/30">
          
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            {title}
          </h3>

          <div className="prose prose-green max-w-none">
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <span className="font-bold text-gray-900 bg-green-100 px-1 rounded" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-2 mb-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm" {...props} />,
                li: ({node, children, ...props}) => (
                  <li className="flex gap-3 text-gray-700 list-none" {...props}>
                    <span className="text-green-500 font-bold">•</span>
                    <span>{children}</span>
                  </li>
                ),
                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-green-800 mt-6 mb-2 uppercase tracking-wide" {...props} />,
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
          
          {/* Add a footer specifically for the PDF so it looks official */}
          <div className="mt-8 pt-4 border-t text-xs text-gray-400 text-center">
            Generated by AgriAssist AI • {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* --- Screen-only Footer --- */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 text-xs text-gray-500 flex gap-2">
           <AlertTriangle size={14} className="mt-0.5 shrink-0" />
           <p>AI advice. Always verify with local agricultural extension officers.</p>
        </div>

      </div>
    </div>
  );
};

export default ResultsCarousel;