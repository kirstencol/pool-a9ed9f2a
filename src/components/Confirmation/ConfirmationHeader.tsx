
import React from 'react';
import { Sparkles } from "lucide-react";

interface ConfirmationHeaderProps {
  displayNames: string;
}

const ConfirmationHeader = ({ displayNames }: ConfirmationHeaderProps) => {
  return (
    <>
      <div className="celebration-animation bg-purple-100">
        <Sparkles className="text-purple-500" size={32} />
      </div>
      
      <h1 className="text-2xl font-semibold text-center mb-6">
        {displayNames} are both free...
      </h1>
    </>
  );
};

export default ConfirmationHeader;
