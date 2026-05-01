import { z } from "zod";
import type { Inputs } from "./types";

export type ValidationErrors = Partial<Record<keyof Inputs, string>>;

const inputsSchema = z
  .object({
    projectName: z.string().optional(),
    rai: z.number().min(0, "Must be 0 or greater"),
    ngan: z.number().min(0, "Must be 0 or greater").max(3, "Max 3 ngan"),
    sqw: z.number().min(0, "Must be 0 or greater").max(99, "Max 99 sq.wah"),
    far: z.number().min(0, "Must be 0 or greater"),
    bonusFar: z.number().min(0, "Must be 0 or greater").max(25, "Max 25%"),
    efficiency: z.number(),
    landPrice: z.number().min(0, "Must be 0 or greater"),
    landTax: z.number(),
    constructionCost: z.number().min(0, "Must be 0 or greater"),
    sellingPrice: z.number().min(0, "Must be 0 or greater"),
    targetGM: z.number(),
    netProfitPct: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.efficiency < 0.5 || data.efficiency > 0.95) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["efficiency"],
        message: "Efficiency must be between 50% and 95%",
      });
    }
    if (data.landTax < 0 || data.landTax > 0.1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["landTax"],
        message: "Land tax must be between 0% and 10%",
      });
    }
    if (data.targetGM < 0 || data.targetGM > 0.6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetGM"],
        message: "Target GM must be between 0% and 60%",
      });
    }
    if (data.netProfitPct < 0 || data.netProfitPct > 0.3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["netProfitPct"],
        message: "Net profit % must be between 0% and 30%",
      });
    }
  });

function zodErrorsToValidationErrors(err: z.ZodError): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const issue of err.issues) {
    const path = issue.path[0];
    if (typeof path === "string" && !(path in errors)) {
      (errors as Record<string, string>)[path] = issue.message;
    }
  }
  return errors;
}

export function validateInputs(inputs: Inputs): ValidationErrors {
  const result = inputsSchema.safeParse(inputs);
  if (result.success) return {};
  return zodErrorsToValidationErrors(result.error);
}

export function isValidInputs(inputs: Inputs): boolean {
  return inputsSchema.safeParse(inputs).success;
}
