
import React, { useEffect, useState } from 'react';

interface LoadingProps {
  message?: string;
  subtitle?: string;
  delay?: number;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  subtitle = "Please wait while we prepare your data",
  delay = 0 // Set to 0 to show immediately by default
}) => {
  // Simplified state - just fade in without delay logic
  const [visible, setVisible] = useState(delay === 0);
  
  useEffect(() => {
    // Only delay visibility if delay is > 0
    if (delay > 0) {
      const timeout = setTimeout(() => {
        setVisible(true);
      }, delay);
      
      return () => clearTimeout(timeout);
    }
  }, [delay]);
  
  return (
    <div 
      className={`max-w-md mx-auto px-4 py-16 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-medium text-center">{message}</h2>
        <p className="text-gray-600 mt-2 text-center">{subtitle}</p>
      </div>
    </div>
  );
};

export default Loading;
