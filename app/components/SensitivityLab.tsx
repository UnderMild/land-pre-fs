"use client";

import { useState, useMemo } from "react";
import { Inputs } from "../lib/types";
import { runSensitivityAnalysis, SensitivityParam, SensitivityKPI } from "../lib/sensitivity";
import { formatNumber } from "../lib/format";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { FlaskConical, Settings2, Info } from "lucide-react";

interface SensitivityLabProps {
  inputs: Inputs;
}

export default function SensitivityLab({ inputs }: SensitivityLabProps) {
  const [param, setParam] = useState<SensitivityParam>("landPrice");
  const [kpi, setKpi] = useState<SensitivityKPI>("requiredSellingPrice");
  const [steps, setSteps] = useState(11);

  // Range defaults based on param
  const range = useMemo(() => {
    if (param === "landPrice") return { min: inputs.landPrice * 0.5, max: inputs.landPrice * 1.5 };
    if (param === "constructionCost") return { min: 15000, max: 40000 };
    if (param === "efficiency") return { min: 60, max: 90 };
    if (param === "far") return { min: 1, max: 8 };
    return { min: 0, max: 100 };
  }, [param, inputs.landPrice]);

  const [min, setMin] = useState(range.min);
  const [max, setMax] = useState(range.max);

  // Reset min/max when param changes
  useEffect(() => {
    setMin(range.min);
    setMax(range.max);
  }, [range]);

  const data = useMemo(() => {
    return runSensitivityAnalysis(inputs, param, min, max, steps);
  }, [inputs, param, min, max, steps]);

  const kpiLabels: Record<SensitivityKPI, string> = {
    requiredSellingPrice: "Req. Selling Price (฿/m²)",
    grossMargin: "Gross Margin (%)",
    netProfit: "Net Profit (THB)",
    breakeven: "Breakeven Price (฿/m²)",
  };

  const paramLabels: Record<SensitivityParam, string> = {
    landPrice: "Land Price (฿/วา)",
    constructionCost: "Construction Cost (฿/m²)",
    efficiency: "Efficiency (%)",
    far: "FAR",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-sky-600" />
          Sensitivity Analysis Lab
        </h2>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Variable (X)</label>
            <select
              value={param}
              onChange={(e) => setParam(e.target.value as SensitivityParam)}
              className="w-full bg-white border border-gray-200 rounded-lg h-9 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="landPrice">Land Price</option>
              <option value="constructionCost">Construction Cost</option>
              <option value="efficiency">Efficiency</option>
              <option value="far">FAR</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Result (Y)</label>
            <select
              value={kpi}
              onChange={(e) => setKpi(e.target.value as SensitivityKPI)}
              className="w-full bg-white border border-gray-200 rounded-lg h-9 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="requiredSellingPrice">Required Selling Price</option>
              <option value="grossMargin">Gross Margin %</option>
              <option value="netProfit">Net Profit</option>
              <option value="breakeven">Breakeven Price</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Range (Min - Max)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg h-9 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg h-9 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Steps</label>
            <input
              type="range"
              min="5"
              max="21"
              step="2"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full h-9 accent-sky-600"
            />
          </div>
        </div>

        {/* Chart */}
        <div className="h-[350px] w-full bg-white rounded-xl border border-gray-100 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="paramValue" 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                label={{ value: paramLabels[param], position: 'bottom', offset: 0, fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(val) => param === 'efficiency' ? `${val}%` : formatNumber(val)}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                label={{ value: kpiLabels[kpi], angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(val) => kpi === 'grossMargin' ? `${val}%` : formatNumber(val)}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(val) => `${paramLabels[param]}: ${param === 'efficiency' ? val + '%' : formatNumber(val)}`}
                formatter={(val: any) => [kpi === 'grossMargin' ? Number(val).toFixed(2) + '%' : formatNumber(Math.round(Number(val))), kpiLabels[kpi]]}
              />
              <Line 
                type="monotone" 
                dataKey={kpi} 
                stroke="#0284c7" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-sky-50 border border-sky-100">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-sky-800 leading-relaxed">
            <strong>Analysis Logic:</strong> This lab recalculates the entire project feasibility for each step on the X-axis. 
            {kpi === 'requiredSellingPrice' && " 'Required Selling Price' shows the price point needed to maintain your Target GM% as costs change."}
            {kpi === 'grossMargin' && " 'Gross Margin %' shows how your profitability fluctuates if the Selling Price remains fixed at your current input."}
          </p>
        </div>
      </div>
    </div>
  );
}
