"use client";

import { useEffect } from "react";
import { Inputs, DEFAULT_INPUTS } from "./types";

const PARAM_MAP: Record<string, keyof Inputs> = {
  n: "projectName",
  r: "rai",
  g: "ngan",
  w: "sqw",
  f: "far",
  bf: "bonusFar",
  e: "efficiency",
  lp: "landPrice",
  lt: "landTax",
  cc: "constructionCost",
  sp: "sellingPrice",
  gm: "targetGM",
  np: "netProfitPct",
};

const INPUT_TO_PARAM = Object.fromEntries(
  Object.entries(PARAM_MAP).map(([param, input]) => [input, param])
) as Record<keyof Inputs, string>;

const STRING_FIELDS = new Set<keyof Inputs>(["projectName"]);

export function parseInputsFromParams(searchParams: URLSearchParams): Inputs {
  const inputs = { ...DEFAULT_INPUTS };

  for (const [param, inputKey] of Object.entries(PARAM_MAP)) {
    const raw = searchParams.get(param);
    if (raw === null) continue;

    if (STRING_FIELDS.has(inputKey)) {
      (inputs as Record<string, any>)[inputKey] = raw;
    } else {
      const num = Number(raw);
      if (!Number.isNaN(num)) {
        (inputs as Record<string, any>)[inputKey] = num;
      }
    }
  }

  return inputs;
}

export function useUrlSync(inputs: Inputs) {
  useEffect(() => {
    const params = new URLSearchParams();

    for (const key of Object.keys(INPUT_TO_PARAM) as (keyof Inputs)[]) {
      const value = inputs[key];
      const defaultValue = DEFAULT_INPUTS[key];
      if (value !== defaultValue) {
        params.set(INPUT_TO_PARAM[key], String(value));
      }
    }

    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [inputs]);
}
