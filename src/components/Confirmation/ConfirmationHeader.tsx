
import React from 'react';

interface ConfirmationHeaderProps {
  displayNames: string;
}

const ConfirmationHeader = ({ displayNames }: ConfirmationHeaderProps) => {
  return (
    <h1 className="text-2xl font-semibold text-center mb-6">
      {displayNames} are both free...
    </h1>
  );
};

export default ConfirmationHeader;
