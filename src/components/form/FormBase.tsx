import { useFieldContext } from "./context"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import type { FormBaseProps } from "@/lib/types"

const FormBase = ({
  children,
  label,
  description,
  controlFirst,
  horizontal,
}: FormBaseProps) => {
  const field = useFieldContext()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const labelElem = (
    <>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  )

  const errorElem = isInvalid ? (
    <FieldError errors={field.state.meta.errors} />
  ) : null

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? "horizontal" : undefined}
    >
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElem}
            {errorElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElem}</FieldContent>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  )
}

export default FormBase
