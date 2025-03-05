
import React from 'react';

const LoadingState = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6 animate-pulse">
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
