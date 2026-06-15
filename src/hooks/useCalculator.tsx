import { useMemo } from "react"
import {
  BASE_RATES,
  ELEVATOR_FLAT,
  ESTIMATE_VARIANCE,
  FINISH_FACTORS,
  PER_M2_OPTIONS,
  WALL_ADDITIONS,
  getBedroomMultiplier,
  getLocationYearIndex,
  getStoreyMultiplier,
} from "@/lib/calculatorRates"
import type { FinishLevel, PropertyType, State, WallType } from "@/lib/calculatorRates"
import type { CalculatorFormInput } from "@/lib/formSchemas"
import { INCLUSIONS_BY_TYPE, PROPERTIES_WITH_BEDROOMS } from "@/lib/data"

// ─── Output types ─────────────────────────────────────────────────────────────

export interface BreakdownLine {
  label: string
  amount: number
  note?: string
}

export interface CalculatorResults {
  isReady: boolean
  midEstimate: number
  lowEstimate: number
  highEstimate: number
  ratePerSqm: number
  breakdown: BreakdownLine[]
}

const EMPTY_RESULTS: CalculatorResults = {
  isReady: false,
  midEstimate: 0,
  lowEstimate: 0,
  highEstimate: 0,
  ratePerSqm: 0,
  breakdown: [],
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
//
//  standardMid = ( (base + wall) × bedroomMult × storeyMult × area
//                  + Σ perM²Option × area
//                  + flatElevator )
//                × locationYearIndex
//  Finish Estimate = standardMid × finishFactor   |   Low/High = ×0.91 / ×1.09
//
export function useCalculator(
  values: CalculatorFormInput | null
): CalculatorResults {
  return useMemo(() => {
    if (!values) return EMPTY_RESULTS

    const {
      propertyType,
      finishLevel,
      floorArea,
      state,
      completionYear,
      wallType,
      numFloors,
      numBedrooms,
      hasBasement,
      hasElevator,
      hasDuctedAC,
      hasMezzanine,
    } = values

    if (!state || (state as string) === "default" || !floorArea || floorArea <= 0) {
      return EMPTY_RESULTS
    }

    const area = floorArea as number
    const year =
      typeof completionYear === "string"
        ? parseInt(completionYear, 10)
        : (completionYear as number)

    const index = getLocationYearIndex(state as State, year)

    // Completion before Sept 1987 → no capital-works deductions → $0.
    if (index <= 0) {
      return {
        isReady: true,
        midEstimate: 0,
        lowEstimate: 0,
        highEstimate: 0,
        ratePerSqm: 0,
        breakdown: [
          {
            label: "Not claimable",
            amount: 0,
            note: "Construction completed before September 1987 — no capital-works deduction applies.",
          },
        ],
      }
    }

    // ── Composite structural rate (per m², pre-index) ───────────────────────────
    const baseRate = BASE_RATES[propertyType as PropertyType] ?? 0
    const wallAdd = wallType ? (WALL_ADDITIONS[wallType as WallType] ?? 0) : 0
    const structuralRate = baseRate + wallAdd

    // ── Small multipliers (bedrooms, storeys) ───────────────────────────────────
    const floors = (numFloors as number | undefined) ?? 1
    const hasBedrooms = PROPERTIES_WITH_BEDROOMS.includes(propertyType)
    const bedroomMult = hasBedrooms
      ? getBedroomMultiplier(numBedrooms as number | undefined)
      : 1
    const storeyMult = getStoreyMultiplier(floors)

    // ── Per-m² options + flat elevator ──────────────────────────────────────────
    const isCommercial = propertyType === "Office" || propertyType === "Warehouse"
    const allowedInclusions = INCLUSIONS_BY_TYPE[propertyType] ?? []
    const options: { label: string; amount: number; note: string }[] = []
    let optionsPerArea = 0
    if (hasBasement && allowedInclusions.includes("hasBasement")) {
      optionsPerArea += PER_M2_OPTIONS.basement
      options.push({
        label: "Basement",
        amount: PER_M2_OPTIONS.basement * area,
        note: `$${PER_M2_OPTIONS.basement}/m² × ${area} m²`,
      })
    }
    if (hasDuctedAC && allowedInclusions.includes("hasDuctedAC")) {
      optionsPerArea += PER_M2_OPTIONS.ductedAc
      options.push({
        label: "Ducted air-conditioning",
        amount: PER_M2_OPTIONS.ductedAc * area,
        note: `$${PER_M2_OPTIONS.ductedAc}/m² × ${area} m²`,
      })
    }
    if (hasMezzanine && allowedInclusions.includes("hasMezzanine")) {
      optionsPerArea += PER_M2_OPTIONS.mezzanine
      options.push({
        label: "Mezzanine floor",
        amount: PER_M2_OPTIONS.mezzanine * area,
        note: `$${PER_M2_OPTIONS.mezzanine}/m² × ${area} m²`,
      })
    }
    const elevatorRef = hasElevator && allowedInclusions.includes("hasElevator") ? ELEVATOR_FLAT : 0

    // ── Reference subtotal (pre-index), then index, then finish ──────────────────
    const structuralRef = structuralRate * bedroomMult * storeyMult * area
    const optionsRef = optionsPerArea * area
    const subtotalRef = structuralRef + optionsRef + elevatorRef

    const standardMid = subtotalRef * index
    const finishFactor = FINISH_FACTORS[finishLevel as FinishLevel] ?? 1
    const finishEstimate = standardMid * finishFactor

    // ── Breakdown (reference-scale lines + index + finish; sums to headline) ─────
    const breakdown: BreakdownLine[] = [
      {
        label: `Base allowance — ${propertyType}`,
        amount: baseRate * area,
        note: `$${baseRate.toLocaleString()}/m² × ${area} m²`,
      },
    ]
    if (wallAdd !== 0) {
      breakdown.push({
        label: wallTypeLabel(wallType as WallType),
        amount: wallAdd * area,
        note: `+$${wallAdd}/m² × ${area} m²`,
      })
    }
    if (bedroomMult !== 1) {
      breakdown.push({
        label: `${numBedrooms}-bedroom adjustment`,
        amount: structuralRate * area * (bedroomMult - 1),
        note: `×${bedroomMult.toFixed(2)} multiplier`,
      })
    }
    if (storeyMult !== 1) {
      breakdown.push({
        label: `${floors}-storey adjustment`,
        amount: structuralRate * bedroomMult * area * (storeyMult - 1),
        note: `×${storeyMult.toFixed(2)} multiplier`,
      })
    }
    breakdown.push(...options)
    if (elevatorRef !== 0) {
      breakdown.push({
        label: `Elevator (${isCommercial ? "commercial" : "residential"})`,
        amount: elevatorRef,
        note: "Fixed installation",
      })
    }
    breakdown.push({
      label: `Location & year index — ${state}, ${year}`,
      amount: subtotalRef * (index - 1),
      note: `×${index.toFixed(3)} index`,
    })
    if (finishFactor !== 1) {
      breakdown.push({
        label: `${capitalize(finishLevel as string)} finish`,
        amount: standardMid * (finishFactor - 1),
        note:
          finishFactor < 1
            ? "Positioned at the lower end of the range"
            : "Positioned at the upper end of the range",
      })
    }

    return {
      isReady: true,
      midEstimate: Math.round(finishEstimate),
      lowEstimate: Math.round(standardMid * ESTIMATE_VARIANCE.low),
      highEstimate: Math.round(standardMid * ESTIMATE_VARIANCE.high),
      ratePerSqm: Math.round(area > 0 ? finishEstimate / area : 0),
      breakdown,
    }
  }, [values])
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wallTypeLabel(wt: WallType): string {
  const map: Record<WallType, string> = {
    bv: "Brick veneer (baseline)",
    db: "Double brick",
    rc: "Reinforced concrete",
  }
  return map[wt] ?? wt
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
