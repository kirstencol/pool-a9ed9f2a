
import { useNavigate } from "react-router-dom";

const NoTimeSlotsView: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6 text-center">
      <h3 className="text-lg font-medium text-red-600 mb-2">No time slots available</h3>
      <p className="text-gray-600 mb-4">There are no time slots available for this invitation.</p>
      <button 
        onClick={() => navigate('/')}
        className="text-purple-500 hover:underline font-medium"
      >
        Return to home
      </button>
    </div>
  );
};

export default NoTimeSlotsView;
