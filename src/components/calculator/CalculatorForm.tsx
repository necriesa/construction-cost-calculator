import { useEffect } from "react"
import { useStore } from "@tanstack/react-store"
import { useAppForm } from "@/hooks/useAppForm"
import {
  CalculatorFormSchema,
  type CalculatorFormInput,
} from "@/lib/formSchemas"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  BUILD_TYPES,
  FINISH_LEVELS,
  INCLUSIONS,
  INCLUSIONS_BY_TYPE,
  PROPERTIES_WITH_BEDROOMS,
  PROPERTIES_WITH_WALL_OPTIONS,
  PROPERTY_TYPES,
  STATES,
  WALL_TYPES,
} from "@/lib/data"
import { Separator } from "@/components/ui/separator"
import { SelectItem } from "@/components/ui/select"

interface CalculatorFormProps {
  onValuesChange?: (values: CalculatorFormInput) => void
}

const CalculatorForm = ({ onValuesChange }: CalculatorFormProps) => {
  const form = useAppForm({
    defaultValues: {
      propertyType: "House",
      buildType: "new",
      finishLevel: "standard",
      floorArea: 50,
      state: undefined as string | undefined,
      completionYear: "2026",
      wallType: "bv",
      numBedrooms: 3,
      numFloors: 1,
      hasBasement: false,
      hasElevator: false,
      hasMezzanine: false,
      hasDuctedAC: false,
    } as CalculatorFormInput,
    validators: {
      onChange: CalculatorFormSchema,
    },
  })

  // Subscribe to form values and sync to parent
  const values = useStore(form.baseStore, (s) => s.values)
  useEffect(() => {
    onValuesChange?.(values)
  }, [values, onValuesChange])

  // Reset inclusions and bedrooms when property type changes
  const prevPropertyType = useStore(
    form.baseStore,
    (s) => s.values.propertyType
  )
  useEffect(() => {
    const allowed = INCLUSIONS_BY_TYPE[prevPropertyType] ?? []
    // Turn off any inclusions not supported by the new property type
    for (const inc of INCLUSIONS) {
      if (!allowed.includes(inc.value)) {
        form.setFieldValue(
          inc.value as keyof CalculatorFormInput,
          false as never
        )
      }
    }
    // Reset bedrooms for property types that don't use them
    if (!PROPERTIES_WITH_BEDROOMS.includes(prevPropertyType)) {
      form.setFieldValue("numBedrooms", 0 as never)
    } else {
      // For types that do use bedrooms, reset to 3 (a common default) if currently 0
      const currentBedrooms = form.getFieldValue("numBedrooms") as
        | number
        | undefined
      if (currentBedrooms === 0) {
        form.setFieldValue("numBedrooms", 3 as never)
      }
    }
  }, [form, prevPropertyType])

  const renderInclusions = (propertyType: string) => {
    const allowed = INCLUSIONS_BY_TYPE[propertyType] ?? []
    return INCLUSIONS.filter((inc) => allowed.includes(inc.value)).map(
      (inc) => (
        <form.AppField
          key={inc.value}
          name={inc.value as keyof CalculatorFormInput}
        >
          {(field) => <field.switchCard label={inc.label} />}
        </form.AppField>
      )
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background shadow-lg">
      <form>
        <div className="text-md items-center bg-primary p-4 pl-8 font-medium text-primary-foreground">
          Property Details
        </div>
        <FieldGroup className="p-6">
          <form.AppField name="propertyType">
            {(field) => (
              <field.pillSelector
                label="Investment Property Type"
                options={PROPERTY_TYPES}
              />
            )}
          </form.AppField>
          <Separator />

          <form.AppField name="buildType">
            {(field) => (
              <field.pillSelector label="Build Type" options={BUILD_TYPES} />
            )}
          </form.AppField>
          <Separator />

          <form.AppField name="finishLevel">
            {(field) => (
              <field.pillSelector
                label="Finish Level"
                options={FINISH_LEVELS}
              />
            )}
          </form.AppField>
          <Separator />

          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="state">
                {(field) => (
                  <field.select label="State" placeholder="default">
                    {STATES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </field.select>
                )}
              </form.AppField>
              <form.AppField name="completionYear">
                {(field) => (
                  <field.select label="Completion Year" placeholder="2026">
                    {[...Array(new Date().getFullYear() - 1987)].map((_, i) => {
                      const year = new Date().getFullYear() - i
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    })}
                    <SelectItem value="1987">Sept 1987</SelectItem>
                    <SelectItem value="1986">&lt; Sept 1987</SelectItem>
                  </field.select>
                )}
              </form.AppField>
            </div>
          </FieldGroup>
          <Separator />

          <Field>
            <FieldLabel>Size &amp; Layout</FieldLabel>
            <form.AppField name="floorArea">
              {(field) => (
                <field.slider
                  label="Floor Area"
                  min={0}
                  max={1040}
                  step={5}
                  formatValue={(val) => `${val[0]} m²`}
                />
              )}
            </form.AppField>
            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="numFloors">
                {(field) => (
                  <field.stepper label="Number of Floors" min={1} max={10} />
                )}
              </form.AppField>

              <form.Subscribe selector={(s) => s.values.propertyType}>
                {(propertyType) =>
                  PROPERTIES_WITH_BEDROOMS.includes(propertyType) && (
                    <form.AppField name="numBedrooms">
                      {(field) => (
                        <field.stepper
                          label="Number of Bedrooms"
                          min={0}
                          max={10}
                        />
                      )}
                    </form.AppField>
                  )
                }
              </form.Subscribe>
            </div>
          </Field>
          <Separator />

          <form.Subscribe selector={(s) => s.values.propertyType}>
            {(propertyType) =>
              PROPERTIES_WITH_WALL_OPTIONS.includes(propertyType) && (
                <>
                  <form.AppField name="wallType">
                    {(field) => (
                      <field.pillSelector
                        label="Wall Type"
                        options={WALL_TYPES.map((w) => ({
                          value: w.value,
                          label: w.label,
                        }))}
                      />
                    )}
                  </form.AppField>
                  <Separator />
                </>
              )
            }
          </form.Subscribe>

          <Field>
            <FieldLabel>Inclusions</FieldLabel>
            <form.Subscribe selector={(s) => s.values.propertyType}>
              {(propertyType) => (
                <div className="grid gap-4 md:grid-cols-2">
                  {renderInclusions(propertyType)}
                </div>
              )}
            </form.Subscribe>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}

export default CalculatorForm
