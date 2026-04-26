"use client";

import { CalculationResult } from "../lib/types";
import { formatNumber } from "../lib/format";
import { Map, Layout, Building2, BadgeDollarSign } from "lucide-react";

interface KpiDashboardProps {
  result: CalculationResult;
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "rounded-xl p-3.5 sm:p-4 flex flex-col gap-0.5 " +
        "border transition-colors " +
        (accent
          ? "border-sky-500/30 bg-sky-50"
          : "border-gray-200 bg-white")
      }
    >
      <div className="flex items-start gap-2 mb-1">
        <Icon
          className={
            "w-4 h-4 shrink-0 mt-0.5 " + (accent ? "text-sky-600" : "text-gray-400")
          }
        />
        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate flex-1">
          {label}
        </span>
      </div>
      <span
        className={
          "text-lg sm:text-xl font-bold font-mono leading-tight " +
          (accent ? "text-sky-700" : "text-gray-900")
        }
      >
        {value}
      </span>
      {sub && <span className="text-[10px] sm:text-xs text-gray-400 truncate">{sub}</span>}
    </div>
  );
}

export default function KpiDashboard({ result }: KpiDashboardProps) {
  const { landSqw, landSqm, gfa, nsa, projectValue } = result;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
      <KpiCard
        icon={Map}
        label="Land Area"
        value={`${formatNumber(landSqw)} วา`}
        sub={`${formatNumber(landSqm)} ตร.ม.`}
      />
      <KpiCard
        icon={Layout}
        label="GFA"
        value={`${formatNumber(Math.round(gfa))} ตร.ม.`}
        sub="Gross Floor Area"
      />
      <KpiCard
        icon={Building2}
        label="NSA"
        value={`${formatNumber(Math.round(nsa))} ตร.ม.`}
        sub="Net Saleable Area"
      />
      <KpiCard
        icon={BadgeDollarSign}
        label="Project Value"
        value={`${(projectValue / 1_000_000).toFixed(1)} MB`}
        sub="Estimate Total Sales"
        accent
      />
    </div>
  );
}
