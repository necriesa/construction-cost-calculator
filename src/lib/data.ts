export const PROPERTY_TYPES = [
  { value: "House", label: "House" },
  { value: "Granny Flat", label: "Granny Flat" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "Apartment", label: "Apartment" },
  { value: "Office", label: "Office" },
  { value: "Warehouse", label: "Warehouse" },
]

export const BUILD_TYPES = [
  { value: "new", label: "New build" },
  { value: "kdr", label: "Knock-down & rebuild" },
  { value: "renl", label: "Renovation - light (≤30%)" },
  { value: "renm", label: "Renovation - major (>30%)" },
  { value: "ext", label: "Extension / addition" },
  { value: "gf", label: "Granny flat / secondary" },
]

export const FINISH_LEVELS = [
  { value: "economy", label: "Economy" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
]

export const WALL_TYPES = [
  { value: "bv", label: "Brick veneer" },
  { value: "db", label: "Double brick" },
  { value: "rc", label: "Reinforced concrete" },
]

export const STATES = [
  { value: "default", label: "Select state…" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
]

export const INCLUSIONS = [
  { value: "hasBasement", label: "Basement" },
  { value: "hasElevator", label: "Elevator" },
  { value: "hasMezzanine", label: "Mezzanine" },
  { value: "hasDuctedAC", label: "Ducted Air-Con" },
]

export const INCLUSIONS_BY_TYPE: Record<string, string[]> = {
  House: ["hasBasement", "hasElevator", "hasDuctedAC"],
  "Granny Flat": ["hasDuctedAC"],
  Townhouse: ["hasBasement", "hasDuctedAC"],
  Apartment: ["hasBasement", "hasElevator", "hasDuctedAC"],
  Office: ["hasBasement", "hasElevator", "hasMezzanine", "hasDuctedAC"],
  Warehouse: ["hasBasement", "hasMezzanine", "hasDuctedAC"],
}

export const PROPERTIES_WITH_WALL_OPTIONS = [
  "House",
  "Townhouse",
  "Granny Flat",
] // property types that can have their walls chosen

export const PROPERTIES_WITH_BEDROOMS = [
  "House",
  "Granny Flat",
  "Townhouse",
  "Apartment",
]
