"use client";

import { ChevronDown } from "lucide-react";

interface SectionHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  isOpen = true,
  onToggle,
}: SectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      disabled={!onToggle}
      className={`flex items-center gap-2.5 w-full py-2.5 text-left active:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)] focus-visible:ring-offset-2 rounded-lg ${!onToggle ? 'cursor-default pointer-events-none' : ''}`}
    >
      <div className="w-7 h-7 rounded-md bg-[var(--excel-green)]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[var(--excel-green)]" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-bold text-gray-800 block">{title}</span>
        {subtitle && <span className="text-[10px] text-gray-400 block">{subtitle}</span>}
      </div>
      {onToggle && (
        <ChevronDown
          className={
            "w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 " +
            (isOpen ? "rotate-0" : "-rotate-90")
          }
        />
      )}
    </button>
  );
}
