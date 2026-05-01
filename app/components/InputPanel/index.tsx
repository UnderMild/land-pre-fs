"use client";

import { useMemo, useState } from "react";
import { Inputs, SolverMode } from "../../lib/types";
import { validateInputs } from "../../lib/validate";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";
import SectionHeader from "./SectionHeader";
import { Map, Calculator, Coins, Percent, Target, RotateCcw } from "lucide-react";

interface InputPanelProps {
  inputs: Inputs;
  onChange: (updates: Partial<Inputs>) => void;
  onReset: () => void;
  solverMode: SolverMode;
  onSolverModeChange: (mode: SolverMode) => void;
}

export default function InputPanel({
  inputs,
  onChange,
  onReset,
  solverMode,
  onSolverModeChange,
}: InputPanelProps) {
  const [sections, setSections] = useState({
    land: true,
    development: true,
    financials: true,
    targets: true,
  });

  const errors = useMemo(() => validateInputs(inputs), [inputs]);

  const handleChange = (field: keyof Inputs) => (value: number) => {
    onChange({ [field]: value });
  };

  const toggleSection = (s: keyof typeof sections) =>
    setSections((prev) => ({ ...prev, [s]: !prev[s] }));

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[var(--excel-green)]" />
              Project Inputs
            </h2>
            <p className="text-xs text-gray-500">กรอกข้อมูลโครงการเพื่อวิเคราะห์ความเป็นไปได้</p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--excel-green)] bg-white px-3 py-2 text-xs font-semibold text-[var(--excel-green)] hover:bg-[var(--excel-green)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)] focus-visible:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All
          </button>
        </div>

        <TextInput
          id="project-name"
          label="Project Name"
          value={inputs.projectName || ""}
          onChange={(v) => onChange({ projectName: v })}
          placeholder="e.g. Sukhumvit Condo Project"
        />
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-4 sm:p-5">
        <SectionHeader
          icon={Map}
          title="Land Information"
          isOpen={sections.land}
          onToggle={() => toggleSection("land")}
        />
        {sections.land && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            <NumberInput
              id="rai"
              label="ไร่"
              value={inputs.rai}
              onChange={handleChange("rai")}
              suffix="ไร่"
              error={errors.rai}
            />
            <NumberInput
              id="ngan"
              label="งาน"
              value={inputs.ngan}
              onChange={handleChange("ngan")}
              suffix="งาน"
              error={errors.ngan}
            />
            <NumberInput
              id="sqw"
              label="วา"
              value={inputs.sqw}
              onChange={handleChange("sqw")}
              suffix="ตร.ว."
              error={errors.sqw}
            />
          </div>
        )}
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-4 sm:p-5">
        <SectionHeader
          icon={Target}
          title="Development"
          isOpen={sections.development}
          onToggle={() => toggleSection("development")}
        />
        {sections.development && (
          <div className="flex flex-col gap-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                id="far"
                label="Base FAR"
                value={inputs.far}
                onChange={handleChange("far")}
                suffix=": 1"
                error={errors.far}
              />
              <NumberInput
                id="bonusFar"
                label="Bonus FAR"
                value={inputs.bonusFar}
                onChange={handleChange("bonusFar")}
                suffix="%"
                error={errors.bonusFar}
              />
            </div>
            <NumberInput
              id="efficiency"
              label="Efficiency (NSA/GFA)"
              value={inputs.efficiency * 100}
              onChange={(v) => onChange({ efficiency: v / 100 })}
              suffix="%"
              error={errors.efficiency}
            />
          </div>
        )}
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-4 sm:p-5">
        <SectionHeader
          icon={Coins}
          title="Financials"
          subtitle="เลือก Solver เพื่อคำนวณย้อนกลับ"
          isOpen={sections.financials}
          onToggle={() => toggleSection("financials")}
        />
        {sections.financials && (
          <div className="space-y-3 mt-3">
            <div
              className={`p-3 rounded-lg border transition-all ${solverMode === "land" ? "bg-[var(--excel-green)]/[0.04] border-[var(--excel-green)]/30 ring-1 ring-[var(--excel-green)]/20" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Land Price</span>
                <button
                  onClick={() => onSolverModeChange("land")}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${solverMode === "land" ? "bg-[var(--excel-green)] text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
                >
                  {solverMode === "land" ? "Solving" : "Set as Solver"}
                </button>
              </div>
              <NumberInput
                id="landPrice"
                label=""
                value={inputs.landPrice}
                onChange={handleChange("landPrice")}
                suffix="฿/ตร.ว."
                error={errors.landPrice}
              />
            </div>

            <div
              className={`p-3 rounded-lg border transition-all ${solverMode === "construction" ? "bg-[var(--excel-green)]/[0.04] border-[var(--excel-green)]/30 ring-1 ring-[var(--excel-green)]/20" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Construction Cost
                </span>
                <button
                  onClick={() => onSolverModeChange("construction")}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${solverMode === "construction" ? "bg-[var(--excel-green)] text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
                >
                  {solverMode === "construction" ? "Solving" : "Set as Solver"}
                </button>
              </div>
              <NumberInput
                id="constructionCost"
                label=""
                value={inputs.constructionCost}
                onChange={handleChange("constructionCost")}
                suffix="฿/ตร.ม."
                error={errors.constructionCost}
              />
            </div>

            <div
              className={`p-3 rounded-lg border transition-all ${solverMode === "selling" ? "bg-[var(--excel-green)]/[0.04] border-[var(--excel-green)]/30 ring-1 ring-[var(--excel-green)]/20" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Selling Price</span>
                <button
                  onClick={() => onSolverModeChange("selling")}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${solverMode === "selling" ? "bg-[var(--excel-green)] text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
                >
                  {solverMode === "selling" ? "Solving" : "Set as Solver"}
                </button>
              </div>
              <NumberInput
                id="sellingPrice"
                label=""
                value={inputs.sellingPrice}
                onChange={handleChange("sellingPrice")}
                suffix="฿/ตร.ม. (NSA)"
                error={errors.sellingPrice}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-4 sm:p-5">
        <SectionHeader
          icon={Percent}
          title="Targets & Tax"
          isOpen={sections.targets}
          onToggle={() => toggleSection("targets")}
        />
        {sections.targets && (
          <div className="flex flex-col gap-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                id="targetGM"
                label="Target GM"
                value={inputs.targetGM * 100}
                onChange={(v) => onChange({ targetGM: v / 100 })}
                suffix="%"
                error={errors.targetGM}
              />
              <NumberInput
                id="netProfitPct"
                label="Net Margin"
                value={inputs.netProfitPct * 100}
                onChange={(v) => onChange({ netProfitPct: v / 100 })}
                suffix="%"
                error={errors.netProfitPct}
              />
            </div>
            <NumberInput
              id="landTax"
              label="Land Tax/Fees"
              value={inputs.landTax * 100}
              onChange={(v) => onChange({ landTax: v / 100 })}
              suffix="%"
              error={errors.landTax}
            />
          </div>
        )}
      </div>
    </div>
  );
}
