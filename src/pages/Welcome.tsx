
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
    <div className="bg-gray-200 min-h-screen flex items-center justify-center py-6 px-4">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="status-bar">
          <div className="status-bar-time">7:15</div>
          <div className="status-bar-icons">
            <span>●●●</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold mb-8 mt-8 text-center">Let's get together.</h1>
        
        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="app-input"
          />
          
          <input
            type="text"
            placeholder="Who else?"
            value={friend1}
            onChange={(e) => setFriend1(e.target.value)}
            className="app-input"
          />
          
          <input
            type="text"
            placeholder="One more? Three's the magic number."
            value={friend2}
            onChange={(e) => setFriend2(e.target.value)}
            className="app-input"
          />

          <div className="h-32 flex items-center justify-center">
            {name && friend1 && friend2 && (
              <div className="flex -space-x-2 justify-center">
                <Avatar initial={name.charAt(0)} position="first" className="border-2 border-white" />
                <Avatar initial={friend1.charAt(0)} position="second" className="border-2 border-white" />
                <Avatar initial={friend2.charAt(0)} position="third" className="border-2 border-white" />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="action-button"
            disabled={!name.trim() || !friend1.trim() || !friend2.trim()}
          >
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
