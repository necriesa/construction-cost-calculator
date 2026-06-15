// ─── Types ────────────────────────────────────────────────────────────────────

export type PropertyType =
  | "House"
  | "Granny Flat"
  | "Townhouse"
  | "Apartment"
  | "Office"
  | "Warehouse"

export type FinishLevel = "economy" | "standard" | "premium" | "luxury"
export type BuildType = "new" | "kdr" | "renl" | "renm" | "ext" | "gf"
export type WallType = "bv" | "db" | "rc"
export type State = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT"

// ─────────────────────────────────────────────────────────────────────────────
//  CALCULATION MODEL — reverse-engineered from a 70-row single-variable test
//  matrix run against the live Duo Tax calculator. Reproduces 65/70 rows within
//  2% on all of Finish / Low / High; every single-variable axis is exact.
//
//    standardMid = ( (base[type] + wallAddition)
//                    × bedroomMultiplier × storeyMultiplier × floorArea
//                  + Σ perM²Option × floorArea
//                  + flatElevator )
//                  × locationYearIndex(state, year)
//
//    Finish Estimate = standardMid × finishFactor      (the headline number)
//    Low             = standardMid × 0.91
//    High            = standardMid × 1.09
//
//  Notes confirmed by the matrix:
//    • Build Type has NO effect on the estimate (kept in the form, ignored here).
//    • Finish level is a band position, not a base-rate change:
//        economy = 0.91 (low), standard = 1.00, premium = luxury = 1.09 (high).
//    • Wall type and per-m² options add to the base; an elevator is a flat add.
//    • Bedrooms and storeys are small ±4% multipliers (bedrooms cap at 5).
//    • Completion before Sept 1987 returns $0 (no capital-works deductions).
// ─────────────────────────────────────────────────────────────────────────────

// ─── Base Allowance (AUD per m², reference dollars, pre-index) ─────────────────
// One rate per property type (includes the brick-veneer baseline wall, and the
// 3-bedroom / single-storey baseline where applicable). Effective $/m² =
// base × locationYearIndex (e.g. House × 1.459 = $2,480.81/m² for NSW 2026).

export const BASE_RATES: Record<PropertyType, number> = {
  House: 1_700.35,
  "Granny Flat": 1_755.36,
  Townhouse: 1_805.37,
  Apartment: 1_550.32,
  Office: 1_080.22,
  Warehouse: 730.15,
}

// ─── Finish Factor & Estimate Variance ────────────────────────────────────────
// The displayed "Finish Estimate" is the standard mid-point repositioned within
// the ±9% band by finish level. Low/High are always ±9% of the standard mid.

export const FINISH_FACTORS: Record<FinishLevel, number> = {
  economy: 0.91,
  standard: 1.0,
  premium: 1.09,
  luxury: 1.09,
}

export const ESTIMATE_VARIANCE = { low: 0.91, high: 1.09 } as const

// ─── Wall Additions (AUD per m², added to the base allowance) ──────────────────
// Brick veneer is the baseline (included in base, +$0). From the matrix:
// double brick +$40/m², reinforced concrete +$80/m².

export const WALL_ADDITIONS: Record<WallType, number> = {
  bv: 0,
  db: 40,
  rc: 80,
}

// ─── Bedroom & Storey Multipliers (±4% steps) ─────────────────────────────────
// Bedrooms: baseline 3 = ×1.0, ±4% per bedroom, capped at 5 (6+ = 5).
// Storeys: 1 = ×1.0, +4% per storey above the first.

const BEDROOM_BASELINE = 3
const BEDROOM_CAP = 5
const STEP = 0.04

export function getBedroomMultiplier(numBedrooms: number | undefined): number {
  if (numBedrooms === undefined || !Number.isFinite(numBedrooms)) return 1
  const beds = Math.min(Math.max(numBedrooms, 1), BEDROOM_CAP)
  return 1 + STEP * (beds - BEDROOM_BASELINE)
}

export function getStoreyMultiplier(numFloors: number): number {
  const n = Math.max(1, Math.floor(numFloors || 1))
  return 1 + STEP * (n - 1)
}

// ─── Options ──────────────────────────────────────────────────────────────────
// Basement, mezzanine and ducted A/C are per-m² additions (scaled by area and
// index). An elevator is a flat reference amount (~$100k) scaled only by index —
// confirmed by the 500 m² office and 150 m² house tests giving the same dollar
// add. Residential and commercial elevators measured the same.

export const PER_M2_OPTIONS = {
  basement: 105.02,
  ductedAc: 255.05,
  mezzanine: 120.02,
} as const

export const ELEVATOR_FLAT = 100_020 // reference dollars, scaled by index only

// ─── Build Type ───────────────────────────────────────────────────────────────
// The live calculator applies no build-type adjustment; kept for the form only.

export const BUILD_TYPE_MULTIPLIERS: Record<BuildType, number> = {
  new: 1.0,
  kdr: 1.0,
  renl: 1.0,
  renm: 1.0,
  ext: 1.0,
  gf: 1.0,
}

// ─── Location & Year Index ────────────────────────────────────────────────────
// Per-state, per-year indices read directly from the live tool. NSW has a full
// year curve (group C of the matrix); other states are anchored at 2010 / 2020 /
// 2026. Values are interpolated linearly between anchors. The index is NOT a
// uniform escalation — e.g. WA dips from 2010→2020 (mining-boom era) and QLD/ACT
// climb far faster than NSW — so each state carries its own points.

const EARLIEST_CLAIMABLE_YEAR = 1987 // capital works: residential from Sept 1987

export const STATE_YEAR_INDEX: Record<State, Record<number, number>> = {
  NSW: {
    1987: 0.4146,
    1990: 0.5003,
    1995: 0.5143,
    2000: 0.5861,
    2005: 0.7023,
    2010: 0.8519,
    2015: 0.9167,
    2020: 1.1004,
    2024: 1.3155,
    2026: 1.459,
  },
  VIC: { 2010: 0.842, 2020: 1.08, 2026: 1.446 },
  QLD: { 2010: 0.99, 2020: 1.168, 2026: 1.708 },
  SA: { 2010: 0.948, 2020: 1.076, 2026: 1.36 },
  WA: { 2010: 1.035, 2020: 1.029, 2026: 1.347 },
  TAS: { 2010: 0.842, 2020: 1.08, 2026: 1.446 },
  ACT: { 2010: 1.022, 2020: 1.258, 2026: 1.61 },
  NT: { 2010: 0.948, 2020: 1.076, 2026: 1.36 },
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function getLocationYearIndex(state: State, year: number): number {
  if (!Number.isFinite(year) || year < EARLIEST_CLAIMABLE_YEAR) return 0

  const table = STATE_YEAR_INDEX[state] ?? STATE_YEAR_INDEX.NSW
  const years = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b)

  const first = years[0]
  const last = years[years.length - 1]

  if (table[year] !== undefined) return table[year]
  if (year >= last) return table[last] // 2026 is the latest selectable year
  if (year < first) {
    // Below this state's earliest anchor: borrow NSW's detailed curve shape,
    // scaled by the state's relativity at its first anchor year.
    const rel = table[first] / (STATE_YEAR_INDEX.NSW[first] ?? table[first])
    return getLocationYearIndex("NSW", year) * rel
  }
  for (let i = 0; i < years.length - 1; i++) {
    const lo = years[i]
    const hi = years[i + 1]
    if (year >= lo && year <= hi) {
      return lerp(table[lo], table[hi], (year - lo) / (hi - lo))
    }
  }
  return table[last]
}
