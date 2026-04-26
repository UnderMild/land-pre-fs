import { Inputs, CalculationResult, SolverMode } from "./types";

export function calculateProjection(inputs: Inputs): CalculationResult {
  const landSqw = inputs.rai * 400 + inputs.ngan * 100 + inputs.sqw;
  const landSqm = landSqw * 4;
  const totalFAR = inputs.far * (1 + inputs.bonusFar / 100);
  const gfa = landSqm * totalFAR;
  const nsa = gfa * inputs.efficiency;

  const totalLandCost = landSqw * inputs.landPrice * (1 + inputs.landTax);
  const totalConstructionCost = gfa * inputs.constructionCost;
  const totalDevCost = totalLandCost + totalConstructionCost;

  const landCostPerNSA = nsa > 0 ? totalLandCost / nsa : 0;
  const constructionCostPerNSA = inputs.efficiency > 0 ? inputs.constructionCost / inputs.efficiency : 0;

  const projectValue = nsa * inputs.sellingPrice;
  const cogs = projectValue > 0 ? (totalDevCost / projectValue) * 100 : 0;

  let grossMargin = 0;
  if (inputs.sellingPrice > 0 && nsa > 0) {
    grossMargin = ((inputs.sellingPrice - landCostPerNSA - constructionCostPerNSA) / inputs.sellingPrice) * 100;
  }

  const netProfit = projectValue * inputs.netProfitPct;

  return {
    landSqw,
    landSqm,
    totalFAR,
    gfa,
    nsa,
    totalLandCost,
    totalConstructionCost,
    totalDevCost,
    landCostPerNSA,
    constructionCostPerNSA,
    projectValue,
    cogs,
    grossMargin,
    netProfit,
  };
}

export function applySolver(
  mode: SolverMode,
  inputs: Inputs,
  currentResult: CalculationResult
): Partial<Inputs> {
  const { nsa, landCostPerNSA, constructionCostPerNSA, landSqw } = currentResult;

  if (nsa <= 0) return {};

  switch (mode) {
    case "selling": {
      const denominator = 1 - inputs.targetGM;
      if (denominator <= 0) return {};
      const newSellingPrice = (constructionCostPerNSA + landCostPerNSA) / denominator;
      return { sellingPrice: Math.round(newSellingPrice) };
    }
    case "land": {
      if (inputs.sellingPrice <= 0) return {};
      const targetLandCostPerNSA = inputs.sellingPrice * (1 - inputs.targetGM) - constructionCostPerNSA;
      const targetTotalLandCost = targetLandCostPerNSA * nsa;
      const newLandPrice = landSqw > 0 ? targetTotalLandCost / (landSqw * (1 + inputs.landTax)) : 0;
      return { landPrice: Math.max(0, Math.round(newLandPrice)) };
    }
    case "construction": {
      if (inputs.sellingPrice <= 0 || inputs.efficiency <= 0) return {};
      const targetCCPerNSA = inputs.sellingPrice * (1 - inputs.targetGM) - landCostPerNSA;
      const newConstructionCost = targetCCPerNSA * inputs.efficiency;
      return { constructionCost: Math.max(0, Math.round(newConstructionCost)) };
    }
    default:
      return {};
  }
}
