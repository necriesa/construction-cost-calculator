import { useFieldContext } from "./context"
import FormBase from "./FormBase"
import { Slider } from "@/components/ui/slider"
import type { FormControlProps } from "@/lib/types"

type FormSliderProps = FormControlProps & {
  min?: number
  max?: number
  step?: number
  formatValue?: (value: number[]) => string
}

const FormSlider = ({
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  ...props
}: FormSliderProps) => {
  const field = useFieldContext<number[]>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  // Override description to show live value if formatValue is provided
  const description = formatValue
    ? formatValue(field.state.value)
    : props.description

  return (
    <FormBase {...props} description={description}>
      <Slider
        id={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        min={min}
        max={max}
        step={step}
        aria-invalid={isInvalid}
      />
    </FormBase>
  )
}

export default FormSlider
