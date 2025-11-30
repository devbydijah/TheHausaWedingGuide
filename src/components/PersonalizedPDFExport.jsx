// src/components/PersonalizedPDFExport.jsx
// Clean PDF Export component using @react-pdf/renderer

import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { WeddingDocument } from '../pdf/WeddingDocument';

/**
 * PersonalizedPDFExport Component
 * 
 * Generates a beautiful, professional 7-page wedding planning PDF
 * using @react-pdf/renderer for React-native PDF generation.
 * 
 * Features:
 * - Elegant double-border design (burgundy + gold)
 * - Personalized cover page with countdown
 * - Budget visualization with bar charts
 * - Vendor contact directory
 * - Task checklists with proper checkboxes
 * - Emergency contacts sheet
 * 
 * @param {Object} data - Wedding planning data from the app
 * @param {Function} onClose - Callback when download completes
 */
export default function PersonalizedPDFExport({ data, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  // Extract and normalize data for PDF generation
  const prepareDataForPDF = (rawData) => {
    // Handle different data structures from the app
    const brideName = rawData?.brideName || 
                      rawData?.name || 
                      rawData?.visionQuiz?.name || 
                      '';
    
    const weddingDate = rawData?.weddingDate || 
                        rawData?.date ||
                        rawData?.visionQuiz?.weddingDate ||
                        null;
    
    // Vision quiz results
    const visionQuiz = rawData?.visionQuiz || {
      result: rawData?.selectedStyle || null,
    };
    
    // Budget data
    const budget = {
      total: rawData?.budget?.total || rawData?.totalBudget || 0,
      spent: rawData?.budget?.spent || rawData?.totalSpent || 0,
      categories: rawData?.budget?.categories || rawData?.budgetCategories || {},
    };
    
    // Vendor list
    const vendorList = rawData?.vendorList || rawData?.vendors || [];
    
    // Task list
    const taskList = rawData?.taskList || rawData?.tasks || [];
    
    return {
      brideName,
      weddingDate,
      visionQuiz,
      budget,
      vendorList,
      taskList,
    };
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress('Preparing your wedding plan...');
    
    try {
      // Prepare data
      const pdfData = prepareDataForPDF(data);
      setProgress('Generating PDF pages...');
      
      // Generate the PDF blob
      const blob = await pdf(<WeddingDocument data={pdfData} />).toBlob();
      
      setProgress('Downloading...');
      
      // Create filename
      const filename = pdfData.brideName
        ? `${pdfData.brideName.replace(/\s+/g, '_')}_Wedding_Plan.pdf`
        : 'My_Wedding_Plan.pdf';
      
      // Save the file
      saveAs(blob, filename);
      
      setProgress('Complete!');
      
      // Close modal after brief delay
      if (onClose) {
        setTimeout(onClose, 1500);
      }
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#740015] to-[#531946] flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Download Your Wedding Plan
        </h3>
        <p className="text-gray-600 text-sm">
          Your personalized 7-page wedding planner is ready!
        </p>
      </div>
      
      {/* Features list */}
      <div className="bg-[#FDF8F4] rounded-lg p-4 mb-6 text-left">
        <p className="text-sm font-medium text-[#740015] mb-2">What's included:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-[#D4AF37]">◆</span> Beautiful cover page with your details
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#D4AF37]">◆</span> Wedding vision & style guide
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#D4AF37]">◆</span> Budget breakdown with charts
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#D4AF37]">◆</span> Vendor contact directory
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#D4AF37]">◆</span> Planning timeline & checklists
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#D4AF37]">◆</span> Emergency contacts sheet
          </li>
        </ul>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {/* Progress message */}
      {isGenerating && progress && (
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 text-[#740015]">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" cy="12" r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">{progress}</span>
          </div>
        </div>
      )}
      
      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full px-6 py-3 bg-[#740015] text-white rounded-lg font-medium 
                   hover:bg-[#5a0011] disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                   shadow-lg hover:shadow-xl"
      >
        {isGenerating ? 'Generating PDF...' : 'Download PDF'}
      </button>
      
      {/* Footer note */}
      <p className="mt-4 text-xs text-gray-400">
        PDF will download to your device automatically
      </p>
    </div>
  );
}

// Named export for backwards compatibility
export { PersonalizedPDFExport };

// Also export the PDF generation function directly for programmatic use
export const generatePersonalizedPDF = async (data) => {
  const prepareData = (rawData) => ({
    brideName: rawData?.brideName || rawData?.name || '',
    weddingDate: rawData?.weddingDate || rawData?.date || null,
    visionQuiz: rawData?.visionQuiz || { result: rawData?.selectedStyle || null },
    budget: {
      total: rawData?.budget?.total || rawData?.totalBudget || 0,
      spent: rawData?.budget?.spent || rawData?.totalSpent || 0,
      categories: rawData?.budget?.categories || rawData?.budgetCategories || {},
    },
    vendorList: rawData?.vendorList || rawData?.vendors || [],
    taskList: rawData?.taskList || rawData?.tasks || [],
  });
  
  const pdfData = prepareData(data);
  const blob = await pdf(<WeddingDocument data={pdfData} />).toBlob();
  
  const filename = pdfData.brideName
    ? `${pdfData.brideName.replace(/\s+/g, '_')}_Wedding_Plan.pdf`
    : 'My_Wedding_Plan.pdf';
  
  saveAs(blob, filename);
};
