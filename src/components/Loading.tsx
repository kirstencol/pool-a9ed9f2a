
import React, { useEffect, useState } from 'react';

interface LoadingProps {
  message?: string;
  subtitle?: string;
  delay?: number;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  subtitle = "Please wait while we prepare your data",
  delay = 100
}) => {
  // Add a fade-in effect with a slight delay to reduce flickering for quick loads
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Using requestAnimationFrame for smoother transitions
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [delay]);
  
  // Apply the visibility class only after mounting to prevent flash
  return (
    <div 
      className={`max-w-md mx-auto px-4 py-16 transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ willChange: 'opacity' }}
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
