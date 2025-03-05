
import React from 'react';
import { Check, ChevronLeft } from "lucide-react";

interface FallbackStateProps {
  onGoBack: () => void;
}

const FallbackState = ({ onGoBack }: FallbackStateProps) => {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="celebration-animation">
        <Check className="text-white" size={32} />
      </div>
      <h1 className="text-2xl font-semibold text-center mb-6">Your response has been saved!</h1>
      <p className="text-center text-gray-600 mb-8">Thanks for letting us know when you're free.</p>
      
      <button
        onClick={onGoBack}
        className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors mt-8 mx-auto"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Oops, go back</span>
      </button>
    </div>
  );
};

export default FallbackState;
