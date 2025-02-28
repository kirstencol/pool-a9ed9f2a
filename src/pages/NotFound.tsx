
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-6 py-12 text-center animate-fade-in">
      <h1 className="text-3xl font-semibold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <p className="text-gray-600 mb-8">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link to="/" className="inline-flex items-center text-purple-500 hover:underline">
        <ArrowLeft className="mr-2" size={20} />
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
