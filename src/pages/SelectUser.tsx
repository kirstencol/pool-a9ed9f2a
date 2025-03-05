
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const UserOption = ({ 
  name, 
  isSelected, 
  onClick 
}: { 
  name: string; 
  isSelected: boolean; 
  onClick: () => void 
}) => {
  return (
    <div 
      className={`flex items-center p-4 rounded-xl mb-4 cursor-pointer transition-all ${
        isSelected ? "bg-purple/10 border-2 border-purple" : "border-2 border-gray-100"
      }`}
      onClick={onClick}
    >
      <Avatar 
        initial={name.charAt(0)} 
        size="lg"
        position={name === "Abby" ? "first" : name === "Burt" ? "second" : "third"}
        className="mr-6" 
      />
      <span className="text-2xl font-medium">{name}</span>
    </div>
  );
};

const SelectUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  // Get the inviteId and flow type from the URL if present
  const searchParams = new URLSearchParams(location.search);
  const inviteId = searchParams.get('id');
  const flowType = searchParams.get('flow');
  
  // Determine the header text based on the flow type
  const headerText = flowType === 'abby-location-response' 
    ? "Hi!\n\nLet's nail down a spot to meet."
    : "Hi! Let's find a time to get together.";
  
  const handleContinue = () => {
    if (!selectedUser) {
      toast({
        title: "Please select who you are",
        description: "Select your name to continue",
        variant: "destructive"
      });
      return;
    }
    
    // Store the selected user in localStorage
    localStorage.setItem('currentUser', selectedUser);
    
    // Special case for the Abby location response flow
    if (flowType === 'abby-location-response') {
      // Only allow Abby to proceed to the location response page
      if (selectedUser === "Abby") {
        navigate('/abby-location-response');
      } else {
        toast({
          title: "This flow is for Abby",
          description: "Please select Abby to continue with this demo flow",
          variant: "destructive"
        });
      }
      return;
    }
    
    // For Carrie, navigate directly to CarrieFlow
    if (selectedUser === "Carrie") {
      navigate(`/carrie-flow?id=${inviteId || 'carrie_demo'}`);
      return;
    }
    
    // For Burt, navigate to the specific demo or the provided invite
    if (selectedUser === "Burt") {
      if (inviteId) {
        navigate(`/respond/${inviteId}?name=${selectedUser}`);
      } else {
        navigate(`/respond/burt_demo?name=${selectedUser}`);
      }
      return;
    }
    
    // For Abby or any other user, navigate to the response page with the provided invite or demo
    if (inviteId) {
      navigate(`/respond/${inviteId}?name=${selectedUser}`);
    } else {
      navigate(`/respond/demo_invite?name=${selectedUser}`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8 whitespace-pre-line">{headerText}</h1>
      
      <h2 className="text-xl font-medium mb-4">You are:</h2>
      
      <div className="space-y-4 mb-8">
        <UserOption 
          name="Abby" 
          isSelected={selectedUser === "Abby"} 
          onClick={() => setSelectedUser("Abby")} 
        />
        
        <UserOption 
          name="Burt" 
          isSelected={selectedUser === "Burt"} 
          onClick={() => setSelectedUser("Burt")} 
        />
        
        <UserOption 
          name="Carrie" 
          isSelected={selectedUser === "Carrie"} 
          onClick={() => setSelectedUser("Carrie")} 
        />
      </div>
      
      <Button 
        className="action-button"
        onClick={handleContinue}
        disabled={!selectedUser}
      >
        Continue
      </Button>
    </div>
  );
};

export default SelectUser;
