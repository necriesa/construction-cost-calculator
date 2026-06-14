import type { FormControlProps } from "@/lib/types"
import { useFieldContext } from "./context"
import FormBase from "./FormBase"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type FormInputProps = FormControlProps & {
  type?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

const FormInput = ({
  type,
  leftElement,
  rightElement,
  placeholder,
  ...props
}: FormInputProps) => {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormBase {...props}>
      <InputGroup>
        <InputGroupInput
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          type={type}
          placeholder={placeholder}
        />
        <InputGroupAddon>{leftElement}</InputGroupAddon>
        <InputGroupAddon align="inline-end">{rightElement}</InputGroupAddon>
      </InputGroup>
    </FormBase>
  )
}

export default FormInput
