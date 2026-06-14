import { z } from "zod"

export const CalculatorFormSchema = z
  .object({
    propertyType: z.enum([
      "House",
      "Granny Flat",
      "Townhouse",
      "Apartment",
      "Office",
      "Warehouse",
    ]),
    completionYear: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().min(1987).max(new Date().getFullYear())),
    state: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"]),
    buildType: z.enum(["new", "kdr", "renl", "renm", "ext", "gf"]),
    finishLevel: z.enum(["economy", "standard", "premium", "luxury"]),
    floorArea: z.number().min(1),
    // Conditionally required — see superRefine below
    numBedrooms: z.number().min(0).optional(),
    numFloors: z.number().min(1).optional(),
    wallType: z.enum(["bv", "db", "rc"]).optional(),
    hasBasement: z.boolean().optional(),
    hasElevator: z.boolean().optional(),
    hasMezzanine: z.boolean().optional(),
    hasDuctedAC: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const t = data.propertyType

    const require = (field: string, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [field] })

    // ── Numeric fields ────────────────────────────────────────────────────────

    if (t === "House" || t === "Granny Flat" || t === "Townhouse") {
      if (data.numBedrooms === undefined)
        require("numBedrooms", "Number of bedrooms is required")
      if (data.numFloors === undefined)
        require("numFloors", "Number of floors is required")
      if (data.wallType === undefined)
        require("wallType", "Wall type is required")
    }

    if (t === "Apartment") {
      if (data.numBedrooms === undefined)
        require("numBedrooms", "Number of bedrooms is required")
      if (data.numFloors === undefined)
        require("numFloors", "Floor number is required")
    }

    if (t === "Office" || t === "Warehouse") {
      if (data.numFloors === undefined)
        require("numFloors", "Number of floors is required")
    }

    // ── Boolean fields ────────────────────────────────────────────────────────

    if (t === "House" || t === "Apartment") {
      if (data.hasBasement === undefined)
        require("hasBasement", "Basement is required")
      if (data.hasElevator === undefined)
        require("hasElevator", "Elevator is required")
      if (data.hasDuctedAC === undefined)
        require("hasDuctedAC", "Ducted AC is required")
    }

    if (t === "Granny Flat") {
      if (data.hasDuctedAC === undefined)
        require("hasDuctedAC", "Ducted AC is required")
    }

    if (t === "Townhouse") {
      if (data.hasBasement === undefined)
        require("hasBasement", "Basement is required")
      if (data.hasDuctedAC === undefined)
        require("hasDuctedAC", "Ducted AC is required")
    }

    if (t === "Office") {
      if (data.hasBasement === undefined)
        require("hasBasement", "Basement is required")
      if (data.hasElevator === undefined)
        require("hasElevator", "Elevator is required")
      if (data.hasMezzanine === undefined)
        require("hasMezzanine", "Mezzanine is required")
      if (data.hasDuctedAC === undefined)
        require("hasDuctedAC", "Ducted AC is required")
    }

    if (t === "Warehouse") {
      if (data.hasBasement === undefined)
        require("hasBasement", "Basement is required")
      if (data.hasMezzanine === undefined)
        require("hasMezzanine", "Mezzanine is required")
      if (data.hasDuctedAC === undefined)
        require("hasDuctedAC", "Ducted AC is required")
    }
  })

export type CalculatorFormValues = z.infer<typeof CalculatorFormSchema>
