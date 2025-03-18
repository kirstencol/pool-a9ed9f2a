import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { initializeDemoData } from '@/context/meeting/storage';

const Welcome = () => {
  const navigate = useNavigate();
  const { setCurrentUser, addParticipant } = useMeeting();
  const [name, setName] = useState("");
  const [friend1, setFriend1] = useState("");
  const [friend2, setFriend2] = useState("");
  const [showDevTools, setShowDevTools] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("Welcome component mounted");
    setIsLoaded(true);
    return () => console.log("Welcome component unmounted");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { name, friend1, friend2 });
    
    if (!name.trim() || !friend1.trim()) return;

    setCurrentUser({
      id: crypto.randomUUID(),
      name: name.trim(),
      initial: name.trim().charAt(0).toUpperCase(),
    });

    addParticipant(friend1.trim());
    
    if (friend2.trim()) {
      addParticipant(friend2.trim());
    }

    navigate("/propose-time");
  };

  const isFormValid = name.trim() && friend1.trim();

  const toggleDevTools = () => {
    setShowDevTools(!showDevTools);
  };

  const goToRespondAsFriend = () => {
    initializeDemoData();
    console.log("Navigating to Friend Selection Screen: /select-user?id=demo_invite");
    navigate("/select-user?id=demo_invite");
  };

  const goToRespondAsBurt = () => {
    initializeDemoData();
    console.log("Navigating to Burt Selection Screen: /select-user?id=burt_demo");
    navigate("/select-user?id=burt_demo");
  };

  const goToRespondAsCarrie = () => {
    initializeDemoData();
    console.log("Navigating to Carrie Selection Screen: /select-user?id=carrie_demo");
    navigate("/select-user?id=carrie_demo");
  };
  
  const goToAbbyLocationResponse = () => {
    initializeDemoData();
    console.log("Navigating to Abby Location Response: /select-user?flow=abby-location-response");
    navigate("/select-user?flow=abby-location-response");
  };

  const goToBurtLocationConfirmation = () => {
    initializeDemoData();
    console.log("Navigating to Burt Location Confirmation: /select-user?flow=burt-location-confirmation");
    navigate("/select-user?flow=burt-location-confirmation");
  };

  if (!isLoaded) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
        <p className="text-center">Loading welcome screen...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-8">Let's get together.</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-DEFAULT"
          />
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Who else? (required)"
            value={friend1}
            onChange={(e) => setFriend1(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-DEFAULT"
          />
        </div>
        
        <div>
          <input
            type="text"
            placeholder="One more friend? (optional)"
            value={friend2}
            onChange={(e) => setFriend2(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-DEFAULT"
          />
        </div>

        {name && (
          <div className="flex -space-x-2 my-8 justify-center">
            <Avatar initial={name.charAt(0)} position="first" className="border-2 border-white" />
            {friend1 && <Avatar initial={friend1.charAt(0)} position="second" className="border-2 border-white" />}
            {friend2 && <Avatar initial={friend2.charAt(0)} position="third" className="border-2 border-white" />}
          </div>
        )}
        
        <button
          type="submit"
          className="action-button"
          disabled={!isFormValid}
        >
          <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-12">
        <button
          onClick={toggleDevTools}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showDevTools ? "Hide Developer Tools" : "Show Developer Tools"}
        </button>
        
        {showDevTools && (
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-sm font-medium mb-3">Developer Quick Access</h2>
            <div className="space-y-2">
              <Button 
                onClick={goToRespondAsFriend}
                variant="outline"
                className="w-full justify-start"
              >
                Test Friend's Response Flow
              </Button>
              <Button 
                onClick={goToRespondAsBurt}
                variant="outline"
                className="w-full justify-start"
              >
                Test Burt's Response Flow
              </Button>
              <Button 
                onClick={goToRespondAsCarrie}
                variant="outline"
                className="w-full justify-start"
              >
                Test Carrie's Response Flow
              </Button>
              <Button 
                onClick={goToAbbyLocationResponse}
                variant="outline"
                className="w-full justify-start"
              >
                Test Abby's Location Response Flow
              </Button>
              <Button 
                onClick={goToBurtLocationConfirmation}
                variant="outline"
                className="w-full justify-start"
              >
                Test Burt's Location Confirmation Flow
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
