"use client";

import { useState, useCallback } from "react";
import { formatNumber } from "../../lib/format";
import { parseCommaNumber } from "./utils";

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  placeholder?: string;
  error?: string;
}

export default function NumberInput({
  id,
  label,
  value,
  onChange,
  suffix,
  placeholder,
  error,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);
  const [rawText, setRawText] = useState("");

  const handleFocus = () => {
    setFocused(true);
    setRawText(value ? String(value) : "");
  };

  const handleBlur = () => {
    setFocused(false);
    onChange(parseCommaNumber(rawText));
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;
      if (/^[\d,]*\.?\d*$/.test(nextValue) || nextValue === "") {
        setRawText(nextValue);
        onChange(parseCommaNumber(nextValue));
      }
    },
    [onChange]
  );

  const displayValue = focused ? rawText : value ? formatNumber(value) : "";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={
            "w-full rounded-lg border bg-white text-xs font-mono text-gray-900 " +
            "h-11 px-3 text-right placeholder:text-gray-300 placeholder:font-normal " +
            (suffix ? "pr-[4.5rem]" : "pr-3") +
            " focus-visible:outline-none transition-all duration-150 " +
            (error
              ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20"
              : "border-gray-300 focus-visible:border-[var(--excel-green)] focus-visible:ring-2 focus-visible:ring-[var(--excel-green)]/20")
          }
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 pointer-events-none select-none leading-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
