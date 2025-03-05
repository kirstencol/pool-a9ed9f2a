
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
  
  // Get the inviteId from the URL if present
  const searchParams = new URLSearchParams(location.search);
  const inviteId = searchParams.get('id');
  
  const handleContinue = () => {
    if (!selectedUser) {
      toast({
        title: "Please select who you are",
        description: "Select your name to continue",
        variant: "destructive"
      });
      return;
    }
    
    // For Carrie, navigate directly to CarrieFlow
    if (selectedUser === "Carrie") {
      localStorage.setItem('currentUser', 'Carrie');
      navigate(`/carrie-flow?id=${inviteId || 'carrie_demo'}`);
      return;
    }
    
    // For other users, navigate to the response page
    if (inviteId) {
      navigate(`/respond/${inviteId}?name=${selectedUser}`);
    } else {
      navigate(`/respond/demo_invite?name=${selectedUser}`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8">Hi! Let's find a time to get together.</h1>
      
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
