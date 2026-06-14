import { useFieldContext } from "./context"
import FormBase from "./FormBase"
import { Stepper } from "@/components/ui/stepper"
import type { FormControlProps } from "@/lib/types"

type FormStepperProps = FormControlProps & {
  min?: number
  max?: number
}

const FormStepper = ({ min, max, ...props }: FormStepperProps) => {
  const field = useFieldContext<number>()

  return (
    <FormBase {...props}>
      <Stepper
        value={field.state.value}
        onChange={field.handleChange}
        min={min}
        max={max}
      />
    </FormBase>
  )
}

export default FormStepper
