
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareableLinksProps {
  shareableLink: string;
  burtDirectLink: string;
  inviteId: string;
}

const ShareableLinks = ({ shareableLink }: ShareableLinksProps) => {
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

  return (
    <div className="space-y-4">
      <button
        onClick={copyLink}
        className="action-button w-full bg-purple-600 text-white py-3 px-4 rounded-xl flex items-center justify-center font-medium"
      >
        Copy link to send to friends
        {copied ? <Check className="w-5 h-5 ml-2" /> : <Copy className="w-5 h-5 ml-2" />}
      </button>
    </div>
  );
};

export default ShareableLinks;
