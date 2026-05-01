import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import type { Inputs, CalculationResult } from "./types";

const ACCOUNTING_FMT = "#,##0";

const HEADER_FILL = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: "FFE8E8E8" },
};

const HEADER_FILL_GREEN = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: "FFE8F5E9" },
};

const BOTTOM_BORDER = {
  bottom: { style: "thin" as const },
};

export async function exportToExcel(inputs: Inputs, result: CalculationResult): Promise<void> {
  const wb = new Workbook();
  wb.creator = "Land Pre-FS";
  wb.created = new Date();

  const ws = wb.addWorksheet("Feasibility Summary");

  ws.columns = [
    { width: 28 },
    { width: 22 },
    { width: 18 },
  ];

  const titleRow = ws.addRow([inputs.projectName || "Land Pre-FS — Feasibility Summary"]);
  titleRow.font = { size: 14, bold: true };
  ws.addRow([`Generated: ${new Date().toLocaleString("th-TH")}`]).font = {
    size: 10,
    italic: true,
    color: { argb: "FF888888" },
  };
  ws.addRow([]);

  const addSection = (title: string) => {
    const row = ws.addRow([title]);
    row.font = { bold: true, size: 11 };
    row.fill = HEADER_FILL;
    row.border = BOTTOM_BORDER;
  };

  const addGreenSection = (title: string) => {
    const row = ws.addRow([title]);
    row.font = { bold: true, size: 11 };
    row.fill = HEADER_FILL_GREEN;
    row.border = BOTTOM_BORDER;
  };

  const addDataRow = (label: string, value: string | number, unit?: string) => {
    const row = ws.addRow([label, value, unit ?? ""]);
    row.font = { size: 10 };
    if (typeof value === "number") {
      row.getCell(2).numFmt = ACCOUNTING_FMT;
    }
  };

  addSection("Project Inputs");
  addDataRow("Land Area (ไร่)", inputs.rai, "ไร่");
  addDataRow("Land Area (งาน)", inputs.ngan, "งาน");
  addDataRow("Land Area (ตร.ว.)", inputs.sqw, "ตร.ว.");
  addDataRow("Base FAR", inputs.far, ": 1");
  addDataRow("Bonus FAR", inputs.bonusFar, "%");
  addDataRow("Efficiency", inputs.efficiency * 100, "%");
  addDataRow("Land Price", inputs.landPrice, "฿/ตร.ว.");
  addDataRow("Land Tax/Fees", inputs.landTax * 100, "%");
  addDataRow("Construction Cost", inputs.constructionCost, "฿/ตร.ม.");
  addDataRow("Selling Price", inputs.sellingPrice, "฿/ตร.ม. (NSA)");
  addDataRow("Target GM", inputs.targetGM * 100, "%");
  addDataRow("Net Profit %", inputs.netProfitPct * 100, "%");
  ws.addRow([]);

  addGreenSection("Area Calculation");
  addDataRow("Total Land (ตร.ว.)", result.landSqw);
  addDataRow("Total Land (ตร.ม.)", result.landSqm);
  addDataRow("Total FAR", result.totalFAR);
  addDataRow("GFA", Math.round(result.gfa), "ตร.ม.");
  addDataRow("NSA", Math.round(result.nsa), "ตร.ม.");
  ws.addRow([]);

  addSection("Cost Breakdown");
  addDataRow("Land Acquisition", Math.round(result.totalLandCost), "THB");
  addDataRow("Construction (GFA)", Math.round(result.totalConstructionCost), "THB");
  addDataRow("Total Dev. Cost", Math.round(result.totalDevCost), "THB");
  ws.addRow([]);

  addSection("Unit Analysis (per NSA)");
  addDataRow("Land Cost / NSA", Math.round(result.landCostPerNSA), "฿/ตร.ม.");
  addDataRow("Construction / NSA", Math.round(result.constructionCostPerNSA), "฿/ตร.ม.");
  addDataRow(
    "Breakeven (NSA)",
    Math.round(result.landCostPerNSA + result.constructionCostPerNSA),
    "฿/ตร.ม."
  );
  ws.addRow([]);

  addGreenSection("Performance");
  addDataRow("Project Value", Math.round(result.projectValue), "THB");
  addDataRow("Gross Margin", `${result.grossMargin.toFixed(1)}%`);
  addDataRow("COGs", `${result.cogs.toFixed(1)}%`);
  addDataRow("Net Profit", Math.round(result.netProfit), "THB");

  const buf = await wb.xlsx.writeBuffer();
  const fileName = `land-pre-fs-${inputs.projectName ? inputs.projectName.replace(/\s+/g, "-").toLowerCase() + "-" : ""}${Date.now()}.xlsx`;
  saveAs(new Blob([buf]), fileName);
}
