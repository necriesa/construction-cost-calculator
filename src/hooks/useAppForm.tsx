import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "../components/form/context"
import FormPillSelector from "@/components/form/FormPillSelector"
import FormStepper from "@/components/form/FormStepper"
import FormSlider from "@/components/form/FormSlider"
import FormInput from "@/components/form/FormInput"
import FormSelect from "@/components/form/FormSelect"

const { useAppForm } = createFormHook({
  fieldComponents: {
    input: FormInput,
    select: FormSelect,
    pillSelector: FormPillSelector,
    stepper: FormStepper,
    slider: FormSlider,
  },
  formComponents: {},
  fieldContext,
  formContext,
})

export { useAppForm }
