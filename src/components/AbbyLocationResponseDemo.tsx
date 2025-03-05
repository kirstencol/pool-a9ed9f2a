
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AbbyLocationResponseDemo = () => {
  const navigate = useNavigate();
  
  const handleStartDemo = () => {
    navigate("/select-user?flow=abby-location-response");
  };
  
  return (
    <div className="p-4 bg-purple-50 rounded-lg mb-4">
      <h3 className="font-medium mb-2">Demo: Abby responds to Carrie's locations</h3>
      <Button 
        variant="outline" 
        onClick={handleStartDemo}
        className="w-full"
      >
        Start Demo
      </Button>
    </div>
  );
};

export default AbbyLocationResponseDemo;
