"use client";

import { Fragment } from "react";
import { Link, Copy, Check, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Inputs, CalculationResult } from "../lib/types";
import { formatNumber } from "../lib/format";
import { exportToExcel } from "../lib/exportExcel";
import { useState } from "react";

interface FinancialSummaryProps {
  inputs: Inputs;
  result: CalculationResult;
}

function CopyButton({
  onCopy,
  label,
  icon,
}: {
  onCopy: () => Promise<void>;
  label: string;
  icon?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await onCopy();
      setCopied(true);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.warning("Could not copy to clipboard");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--excel-green)] bg-white px-3 py-2 text-xs font-semibold text-[var(--excel-green)] hover:bg-[var(--excel-green)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)] focus-visible:ring-offset-2"
    >
      {copied ? <Check className="h-4 w-4" /> : (icon ?? <Copy className="h-4 w-4" />)}
      {copied ? "Copied" : label}
    </button>
  );
}

export default function FinancialSummary({ inputs, result }: FinancialSummaryProps) {
  const [isExporting, setIsExporting] = useState(false);

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

  const buildCopyText = () => {
    const lines: string[] = [
      `Project: ${sections.project}`,
      "",
      "Cost Breakdown:",
      ...sections.costs.map(([k, v]) => `  ${k}: ${v}`),
      "",
      "Unit Analysis (per NSA):",
      ...sections.unitCosts.map(([k, v]) => `  ${k}: ${v}`),
      "",
      "Performance:",
      ...sections.performance.map(([k, v]) => `  ${k}: ${v}`),
    ];
    return lines.join("\n");
  };

  const handleExport = async () => {
    setIsExporting(true);
    toast.loading("Generating Excel file...", { id: "export-excel" });
    try {
      await exportToExcel(inputs, result);
      toast.success("Excel downloaded successfully!", { id: "export-excel" });
    } catch {
      toast.error("Export failed. Please try again.", { id: "export-excel" });
    } finally {
      setIsExporting(false);
    }
  };

  const gm = result.grossMargin;
  const gmStatus =
    gm >= 30
      ? "Excellent profitability."
      : gm >= 20
        ? "Standard market range."
        : "Low margin - consider optimizing costs or price.";
  const gmColor =
    gm >= 30 ? "text-emerald-700" : gm >= 20 ? "text-[var(--excel-green)]" : "text-amber-700";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Financial Summary</h3>
          <p className="text-xs text-gray-500">
            Project cost structure and profitability analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton
            onCopy={async () => {
              await navigator.clipboard.writeText(buildCopyText());
            }}
            label="Copy"
          />
          <CopyButton
            onCopy={async () => {
              await navigator.clipboard.writeText(window.location.href);
            }}
            label="Copy Link"
            icon={<Link className="h-4 w-4" />}
          />
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--excel-green)] bg-white px-3 py-2 text-xs font-semibold text-[var(--excel-green)] hover:bg-[var(--excel-green)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)] focus-visible:ring-offset-2 disabled:opacity-60"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 px-4 py-4 grid grid-cols-[auto_1fr] gap-x-3 select-text text-sm">
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

      <div className="mt-4 p-3 rounded-lg bg-[var(--excel-green)]/[0.04] border border-[var(--excel-green)]/10">
        <p className={`text-xs font-semibold ${gmColor}`}>Insight: {gmStatus}</p>
      </div>
    </div>
  );
}
