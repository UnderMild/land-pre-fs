import { describe, it, expect } from "vitest";
import { calculateProjection } from "./calculate";
import { Inputs, DEFAULT_INPUTS } from "./types";

describe("calculateProjection", () => {
  it("calculates area correctly", () => {
    const inputs: Inputs = {
      ...DEFAULT_INPUTS,
      rai: 1,
      ngan: 0,
      sqw: 0,
    };
    const result = calculateProjection(inputs);
    expect(result.landSqw).toBe(400);
    expect(result.landSqm).toBe(1600);
  });

  it("calculates GFA and NSA correctly", () => {
    const inputs: Inputs = {
      ...DEFAULT_INPUTS,
      rai: 0,
      ngan: 1,
      sqw: 0,
      far: 5,
      efficiency: 0.8,
    };
    // 1 ngan = 100 sqw = 400 sqm
    // GFA = 400 * 5 = 2000
    // NSA = 2000 * 0.8 = 1600
    const result = calculateProjection(inputs);
    expect(result.gfa).toBe(2000);
    expect(result.nsa).toBe(1600);
  });

  it("calculates costs correctly", () => {
    const inputs: Inputs = {
      ...DEFAULT_INPUTS,
      rai: 0,
      ngan: 1,
      sqw: 0,
      far: 5,
      efficiency: 0.8,
      landPrice: 100000, // 100k per sqw
      landTax: 0.05,
      constructionCost: 20000,
    };
    // landSqw = 100
    // totalLandCost = 100 * 100000 * 1.05 = 10,500,000
    // gfa = 400 * 5 = 2000
    // totalConstructionCost = 2000 * 20000 = 40,000,000
    // totalDevCost = 50,500,000
    const result = calculateProjection(inputs);
    expect(result.totalLandCost).toBe(10500000);
    expect(result.totalConstructionCost).toBe(40000000);
    expect(result.totalDevCost).toBe(50500000);
  });
});

describe("applySolver", () => {
  const baseInputs: Inputs = {
    ...DEFAULT_INPUTS,
    rai: 0,
    ngan: 1,
    sqw: 0,
    far: 5,
    efficiency: 0.8,
    landPrice: 100000,
    landTax: 0,
    constructionCost: 20000,
    targetGM: 0.25,
  };

  it("solves for selling price", () => {
    const result = calculateProjection(baseInputs);
    // landCostPerNSA = 100,000 * 100 / 1600 = 6250
    // constructionCostPerNSA = 20000 / 0.8 = 25000
    // totalCostPerNSA = 31250
    // newSellingPrice = 31250 / (1 - 0.25) = 41666.66...
    const updates = applySolver("selling", baseInputs, result);
    expect(updates.sellingPrice).toBe(41667);
  });

  it("solves for land price", () => {
    const inputsWithSelling = { ...baseInputs, sellingPrice: 50000 };
    const result = calculateProjection(inputsWithSelling);
    // targetLandCostPerNSA = 50000 * (1 - 0.25) - 25000 = 12500
    // targetTotalLandCost = 12500 * 1600 = 20,000,000
    // newLandPrice = 20,000,000 / 100 = 200,000
    const updates = applySolver("land", inputsWithSelling, result);
    expect(updates.landPrice).toBe(200000);
  });
});
