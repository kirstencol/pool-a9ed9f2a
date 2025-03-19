
import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
        return "Loading invitation details...";
      case 'invalid':
      default:
        return "This invitation link appears to be invalid or has expired.";
    }
  };

  const getTitle = () => {
    return reason === 'loading' ? 'Loading Invitation' : 'Invalid Invitation';
  };
  
  // Use useCallback to ensure the function doesn't change on re-renders
  const handleGoHome = useCallback(() => {
    console.log("Navigating to homepage");
    navigate("/", { replace: true });
  }, [navigate]);
  
  // Add a specific class to prevent flickering animation
  const containerClass = reason === 'loading' 
    ? "max-w-md mx-auto px-4 py-8" 
    : "max-w-md mx-auto px-4 py-8 animate-fade-in";
  
  return (
    <div className={containerClass}>
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">
          {getTitle()}
        </h1>
        <p className="text-gray-600 mb-6">{getMessage()}</p>
        <Button 
          onClick={handleGoHome} 
          className="flex items-center"
          variant={reason === 'loading' ? "secondary" : "default"}
        >
          <ArrowLeft className="mr-2" size={16} />
          Go to Homepage
        </Button>
      </div>
    </div>
  );
});

InvalidInvitation.displayName = 'InvalidInvitation';

export default InvalidInvitation;
