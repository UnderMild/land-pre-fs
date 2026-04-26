import { Suspense } from "react";
import HomeClient from "./components/HomeClient";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 animate-pulse font-medium">Loading Analysis...</div>
      </div>
    }>
      <HomeClient />
    </Suspense>
  );
}
