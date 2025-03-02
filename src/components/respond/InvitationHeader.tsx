
import React from "react";
import Avatar from "@/components/Avatar";

interface InvitationHeaderProps {
  creatorName: string;
  responderName: string;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({
  creatorName,
  responderName,
}) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <Avatar initial={creatorName.charAt(0)} position="first" size="lg" className="mr-4" />
        <div>
          <h1 className="text-xl font-semibold">You're invited!</h1>
          <p className="text-gray-600">{creatorName} wants to meet up.</p>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <Avatar initial={responderName.charAt(0)} position="second" className="mr-2" />
        <h2 className="font-medium">When are you free, {responderName}?</h2>
      </div>
    </>
  );
};

export default InvitationHeader;
