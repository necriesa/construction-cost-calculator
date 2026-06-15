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
    <div className="mt-4 mb-4 py-2">
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
                <p className="text-sm font-semibold text-muted/80">
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
                    ? "text-muted"
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

      <Separator className="my-4 bg-muted-foreground/90" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-wide text-muted uppercase">
          Finish Level Total
        </span>
        <span className="text-lg font-bold text-chart-2 tabular-nums">
          {fmt(total)}
        </span>
      </div>
    </div>
  )
}

export default BreakdownSection
