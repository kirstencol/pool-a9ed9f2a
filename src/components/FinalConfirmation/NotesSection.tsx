
import { ChangeEvent } from "react";

interface NotesSectionProps {
  notes: string;
  onNotesChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const NotesSection = ({ notes, onNotesChange }: NotesSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="font-medium mb-4">Notes:</h2>
      <textarea
        placeholder="Add any notes for the meeting..."
        className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-purple-500"
        rows={4}
        value={notes}
        onChange={onNotesChange}
      />
    </div>
  );
};

export default NotesSection;
