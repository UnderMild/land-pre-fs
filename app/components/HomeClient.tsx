"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Inputs, DEFAULT_INPUTS, SolverMode } from "../lib/types";
import { parseInputsFromParams, useUrlSync } from "../lib/useUrlSync";
import { calculateProjection, applySolver } from "../lib/calculate";
import InputPanel from "./InputPanel";
import KpiDashboard from "./KpiDashboard";
import FinancialSummary from "./FinancialSummary";
import SensitivityLab from "./SensitivityLab";
import { MapPin } from "lucide-react";

export default function HomeClient() {
  const searchParams = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => parseInputsFromParams(searchParams));
  const [solverMode, setSolverMode] = useState<SolverMode>("selling");

  useUrlSync(inputs);

  const result = useMemo(() => calculateProjection(inputs), [inputs]);

  const solverLock = useRef(false);

  const handleInputChange = useCallback(
    (updates: Partial<Inputs>) => {
      if (solverLock.current) return;
      solverLock.current = true;

      setInputs((prev) => {
        const next = { ...prev, ...updates };
        const res = calculateProjection(next);
        if (res.nsa > 0) {
          const solved = applySolver(solverMode, next, res);
          Object.assign(next, solved);
        }
        return next;
      });

      queueMicrotask(() => {
        solverLock.current = false;
      });
    },
    [solverMode]
  );

  const handleSolverModeChange = useCallback(
    (mode: SolverMode) => {
      setSolverMode(mode);
      setInputs((prev) => {
        const res = calculateProjection(prev);
        if (res.nsa <= 0) return prev;
        const solved = applySolver(mode, prev, res);
        return { ...prev, ...solved };
      });
    },
    []
  );

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setSolverMode("selling");
  };

  return (
    <div className="relative min-h-screen bg-gray-50/80 flex flex-col">
      <a
        href="#main-content"
        className="absolute -top-20 left-4 z-[100] px-4 py-2 bg-white text-gray-900 rounded-lg shadow-lg transition-[top] duration-150 focus-visible:top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)]"
      >
        Skip to main content
      </a>
      <header className="bg-[var(--excel-green)] sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
              Land Pre-FS
            </h1>
            <p className="text-[11px] sm:text-xs text-white/70 truncate">
              {inputs.projectName || "Advanced Real Estate Feasibility Analysis"}
            </p>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <aside className="w-full lg:w-[400px] xl:w-[420px] lg:shrink-0 lg:self-start lg:sticky lg:top-[72px] lg:max-h-[calc(100vh-72px-2rem)] lg:overflow-y-auto lg:pr-1">
            <InputPanel
              inputs={inputs}
              onChange={handleInputChange}
              onReset={handleReset}
              solverMode={solverMode}
              onSolverModeChange={handleSolverModeChange}
            />
          </aside>

          <section className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
            <KpiDashboard result={result} />
            <FinancialSummary inputs={inputs} result={result} />
            <SensitivityLab inputs={inputs} />
          </section>
        </div>
      </main>
    </div>
  );
}
