"use client";

import { Fragment } from "react";
import { Link, ClipboardCheck, Clipboard } from "lucide-react";
import { Inputs, CalculationResult } from "../lib/types";
import { formatNumber } from "../lib/format";
import { useState } from "react";

interface FinancialSummaryProps {
  inputs: Inputs;
  result: CalculationResult;
}

export default function FinancialSummary({ inputs, result }: FinancialSummaryProps) {
  const [copied, setCopied] = useState(false);

  const formatCurrency = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)} MB`;
    return `${formatNumber(Math.round(num))} THB`;
  };

  const sections = {
    project: inputs.projectName || "Untitled Project",
    costs: [
      ["Land Acquisition", formatCurrency(result.totalLandCost)],
      ["Construction (GFA)", formatCurrency(result.totalConstructionCost)],
      ["Total Dev. Cost", formatCurrency(result.totalDevCost)],
    ],
    unitCosts: [
      ["Land Cost / NSA", `${formatNumber(Math.round(result.landCostPerNSA))} ฿/ตร.ม.`],
      ["Construction / NSA", `${formatNumber(Math.round(result.constructionCostPerNSA))} ฿/ตร.ม.`],
      ["Breakeven (NSA)", `${formatNumber(Math.round(result.landCostPerNSA + result.constructionCostPerNSA))} ฿/ตร.ม.`],
    ],
    performance: [
      ["Gross Margin (%)", `${result.grossMargin.toFixed(1)}%`],
      ["Net Profit (THB)", formatCurrency(result.netProfit)],
      ["COGs (%)", `${result.cogs.toFixed(1)}%`],
    ],
  };

  const allRows: Array<
    { type: "heading"; text: string } | { type: "row"; label: string; value: string }
  > = [
    { type: "heading", text: "Cost Breakdown" },
    ...sections.costs.map(([l, v]) => ({ type: "row" as const, label: l, value: v })),
    { type: "heading", text: "Unit Analysis (per NSA)" },
    ...sections.unitCosts.map(([l, v]) => ({ type: "row" as const, label: l, value: v })),
    { type: "heading", text: "Performance" },
    ...sections.performance.map(([l, v]) => ({ type: "row" as const, label: l, value: v })),
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gm = result.grossMargin;
  const gmStatus = gm >= 30 ? "Excellent profitability." : gm >= 20 ? "Standard market range." : "Low margin - consider optimizing costs or price.";
  const gmColor = gm >= 30 ? "text-emerald-700" : gm >= 20 ? "text-sky-700" : "text-amber-700";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Financial Summary</h3>
          <p className="text-xs text-gray-500">
            Project cost structure and profitability analysis.
          </p>
        </div>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-600 bg-white px-3 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-50 transition-colors"
        >
          {copied ? <ClipboardCheck className="h-4 w-4" /> : <Link className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      <div className="rounded-lg bg-gray-50 px-4 py-4 grid grid-cols-[auto_1fr] gap-x-3 text-sm">
        {allRows.map((item, i) =>
          item.type === "heading" ? (
            <p key={i} className={`col-span-2 font-bold text-gray-900 ${i > 0 ? "mt-3" : ""}`}>
              {item.text}
            </p>
          ) : (
            <Fragment key={i}>
              <span className="text-gray-500 whitespace-nowrap">{item.label}:</span>
              <span className="font-medium text-gray-800 text-right">{item.value}</span>
            </Fragment>
          )
        )}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-sky-50/50 border border-sky-100">
        <p className={`text-xs font-semibold ${gmColor}`}>
          Insight: {gmStatus}
        </p>
      </div>
    </div>
  );
}
