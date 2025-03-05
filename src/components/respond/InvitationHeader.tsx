
import React from "react";
import Avatar from "@/components/Avatar";

interface InvitationHeaderProps {
  creatorName: string;
  responderName: string;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({
  responderName,
}) => {
  return (
    <div className="flex items-center mb-6">
      <Avatar initial={responderName.charAt(0)} position="second" className="mr-3" />
      <h2 className="font-medium text-lg">When are you free, {responderName}?</h2>
    </div>
  );
};

export default InvitationHeader;
