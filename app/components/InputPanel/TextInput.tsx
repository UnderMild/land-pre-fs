"use client";

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function TextInput({ id, label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white text-xs text-gray-900 h-11 px-3 placeholder:text-gray-300 placeholder:font-normal focus-visible:outline-none focus-visible:border-[var(--excel-green)] focus-visible:ring-2 focus-visible:ring-[var(--excel-green)]/20 transition-all duration-150"
      />
    </div>
  );
}
