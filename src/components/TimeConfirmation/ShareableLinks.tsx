
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareableLinksProps {
  shareableLink: string;
  burtDirectLink: string;
  inviteId: string;
}

const ShareableLinks = ({ shareableLink, burtDirectLink, inviteId }: ShareableLinksProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 3000);
  };
  
  const copyBurtLink = () => {
    navigator.clipboard.writeText(burtDirectLink);
    setCopied(true);
    toast({
      title: "Burt's direct link copied!",
      description: "This link will take you directly to Burt's response flow",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 rounded-xl mb-4 text-center">
        <p className="text-green-700 font-medium">Your meeting data is saved!</p>
        <p className="text-green-600 text-sm">
          Your unique link ID: <span className="font-mono bg-white px-2 py-1 rounded">{inviteId}</span>
        </p>
      </div>
      
      <button
        onClick={copyLink}
        className="action-button w-full bg-purple-600 text-white py-3 px-4 rounded-xl flex items-center justify-center font-medium"
      >
        Copy link to send to friends
        {copied ? <Check className="w-5 h-5 ml-2" /> : <Copy className="w-5 h-5 ml-2" />}
      </button>
      
      <button
        onClick={copyBurtLink}
        className="border border-purple-500 text-purple-500 hover:bg-purple-50 px-4 py-2 rounded-md w-full transition-colors"
      >
        Copy direct link to Burt's view
      </button>
    </div>
  );
};

export default ShareableLinks;
