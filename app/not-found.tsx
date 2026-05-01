import Link from "next/link";
import { MapPin, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50/80">
      <div className="max-w-md w-full rounded-xl border border-gray-200 bg-white p-8 sm:p-10 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-xl bg-[var(--excel-green)]/10 flex items-center justify-center mb-6">
          <MapPin className="w-7 h-7 text-[var(--excel-green)]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--excel-green)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--excel-green-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)] focus-visible:ring-offset-2"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
