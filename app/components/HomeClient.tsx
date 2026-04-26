"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Inputs, DEFAULT_INPUTS, BLANK_RESULT, SolverMode } from "../lib/types";
import { parseInputsFromParams, useUrlSync } from "../lib/useUrlSync";
import { calculateProjection, applySolver } from "../lib/calculate";
import InputPanel from "./InputPanel";
import KpiDashboard from "./KpiDashboard";
import FinancialSummary from "./FinancialSummary";
import SensitivityLab from "./SensitivityLab";
import { MapPin } from "lucide-react";

export default function HomeClient() {
  const searchParams = useSearchParams();

  // State
  const [inputs, setInputs] = useState<Inputs>(() => parseInputsFromParams(searchParams));
  const [solverMode, setSolverMode] = useState<SolverMode>("selling");

  // Sync with URL
  useUrlSync(inputs);

  // Calculation
  const result = useMemo(() => calculateProjection(inputs), [inputs]);

  // Solver Logic
  const handleSolverUpdate = useCallback(() => {
    const updates = applySolver(solverMode, inputs, result);
    if (Object.keys(updates).length > 0) {
      setInputs((prev) => ({ ...prev, ...updates }));
    }
  }, [solverMode, inputs, result]);

  // Auto-solve when dependencies change (but not when the solved field itself changes by the solver)
  // To keep it simple like the original, we can trigger solver on input changes
  // Or just rely on the user manually switching solver mode.
  // The original HTML triggered calculate() on input, and calculate() called applySolver().
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => {
    handleSolverUpdate();
  }, [
    inputs.rai, inputs.ngan, inputs.sqw, 
    inputs.far, inputs.bonusFar, inputs.efficiency,
    inputs.targetGM, inputs.landTax,
    // Add specific dependencies for each mode to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
    solverMode === 'selling' ? inputs.landPrice : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    solverMode === 'selling' ? inputs.constructionCost : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    solverMode === 'land' ? inputs.sellingPrice : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    solverMode === 'land' ? inputs.constructionCost : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    solverMode === 'construction' ? inputs.sellingPrice : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    solverMode === 'construction' ? inputs.landPrice : null,
  ]);

  const handleInputChange = (updates: Partial<Inputs>) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setSolverMode("selling");
  };

  return (
    <div className="relative min-h-screen bg-gray-50/80 flex flex-col">
      <header className="bg-sky-700 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
              Land Pre-FS
            </h1>
            <p className="text-[11px] sm:text-xs text-white/70 truncate">
              Advanced Real Estate Feasibility Analysis
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <aside className="w-full lg:w-[400px] xl:w-[420px] lg:shrink-0 lg:self-start lg:sticky lg:top-[72px]">
            <InputPanel 
              inputs={inputs} 
              onChange={handleInputChange} 
              onReset={handleReset}
              solverMode={solverMode}
              onSolverModeChange={setSolverMode}
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
