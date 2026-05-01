import { describe, it, expect } from "vitest";
import { calculateProjection, applySolver } from "./calculate";
import { Inputs, DEFAULT_INPUTS } from "./types";
import { runSensitivityAnalysis } from "./sensitivity";
import { parseInputsFromParams } from "./useUrlSync";

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

  it("handles mixed rai/ngan/sqw", () => {
    const inputs: Inputs = { ...DEFAULT_INPUTS, rai: 1, ngan: 2, sqw: 50 };
    const result = calculateProjection(inputs);
    expect(result.landSqw).toBe(400 + 200 + 50);
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
    const result = calculateProjection(inputs);
    expect(result.gfa).toBe(2000);
    expect(result.nsa).toBe(1600);
  });

  it("applies bonus FAR", () => {
    const inputs: Inputs = {
      ...DEFAULT_INPUTS,
      rai: 0,
      ngan: 1,
      sqw: 0,
      far: 5,
      bonusFar: 20,
      efficiency: 0.8,
    };
    const result = calculateProjection(inputs);
    expect(result.totalFAR).toBe(6);
    expect(result.gfa).toBe(400 * 6);
  });

  it("calculates costs correctly", () => {
    const inputs: Inputs = {
      ...DEFAULT_INPUTS,
      rai: 0,
      ngan: 1,
      sqw: 0,
      far: 5,
      efficiency: 0.8,
      landPrice: 100000,
      landTax: 0.05,
      constructionCost: 20000,
    };
    const result = calculateProjection(inputs);
    expect(result.totalLandCost).toBe(10500000);
    expect(result.totalConstructionCost).toBe(40000000);
    expect(result.totalDevCost).toBe(50500000);
  });

  it("returns zero when no land area", () => {
    const result = calculateProjection(DEFAULT_INPUTS);
    expect(result.landSqw).toBe(0);
    expect(result.gfa).toBe(0);
    expect(result.nsa).toBe(0);
  });

  it("calculates gross margin", () => {
    const inputs: Inputs = {
      ...DEFAULT_INPUTS,
      rai: 0,
      ngan: 1,
      sqw: 0,
      far: 5,
      efficiency: 0.8,
      landPrice: 100000,
      landTax: 0,
      constructionCost: 20000,
      sellingPrice: 50000,
    };
    const result = calculateProjection(inputs);
    // landCostPerNSA = 6250, constructionCostPerNSA = 25000
    // GM = (50000 - 6250 - 25000) / 50000 = 0.375 = 37.5%
    expect(result.grossMargin).toBeCloseTo(37.5, 1);
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
    const updates = applySolver("selling", baseInputs, result);
    expect(updates.sellingPrice).toBe(41667);
  });

  it("solves for land price", () => {
    const inputsWithSelling = { ...baseInputs, sellingPrice: 50000 };
    const result = calculateProjection(inputsWithSelling);
    const updates = applySolver("land", inputsWithSelling, result);
    expect(updates.landPrice).toBe(200000);
  });

  it("solves for construction cost", () => {
    const inputsWithSelling = { ...baseInputs, sellingPrice: 50000 };
    const result = calculateProjection(inputsWithSelling);
    const updates = applySolver("construction", inputsWithSelling, result);
    // targetCCPerNSA = 50000 * (1-0.25) - 6250 = 31250
    // newCC = 31250 * 0.8 = 25000
    expect(updates.constructionCost).toBe(25000);
  });

  it("returns empty when nsa is 0", () => {
    const zeroInputs = { ...baseInputs, rai: 0, ngan: 0, sqw: 0 };
    const result = calculateProjection(zeroInputs);
    const updates = applySolver("selling", zeroInputs, result);
    expect(updates).toEqual({});
  });

  it("returns empty when targetGM >= 1 for selling mode", () => {
    const badInputs = { ...baseInputs, targetGM: 1 };
    const result = calculateProjection(badInputs);
    const updates = applySolver("selling", badInputs, result);
    expect(updates).toEqual({});
  });

  it("clamps land price to 0 minimum", () => {
    const inputs = { ...baseInputs, sellingPrice: 1, constructionCost: 50000 };
    const result = calculateProjection(inputs);
    const updates = applySolver("land", inputs, result);
    expect(updates.landPrice).toBe(0);
  });
});

describe("runSensitivityAnalysis", () => {
  const inputs: Inputs = {
    ...DEFAULT_INPUTS,
    rai: 0,
    ngan: 1,
    sqw: 0,
    far: 5,
    efficiency: 0.8,
    landPrice: 100000,
    constructionCost: 20000,
    sellingPrice: 50000,
    targetGM: 0.25,
  };

  it("returns correct number of steps", () => {
    const data = runSensitivityAnalysis(inputs, "landPrice", 50000, 150000, 5);
    expect(data).toHaveLength(5);
  });

  it("paramValue covers min to max", () => {
    const data = runSensitivityAnalysis(inputs, "landPrice", 50000, 150000, 3);
    expect(data[0].paramValue).toBe(50000);
    expect(data[2].paramValue).toBe(150000);
  });

  it("handles efficiency as percentage input", () => {
    const data = runSensitivityAnalysis(inputs, "efficiency", 60, 90, 3);
    expect(data[0].paramValue).toBe(60);
    expect(data[2].paramValue).toBe(90);
  });

  it("calculates requiredSellingPrice", () => {
    const data = runSensitivityAnalysis(inputs, "landPrice", 90000, 110000, 3);
    expect(data[1].requiredSellingPrice).toBeGreaterThan(0);
  });

  it("calculates grossMargin", () => {
    const noTaxInputs = { ...inputs, landTax: 0 };
    const data = runSensitivityAnalysis(noTaxInputs, "landPrice", 100000, 100000, 2);
    expect(data[0].grossMargin).toBeCloseTo(37.5, 1);
  });
});

describe("parseInputsFromParams", () => {
  it("returns defaults when no params", () => {
    const params = new URLSearchParams();
    const result = parseInputsFromParams(params);
    expect(result).toEqual(DEFAULT_INPUTS);
  });

  it("parses numeric params", () => {
    const params = new URLSearchParams("r=2&g=1&w=50");
    const result = parseInputsFromParams(params);
    expect(result.rai).toBe(2);
    expect(result.ngan).toBe(1);
    expect(result.sqw).toBe(50);
  });

  it("parses string params (projectName)", () => {
    const params = new URLSearchParams("n=Test%20Project");
    const result = parseInputsFromParams(params);
    expect(result.projectName).toBe("Test Project");
  });

  it("ignores invalid numeric values", () => {
    const params = new URLSearchParams("r=abc");
    const result = parseInputsFromParams(params);
    expect(result.rai).toBe(DEFAULT_INPUTS.rai);
  });

  it("parses all known keys", () => {
    const params = new URLSearchParams(
      "r=1&g=2&w=30&f=5&bf=10&e=0.85&lp=50000&lt=0.03&cc=24000&sp=65000&gm=0.25&np=0.1"
    );
    const result = parseInputsFromParams(params);
    expect(result.rai).toBe(1);
    expect(result.ngan).toBe(2);
    expect(result.sqw).toBe(30);
    expect(result.far).toBe(5);
    expect(result.bonusFar).toBe(10);
    expect(result.efficiency).toBe(0.85);
    expect(result.landPrice).toBe(50000);
    expect(result.landTax).toBe(0.03);
    expect(result.constructionCost).toBe(24000);
    expect(result.sellingPrice).toBe(65000);
    expect(result.targetGM).toBe(0.25);
    expect(result.netProfitPct).toBe(0.1);
  });
});
