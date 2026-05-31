import { BUILTIN_SAMPLES } from "@filesniff/core";

interface Props {
  onSample: (bytes: Uint8Array, name: string) => void;
}

const ENTRIES = Object.entries(BUILTIN_SAMPLES) as [
  string,
  { name: string; bytes: Uint8Array },
][];

export function SamplePicker({ onSample }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <span className="text-xs text-muted w-full text-center">Try a sample:</span>
      {ENTRIES.map(([key, s]) => (
        <button
          key={key}
          type="button"
          onClick={() => onSample(s.bytes, s.name)}
          className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white hover:border-accent/40 transition-colors"
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
