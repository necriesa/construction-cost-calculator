import { useFieldContext } from "./context"
import FormBase from "./FormBase"
import { PillSelector, type PillOption } from "@/components/ui/pill-selector"
import type { FormControlProps } from "@/lib/types"

type FormPillSelectorProps = FormControlProps & {
  options: PillOption[]
}

const FormPillSelector = ({ options, ...props }: FormPillSelectorProps) => {
  const field = useFieldContext<string>()

  return (
    <FormBase {...props}>
      <PillSelector
        name={field.name}
        options={options}
        value={field.state.value}
        onChange={field.handleChange}
      />
    </FormBase>
  )
}

export default FormPillSelector
