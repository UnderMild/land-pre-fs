"use client";

import { Inputs, SolverMode } from "../../lib/types";
import NumberInput from "./NumberInput";
import SectionHeader from "./SectionHeader";
import { Map, Calculator, Coins, Percent, Target } from "lucide-react";

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
  const handleChange = (field: keyof Inputs) => (value: number) => {
    onChange({ [field]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
      <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[var(--excel-green)]" />
          Project Inputs
        </h2>
        <button
          onClick={onReset}
          className="text-[11px] font-semibold text-gray-500 hover:text-red-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Land Area */}
        <section className="space-y-4">
          <SectionHeader icon={Map} title="Land Information" />
          <div className="grid grid-cols-3 gap-3">
            <NumberInput
              id="rai"
              label="ไร่"
              value={inputs.rai}
              onChange={handleChange("rai")}
              suffix="ไร่"
            />
            <NumberInput
              id="ngan"
              label="งาน"
              value={inputs.ngan}
              onChange={handleChange("ngan")}
              suffix="งาน"
            />
            <NumberInput
              id="sqw"
              label="วา"
              value={inputs.sqw}
              onChange={handleChange("sqw")}
              suffix="ตร.ว."
            />
          </div>
        </section>

        {/* Development Parameters */}
        <section className="space-y-4">
          <SectionHeader icon={Target} title="Development" />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              id="far"
              label="Base FAR"
              value={inputs.far}
              onChange={handleChange("far")}
              suffix=": 1"
            />
            <NumberInput
              id="bonusFar"
              label="Bonus FAR"
              value={inputs.bonusFar}
              onChange={handleChange("bonusFar")}
              suffix="%"
            />
          </div>
          <NumberInput
            id="efficiency"
            label="Efficiency (NSA/GFA)"
            value={inputs.efficiency * 100}
            onChange={(v) => onChange({ efficiency: v / 100 })}
            suffix="%"
          />
        </section>

        {/* Financial Parameters */}
        <section className="space-y-4">
          <SectionHeader icon={Coins} title="Financials" />
          
          <div className="space-y-3">
            <div className={`p-3 rounded-lg border transition-all ${solverMode === 'land' ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-gray-50/50 border-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Land Price</span>
                <button 
                  onClick={() => onSolverModeChange('land')}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${solverMode === 'land' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                  {solverMode === 'land' ? 'Solving' : 'Set as Solver'}
                </button>
              </div>
              <NumberInput
                id="landPrice"
                label=""
                value={inputs.landPrice}
                onChange={handleChange("landPrice")}
                suffix="฿/ตร.ว."
              />
            </div>

            <div className={`p-3 rounded-lg border transition-all ${solverMode === 'construction' ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-gray-50/50 border-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Construction Cost</span>
                <button 
                  onClick={() => onSolverModeChange('construction')}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${solverMode === 'construction' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                  {solverMode === 'construction' ? 'Solving' : 'Set as Solver'}
                </button>
              </div>
              <NumberInput
                id="constructionCost"
                label=""
                value={inputs.constructionCost}
                onChange={handleChange("constructionCost")}
                suffix="฿/ตร.ม."
              />
            </div>

            <div className={`p-3 rounded-lg border transition-all ${solverMode === 'selling' ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-gray-50/50 border-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Selling Price</span>
                <button 
                  onClick={() => onSolverModeChange('selling')}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${solverMode === 'selling' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                  {solverMode === 'selling' ? 'Solving' : 'Set as Solver'}
                </button>
              </div>
              <NumberInput
                id="sellingPrice"
                label=""
                value={inputs.sellingPrice}
                onChange={handleChange("sellingPrice")}
                suffix="฿/ตร.ม. (NSA)"
              />
            </div>
          </div>
        </section>

        {/* Targets */}
        <section className="space-y-4">
          <SectionHeader icon={Percent} title="Targets & Tax" />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              id="targetGM"
              label="Target GM"
              value={inputs.targetGM * 100}
              onChange={(v) => onChange({ targetGM: v / 100 })}
              suffix="%"
            />
            <NumberInput
              id="netProfitPct"
              label="Net Profit"
              value={inputs.netProfitPct * 100}
              onChange={(v) => onChange({ netProfitPct: v / 100 })}
              suffix="%"
            />
          </div>
          <NumberInput
            id="landTax"
            label="Land Tax/Fees"
            value={inputs.landTax * 100}
            onChange={(v) => onChange({ landTax: v / 100 })}
            suffix="%"
          />
        </section>
      </div>
    </div>
  );
}
