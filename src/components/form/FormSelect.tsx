import type { FormControlProps } from "@/lib/types"
import type { ReactNode } from "react"
import { useFieldContext } from "./context"
import FormBase from "./FormBase"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FormSelect = ({
  children,
  ...props
}: FormControlProps & { children: ReactNode }) => {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormBase {...props}>
      <Select
        onValueChange={(e) => field.handleChange(e)}
        value={field.state.value}
      >
        <SelectTrigger
          aria-invalid={isInvalid}
          id={field.name}
          onBlur={field.handleBlur}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">{children}</SelectContent>
      </Select>
    </FormBase>
  )
}

export default FormSelect
