interface ToneSettingsProps {
  selectedTone: "friendly" | "urgent" | "subtle";
  onToneChange: (tone: "friendly" | "urgent" | "subtle") => void;
}

const tones = [
  { id: "friendly", label: "Friendly" },
  { id: "urgent", label: "Urgent" },
  { id: "subtle", label: "Subtle" },
] as const;

export default function ToneSettings({ selectedTone, onToneChange }: ToneSettingsProps) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3 text-black dark:text-white">Excuse Tone</h3>
      <div className="flex space-x-2">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onToneChange(tone.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ios-active ${
              selectedTone === tone.id
                ? 'bg-ios-blue text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tone.label}
          </button>
        ))}
      </div>
    </div>
  );
}
