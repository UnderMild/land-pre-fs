import { Inputs } from "./types";
import { calculateProjection } from "./calculate";

export type SensitivityParam = "landPrice" | "constructionCost" | "efficiency" | "far";
export type SensitivityKPI = "requiredSellingPrice" | "grossMargin" | "netProfit" | "breakeven";

export interface SensitivityRow {
  paramValue: number;
  label: string;
  requiredSellingPrice: number;
  grossMargin: number;
  netProfit: number;
  breakeven: number;
}

export function runSensitivityAnalysis(
  inputs: Inputs,
  param: SensitivityParam,
  min: number,
  max: number,
  steps: number
): SensitivityRow[] {
  const results: SensitivityRow[] = [];
  const stepSize = (max - min) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const currentVal = min + stepSize * i;
    const testInputs = { ...inputs };

    // Apply parameter change
    if (param === "efficiency") testInputs.efficiency = currentVal / 100;
    else if (param === "far") testInputs.far = currentVal;
    else if (param === "constructionCost") testInputs.constructionCost = currentVal;
    else if (param === "landPrice") testInputs.landPrice = currentVal;

    const res = calculateProjection(testInputs);

    // Calculate Required Selling Price (to hit target GM)
    const denom = 1 - testInputs.targetGM;
    const reqSP = res.nsa > 0 && denom > 0 
      ? (res.landCostPerNSA + res.constructionCostPerNSA) / denom 
      : 0;

    // Calculate Breakeven
    const breakeven = res.nsa > 0 ? (res.landCostPerNSA + res.constructionCostPerNSA) : 0;

    results.push({
      paramValue: currentVal,
      label: param === "efficiency" ? `${currentVal.toFixed(1)}%` : currentVal.toLocaleString(),
      requiredSellingPrice: reqSP,
      grossMargin: res.grossMargin,
      netProfit: res.netProfit,
      breakeven: breakeven,
    });
  }

  return results;
}
