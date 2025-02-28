
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";

const Welcome = () => {
  const navigate = useNavigate();
  const { setCurrentUser, addParticipant } = useMeeting();
  const [name, setName] = useState("");
  const [friend1, setFriend1] = useState("");
  const [friend2, setFriend2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !friend1.trim() || !friend2.trim()) return;

    setCurrentUser({
      id: crypto.randomUUID(),
      name: name.trim(),
      initial: name.trim().charAt(0).toUpperCase(),
    });

    addParticipant(friend1.trim());
    addParticipant(friend2.trim());

    navigate("/propose-time");
  };

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
            placeholder="Who else?"
            value={friend1}
            onChange={(e) => setFriend1(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-DEFAULT"
          />
        </div>
        
        <div>
          <input
            type="text"
            placeholder="One more? Three's the magic number."
            value={friend2}
            onChange={(e) => setFriend2(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-DEFAULT"
          />
        </div>

        {name && friend1 && friend2 && (
          <div className="flex -space-x-2 my-8 justify-center">
            <Avatar initial={name.charAt(0)} className="border-2 border-white" />
            <Avatar initial={friend1.charAt(0)} className="border-2 border-white" />
            <Avatar initial={friend2.charAt(0)} className="border-2 border-white" />
          </div>
        )}
        
        <button
          type="submit"
          className="action-button"
          disabled={!name.trim() || !friend1.trim() || !friend2.trim()}
        >
          Next
          <ArrowRight className="ml-2" size={20} />
        </button>
      </form>
    </div>
  );
};

export default Welcome;
