
import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface LoadingProps {
  message?: string;
  subtitle?: string;
  delay?: number;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  subtitle = "Please wait while we prepare your data",
  delay = 0
}) => {
  // State for visibility and progress animation
  const [visible, setVisible] = useState(delay === 0);
  const [progress, setProgress] = useState(10);
  
  // Handle delayed visibility if needed
  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => {
        setVisible(true);
      }, delay);
      
      return () => clearTimeout(timeout);
    }
  }, [delay]);
  
  // Animate progress bar
  useEffect(() => {
    // Start with 10% progress
    setProgress(10);
    
    // Quick initial progress to 40%
    const timer1 = setTimeout(() => {
      setProgress(40);
    }, 200);
    
    // Then slower to 70%
    const timer2 = setTimeout(() => {
      setProgress(70);
    }, 600);
    
    // Finally to 90% (remaining 10% when actual loading completes)
    const timer3 = setTimeout(() => {
      setProgress(90);
    }, 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  return (
    <div 
      className={`max-w-md mx-auto px-4 py-12 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-medium text-center mb-2">{message}</h2>
        <p className="text-gray-600 mt-2 text-center mb-4">{subtitle}</p>
        
        <div className="w-full mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
