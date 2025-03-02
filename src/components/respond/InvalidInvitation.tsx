
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvalidInvitationProps {
  reason?: 'expired' | 'invalid' | 'loading';
}

const InvalidInvitation: React.FC<InvalidInvitationProps> = ({ 
  reason = 'invalid' 
}) => {
  const navigate = useNavigate();
  
  const getMessage = () => {
    switch (reason) {
      case 'expired':
        return "This invitation link has expired.";
      case 'loading':
        return "Loading invitation details...";
      case 'invalid':
      default:
        return "This invitation link appears to be invalid or has expired.";
    }
  };
  
  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">
          {reason === 'loading' ? 'Loading Invitation' : 'Invalid Invitation'}
        </h1>
        <p className="text-gray-600 mb-6">{getMessage()}</p>
        <Button 
          onClick={() => navigate("/")} 
          className="flex items-center"
        >
          <ArrowLeft className="mr-2" size={16} />
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

export default InvalidInvitation;
