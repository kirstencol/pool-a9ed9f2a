
import React, { useState } from 'react';
import { Check, Link, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationLinksProps {
  meetingId: string;
  onGoBack: () => void;
  responderNames: string[];  // Change to string[] to match the correct type
}

const ConfirmationLinks = ({ meetingId, onGoBack, responderNames }: ConfirmationLinksProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/select-user?id=${meetingId || 'demo_invite'}`;
    
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-4">
      {responderNames.length < 2 && (
        <div className="mb-8 text-center">
          <h2 className="text-lg font-medium mb-2">
            {responderNames.length === 0 
              ? "Does anyone need a nudge?" 
              : responderNames[0] === "Burt" 
                ? "Does Carrie need a nudge?" 
                : "Does Burt need a nudge?"}
          </h2>
        </div>
      )}

      <div className="p-4 bg-green-50 rounded-xl mb-4 text-center">
        <p className="text-green-700 font-medium">Your meeting data is saved!</p>
        <p className="text-green-600 text-sm">
          Your unique link ID: <span className="font-mono bg-white px-2 py-1 rounded">{meetingId || 'demo_invite'}</span>
        </p>
      </div>
      
      <button
        onClick={copyLink}
        className="action-button w-full py-4 bg-purple-light text-purple-700 rounded-xl flex items-center justify-center"
      >
        Copy link to send to friends
        {copied ? <Check className="w-5 h-5 ml-2" /> : <Link className="w-5 h-5 ml-2" />}
      </button>
      
      <button
        onClick={onGoBack}
        className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors w-full mt-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Oops, go back</span>
      </button>
    </div>
  );
};

export default ConfirmationLinks;
