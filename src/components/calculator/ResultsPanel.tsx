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
}

const fmt = (n: number) =>
  n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  })

const ResultsPanel = ({ results, formValues }: ResultsPanelProps) => {
  const propertyLabel =
    PROPERTY_TYPES.find((p) => p.value === formValues?.propertyType)?.label ??
    "Property"
  const finishLabel =
    FINISH_LEVELS.find((f) => f.value === formValues?.finishLevel)?.label ??
    "Standard"

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border bg-primary p-7 shadow">
        <h2 className="mb-1 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Live Estimate
        </h2>
        <h2 className="mb-6 text-xl leading-snug font-bold text-muted">
          {propertyLabel} &mdash; {finishLabel} Finish
        </h2>

        {results.isReady ? (
          <>
            <Card className="mb-4 text-center" variant="outline">
              <CardContent>
                <p className="mb-1 text-xs tracking-wide text-chart-2 uppercase">
                  Finish Level Estimate
                </p>
                <p className="text-4xl font-bold text-muted">
                  {fmt(results.midEstimate)}
                </p>
                <p className="text-sm font-semibold text-muted-foreground">
                  {fmt(results.ratePerSqm)}/m&sup2; &middot;{" "}
                  {formValues?.floorArea} m&sup2;
                </p>
              </CardContent>
            </Card>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <Card className="text-center" variant="outline">
                <CardContent>
                  <p className="text-md mb-1 font-semibold tracking-wide text-muted-foreground uppercase">
                    Low Estimate
                  </p>
                  <p className="text-2xl font-bold text-muted">
                    {fmt(results.lowEstimate)}
                  </p>
                  <p className="text-xs text-muted-foreground">-8% variance</p>
                </CardContent>
              </Card>
              <Card className="text-center" variant="outline">
                <CardContent>
                  <p className="text-md mb-1 font-semibold tracking-wide text-muted-foreground uppercase">
                    High Estimate
                  </p>
                  <p className="text-2xl font-bold text-muted">
                    {fmt(results.highEstimate)}
                  </p>
                  <p className="text-xs text-muted-foreground">+9% variance</p>
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
            <Separator className="bg-muted-foreground/50" />

            <BreakdownSection
              breakdown={results.breakdown}
              total={results.midEstimate}
            />

            <Separator className="bg-muted-foreground/50" />

            <a
              href="https://duotax.com.au/construction-estimations/initial-cost-report/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="mt-6 w-full rounded-md bg-chart-2 p-6 font-bold text-muted hover:bg-chart-2/80"
                size="lg"
              >
                Order Initial Cost Report <ArrowRight />
              </Button>
            </a>

            <Button
              className="mt-4 w-full rounded-md p-6 font-bold text-muted-foreground"
              variant="outline"
            >
              <MailIcon /> Email me these results
            </Button>

            <div className="mt-6 rounded-md border border-accent/20 bg-accent/5 p-2">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-bold">Disclaimer: </span>Please note that
                every effort has been made to ensure that the information
                provided in this guide is accurate. You should note, however,
                that the information is intended as a guide only, providing an
                overview of general information available to property investors.
                This guide is not intended to be an exhaustive source of
                information and should not be seen to constitute legal or tax
                advice. You should, where necessary, seek a second professional
                opinion for any legal or tax issues raised in your investing
                affairs.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ResultsPanel
