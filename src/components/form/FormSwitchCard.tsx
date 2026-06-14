import { useFieldContext } from "./context"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

type FormSwitchCardProps = {
  label: string
  description?: string
}

const FormSwitchCard = ({ label, description }: FormSwitchCardProps) => {
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldLabel htmlFor={field.name}>
      <Field orientation="horizontal" data-invalid={isInvalid}>
        <FieldContent>
          <FieldTitle>{label}</FieldTitle>
          {description && <FieldDescription>{description}</FieldDescription>}
          {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </FieldContent>
        <Switch
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={field.handleChange}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
        />
      </Field>
    </FieldLabel>
  )
}

export default FormSwitchCard
