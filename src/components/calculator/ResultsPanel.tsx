import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowRight, MailIcon } from "lucide-react"
import type { CalculatorResults } from "@/hooks/useCalculator"
import type { CalculatorFormInput } from "@/lib/formSchemas"
import BreakdownSection from "@/components/calculator/BreakdownSection"
import { FINISH_LEVELS, PROPERTY_TYPES } from "@/lib/data"

interface ResultsPanelProps {
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

const ResultsPanel = ({ results, formValues, onEmailResults }: ResultsPanelProps) => {
  const propertyLabel =
    PROPERTY_TYPES.find((p) => p.value === formValues?.propertyType)?.label ??
    "Property"
  const finishLabel =
    FINISH_LEVELS.find((f) => f.value === formValues?.finishLevel)?.label ??
    "Standard"

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-primary p-7 shadow">
        <h2 className="mb-1 text-sm font-semibold tracking-wider text-primary-foreground/60 uppercase">
          Live Estimate
        </h2>
        <h2 className="mb-6 text-xl leading-snug font-bold text-primary-foreground">
          {propertyLabel} &mdash; {finishLabel} Finish
        </h2>

        {results.isReady ? (
          <>
            <Card className="mb-4 text-center" variant="outline">
              <CardContent>
                <p className="mb-1 text-xs tracking-wide text-chart-2 uppercase">
                  Finish Level Estimate
                </p>
                <p className="text-4xl font-bold text-primary-foreground">
                  {fmt(results.midEstimate)}
                </p>
                <p className="text-sm font-semibold text-primary-foreground/60">
                  {fmt(results.ratePerSqm)}/m&sup2; &middot;{" "}
                  {formValues?.floorArea} m&sup2;
                </p>
              </CardContent>
            </Card>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <Card className="text-center" variant="outline">
                <CardContent>
                  <p className="text-md mb-1 font-semibold tracking-wide text-primary-foreground/60 uppercase">
                    Low Estimate
                  </p>
                  <p className="text-2xl font-bold text-primary-foreground">
                    {fmt(results.lowEstimate)}
                  </p>
                  <p className="text-xs text-primary-foreground/60">
                    -8% variance
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center" variant="outline">
                <CardContent>
                  <p className="text-md mb-1 font-semibold tracking-wide text-primary-foreground/60 uppercase">
                    High Estimate
                  </p>
                  <p className="text-2xl font-bold text-primary-foreground">
                    {fmt(results.highEstimate)}
                  </p>
                  <p className="text-xs text-primary-foreground/60">
                    +9% variance
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="mb-6 text-center" variant="outline">
            <CardContent className="py-8">
              <p className="text-sm text-muted-foreground">
                Select a state to see your live estimate.
              </p>
            </CardContent>
          </Card>
        )}

        {results.isReady && (
          <>
            <Separator className="bg-primary-foreground/20" />

            <BreakdownSection
              breakdown={results.breakdown}
              total={results.midEstimate}
            />

            <Separator className="bg-primary-foreground/20" />

            <a
              href="https://duotax.com.au/construction-estimations/initial-cost-report/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                className="mt-6 w-full p-6 font-bold"
                size="lg"
              >
                Order Initial Cost Report <ArrowRight />
              </Button>
            </a>

            <Button
              className="mt-4 w-full rounded-md border-primary-foreground/20 p-6 font-bold text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              variant="outline"
              onClick={onEmailResults}
            >
              <MailIcon /> Email me these results
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default ResultsPanel
