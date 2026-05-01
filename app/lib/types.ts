import { z } from "zod";

export const InputsSchema = z.object({
  projectName: z.string().optional(),
  rai: z.number().min(0),
  ngan: z.number().min(0).max(3),
  sqw: z.number().min(0).max(99),
  far: z.number().min(0),
  bonusFar: z.number().min(0).max(25),
  efficiency: z.number().min(0.5).max(0.95), // as decimal 0.5-0.95
  landPrice: z.number().min(0),
  landTax: z.number().min(0).max(0.1), // as decimal
  constructionCost: z.number().min(0),
  sellingPrice: z.number().min(0),
  targetGM: z.number().min(0).max(0.6), // as decimal
  netProfitPct: z.number().min(0).max(0.3), // net margin assumption (decimal), applied to project revenue
});

export type Inputs = z.infer<typeof InputsSchema>;

export interface CalculationResult {
  landSqw: number;
  landSqm: number;
  totalFAR: number;
  gfa: number;
  nsa: number;
  totalLandCost: number;
  totalConstructionCost: number;
  totalDevCost: number;
  landCostPerNSA: number;
  constructionCostPerNSA: number;
  projectValue: number;
  cogs: number; // percentage
  grossMargin: number; // percentage
  netProfit: number;
}

export const DEFAULT_INPUTS: Inputs = {
  projectName: "",
  rai: 0,
  ngan: 0,
  sqw: 0,
  far: 0,
  bonusFar: 0,
  efficiency: 0.8,
  landPrice: 0,
  landTax: 0.03,
  constructionCost: 24000,
  sellingPrice: 65000,
  targetGM: 0.25,
  netProfitPct: 0.1,
};

export const BLANK_RESULT: CalculationResult = {
  landSqw: 0,
  landSqm: 0,
  totalFAR: 0,
  gfa: 0,
  nsa: 0,
  totalLandCost: 0,
  totalConstructionCost: 0,
  totalDevCost: 0,
  landCostPerNSA: 0,
  constructionCostPerNSA: 0,
  projectValue: 0,
  cogs: 0,
  grossMargin: 0,
  netProfit: 0,
};

export type SolverMode = "selling" | "land" | "construction";
