
import React from "react";
import { useNavigate } from "react-router-dom";

const InvalidInvite: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Invalid Invitation</h1>
        <p className="text-gray-600 mb-6">This invitation link appears to be invalid or has expired.</p>
        <button 
          onClick={() => navigate("/")} 
          className="action-button"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default InvalidInvite;
