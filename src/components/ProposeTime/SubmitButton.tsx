
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSubmitting: boolean;
}

const SubmitButton = ({ onClick, disabled, isSubmitting }: SubmitButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`action-button mt-6 sm:mt-8 ${disabled || isSubmitting ? 'bg-purple-300 hover:bg-purple-300 cursor-not-allowed' : 'bg-purple hover:bg-purple/90'}`}
      disabled={disabled || isSubmitting}
    >
      <ArrowRight size={20} />
    </button>
  );
};

export default SubmitButton;
