import ResultsPanel from "./components/calculator/ResultsPanel"
import CalculatorForm from "./components/calculator/CalculatorForm"
import { useCalculator } from "./hooks/useCalculator"
import { useState } from "react"
import type { CalculatorFormInput } from "./lib/formSchemas"

export function App() {
  const [formValues, setFormValues] = useState<CalculatorFormInput | null>(null)
  const results = useCalculator(formValues)

  return (
    <div className="min-h-screen">
      <header className="bg-primary px-6 pt-12 pb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
          Construction Cost Calculator
        </h1>
        <p className="mx-auto mb-4 max-w-2xl text-lg text-primary-foreground/70 sm:text-xl sm:leading-relaxed">
          Knowing the costs of building a property in Australia is essential for
          budget control and monitoring.
        </p>
        <p className="mx-auto max-w-2xl text-lg text-primary-foreground/70 sm:text-xl sm:leading-relaxed">
          To estimate how much it will cost to build a house, use our
          construction cost calculator. Every house is different in size, floor
          area, and finish.
        </p>
      </header>

      <main className="mx-auto -mt-7 grid max-w-[1280px] grid-cols-1 items-start gap-6 px-5 pb-16 md:grid-cols-[1fr_420px]">
        <CalculatorForm onValuesChange={setFormValues} />

        <aside className="sticky top-6 hidden md:block">
          <ResultsPanel results={results} formValues={formValues} />
        </aside>
      </main>
    </div>
  )
}

export default App
