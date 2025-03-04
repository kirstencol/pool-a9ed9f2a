
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvalidInvitationProps {
  reason?: 'expired' | 'invalid' | 'loading';
}

// Memoize this component since it doesn't change often
const InvalidInvitation: React.FC<InvalidInvitationProps> = memo(({ 
  reason = 'invalid' 
}) => {
  const navigate = useNavigate();
  
  const getMessage = () => {
    switch (reason) {
      case 'expired':
        return "This invitation link has expired.";
      case 'loading':
        return "Please wait while we load the invitation details...";
      case 'invalid':
      default:
        return "This invitation link appears to be invalid or has expired.";
    }
  };

  const getTitle = () => {
    return reason === 'loading' ? 'Loading Invitation' : 'Invalid Invitation';
  };
  
  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">
          {getTitle()}
        </h1>
        
        {reason === 'loading' && (
          <div className="flex justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        )}
        
        <p className="text-gray-600 mb-6">{getMessage()}</p>
        
        {reason !== 'loading' && (
          <Button 
            onClick={() => navigate("/")} 
            className="flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Go to Homepage
          </Button>
        )}
      </div>
    </div>
  );
});

InvalidInvitation.displayName = 'InvalidInvitation';

export default InvalidInvitation;
