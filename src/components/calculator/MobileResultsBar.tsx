import { MailIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CalculatorResults } from "@/hooks/useCalculator"
import type { CalculatorFormInput } from "@/lib/formSchemas"
import { FINISH_LEVELS } from "@/lib/data"

interface MobileResultsBarProps {
  results: CalculatorResults
  formValues: CalculatorFormInput | null
  onEmailResults?: () => void
}

const fmt = (n: number) =>
  n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  })

const MobileResultsBar = ({ results, formValues, onEmailResults }: MobileResultsBarProps) => {
  const finishLabel =
    FINISH_LEVELS.find((f) => f.value === formValues?.finishLevel)?.label ??
    "Standard"

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />

      <div className="bg-primary px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {results.isReady ? (
              <>
                <p className="truncate text-xs font-medium tracking-wider text-primary-foreground/55 uppercase">
                  {finishLabel} Finish Estimate
                </p>
                <p className="text-2xl leading-tight font-bold text-primary-foreground">
                  {fmt(results.midEstimate)}
                </p>
                <p className="text-xs text-primary-foreground/55">
                  {fmt(results.ratePerSqm)}/m² &middot; {formValues?.floorArea}{" "}
                  m²
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium tracking-wider text-primary-foreground/55 uppercase">
                  Estimate
                </p>
                <p className="text-sm font-semibold text-primary-foreground/60">
                  Select a state to calculate
                </p>
              </>
            )}
          </div>

          <Button
            variant="secondary"
            disabled={!results.isReady}
            onClick={onEmailResults}
            className="shrink-0 gap-1.5 disabled:opacity-40"
          >
            <MailIcon className="h-4 w-4" />
            <span>Email results</span>
          </Button>
        </div>
      </div>

      <div
        className="bg-primary"
        style={{ height: "env(safe-area-inset-bottom)" }}
      />
    </div>
  )
}

export default MobileResultsBar
