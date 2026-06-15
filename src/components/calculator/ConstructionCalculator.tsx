import { useState } from "react"
import CalculatorForm from "@/components/calculator/CalculatorForm"
import ResultsPanel from "@/components/calculator/ResultsPanel"
import { useCalculator } from "@/hooks/useCalculator"
import type { CalculatorFormInput } from "@/lib/formSchemas"

const ConstructionCalculator = () => {
  const [formValues, setFormValues] = useState<CalculatorFormInput | null>(null)
  const results = useCalculator(formValues)

  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <CalculatorForm onValuesChange={setFormValues} />
      <ResultsPanel results={results} formValues={formValues} />
    </div>
  )
}

export default ConstructionCalculator
