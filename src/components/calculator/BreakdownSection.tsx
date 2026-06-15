import type { BreakdownLine } from "@/hooks/useCalculator"
import { Separator } from "@/components/ui/separator"

interface BreakdownSectionProps {
  breakdown: BreakdownLine[]
  total: number
}

const fmt = (n: number) =>
  n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  })

const BreakdownSection = ({ breakdown, total }: BreakdownSectionProps) => {
  return (
    <div className="rounded-lg border bg-background p-6 shadow">
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
        Cost Breakdown
      </h3>

      <div className="flex flex-col gap-3">
        {breakdown.map((line, i) => {
          const isFirst = i === 0
          const isPositive = line.amount >= 0

          return (
            <div key={i} className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {line.label}
                </p>
                {line.note && (
                  <p className="text-xs text-muted-foreground">{line.note}</p>
                )}
              </div>
              <span
                className={[
                  "shrink-0 text-sm font-semibold tabular-nums",
                  isFirst
                    ? "text-foreground"
                    : isPositive
                      ? "text-chart-2"
                      : "text-destructive",
                ].join(" ")}
              >
                {isFirst ? "" : isPositive ? "+" : ""}
                {fmt(line.amount)}
              </span>
            </div>
          )
        })}
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-wide text-foreground uppercase">
          Finish Level Total
        </span>
        <span className="text-lg font-bold text-foreground tabular-nums">
          {fmt(total)}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-bold">Disclaimer: </span>Please note that every
        effort has been made to ensure that the information provided in this
        guide is accurate. You should note, however, that the information is
        intended as a guide only, providing an overview of general information
        available to property investors. This guide is not intended to be an
        exhaustive source of information and should not be seen to constitute
        legal or tax advice. You should, where necessary, seek a second
        professional opinion for any legal or tax issues raised in your
        investing affairs.
      </p>
    </div>
  )
}

export default BreakdownSection
