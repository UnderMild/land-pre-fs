"use client";

import { useEffect, useMemo, useState } from "react";
import { CalculationResult } from "../lib/types";
import { formatNumber } from "../lib/format";
import { Map, Layout, Building2, BadgeDollarSign, CircleHelp, X } from "lucide-react";

interface KpiDashboardProps {
  result: CalculationResult;
}

type InfoKey = "landArea" | "gfa" | "nsa" | "projectValue";

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  onInfo,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  onInfo: () => void;
}) {
  return (
    <div
      className={
        "rounded-xl p-3.5 sm:p-4 flex flex-col gap-0.5 " +
        "border transition-colors " +
        (accent
          ? "border-[var(--excel-green)]/30 bg-[var(--excel-green)]/[0.04]"
          : "border-gray-200 bg-white")
      }
    >
      <div className="flex items-start gap-2 mb-1">
        <Icon
          className={
            "w-4 h-4 shrink-0 mt-0.5 " + (accent ? "text-[var(--excel-green)]" : "text-gray-400")
          }
        />
        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate flex-1">
          {label}
        </span>
        <button
          type="button"
          onClick={onInfo}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)] focus-visible:ring-offset-2"
          aria-label={`Explain ${label}`}
        >
          <CircleHelp className="h-4 w-4" />
        </button>
      </div>
      <span
        className={
          "text-lg sm:text-xl font-bold font-mono leading-tight " +
          (accent ? "text-[var(--excel-green)]" : "text-gray-900")
        }
      >
        {value}
      </span>
      {sub && <span className="text-[10px] sm:text-xs text-gray-400 truncate">{sub}</span>}
    </div>
  );
}

function InfoModal({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string[];
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--excel-green)] focus-visible:ring-offset-2"
            aria-label="Close info modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm text-gray-700">
          {body.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function KpiDashboard({ result }: KpiDashboardProps) {
  const [activeInfo, setActiveInfo] = useState<InfoKey | null>(null);
  const { landSqw, landSqm, gfa, nsa, projectValue } = result;

  const infoContent = useMemo<Record<InfoKey, { title: string; body: string[] }>>(
    () => ({
      landArea: {
        title: "Land Area (พื้นที่ดิน)",
        body: [
          "พื้นที่ดินทั้งหมดของโครงการ แสดงเป็นตารางวาและตารางเมตร",
          "สูตร: (ไร่ × 400) + (งาน × 100) + ตร.ว. = ตารางวา",
          "1 ตารางวา = 4 ตารางเมตร",
        ],
      },
      gfa: {
        title: "GFA (Gross Floor Area)",
        body: [
          "พื้นที่อาคารรวมทั้งหมด (ก่อนหักพื้นที่ส่วนกลาง)",
          "สูตร: พื้นที่ดิน (ตร.ม.) × Total FAR",
          "Total FAR = Base FAR × (1 + Bonus FAR%)",
        ],
      },
      nsa: {
        title: "NSA (Net Saleable Area)",
        body: [
          "พื้นที่ขายได้สุทธิ หลังหักส่วนกลาง ทางเดิน ลิฟต์ ฯลฯ",
          "สูตร: GFA × Efficiency%",
          "Efficiency ทั่วไปอยู่ที่ 70-85% ขึ้นอยู่กับประเภทอาคาร",
        ],
      },
      projectValue: {
        title: "Project Value (มูลค่าโครงการ)",
        body: [
          "ประมาณการรายได้รวมจากการขายทั้งโครงการ",
          "สูตร: NSA × ราคาขาย (฿/ตร.ม.)",
          "เป็นค่าประมาณเบื้องต้น ยังไม่หักค่าใช้จ่ายหรือภาษี",
        ],
      },
    }),
    []
  );

  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
        <KpiCard
          icon={Map}
          label="Land Area"
          value={`${formatNumber(landSqw)} วา`}
          sub={`${formatNumber(landSqm)} ตร.ม.`}
          onInfo={() => setActiveInfo("landArea")}
        />
        <KpiCard
          icon={Layout}
          label="GFA"
          value={`${formatNumber(Math.round(gfa))} ตร.ม.`}
          sub="Gross Floor Area"
          onInfo={() => setActiveInfo("gfa")}
        />
        <KpiCard
          icon={Building2}
          label="NSA"
          value={`${formatNumber(Math.round(nsa))} ตร.ม.`}
          sub="Net Saleable Area"
          onInfo={() => setActiveInfo("nsa")}
        />
        <KpiCard
          icon={BadgeDollarSign}
          label="Project Value"
          value={`${(projectValue / 1_000_000).toFixed(1)} MB`}
          sub="Estimate Total Sales"
          accent
          onInfo={() => setActiveInfo("projectValue")}
        />
      </div>
      {activeInfo && (
        <InfoModal
          title={infoContent[activeInfo].title}
          body={infoContent[activeInfo].body}
          onClose={() => setActiveInfo(null)}
        />
      )}
    </>
  );
}
