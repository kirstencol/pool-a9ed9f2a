
import { Check } from "lucide-react";

const FinalConfirmationHeader = () => {
  return (
    <>
      <div className="flex items-center mb-8">
        <div className="celebration-animation">
          <Check className="text-white" size={32} />
        </div>
      </div>
      
      <h1 className="text-2xl font-semibold text-center mb-8">It's happening!</h1>
    </>
  );
};

export default FinalConfirmationHeader;
