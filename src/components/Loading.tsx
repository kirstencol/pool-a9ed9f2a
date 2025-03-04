
import React from 'react';

interface LoadingProps {
  message?: string;
  subtitle?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  subtitle = "Please wait while we prepare your data" 
}) => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-medium text-center">{message}</h2>
        <p className="text-gray-600 mt-2 text-center">{subtitle}</p>
      </div>
    </div>
  );
};

export default Loading;
