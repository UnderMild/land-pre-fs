"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-xl border border-red-200 bg-red-50/80 p-6 sm:p-8 text-center">
        <h1 className="text-lg font-bold text-red-800">Something went wrong</h1>
        <p className="mt-2 text-sm text-red-700">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[var(--excel-green)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--excel-green)] hover:bg-[var(--excel-green)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)] focus-visible:ring-offset-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
