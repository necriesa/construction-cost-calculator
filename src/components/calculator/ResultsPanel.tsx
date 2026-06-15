import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowRight, MailIcon } from "lucide-react"

const ResultsPanel = () => {
  return (
    <div className="rounded-lg border bg-primary p-7 shadow">
      <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
        Live Estimate
      </h2>
      <h2 className="mb-6 text-xl leading-snug font-bold text-muted">
        House - Standard Finish
      </h2>

      <Card className="mb-4 text-center" variant="outline">
        <CardContent>
          <p className="mb-1 text-xs tracking-wide text-chart-2 uppercase">
            Mid-Range Estimate
          </p>
          <p className="text-4xl font-bold text-muted">$370,000</p>
          <p className="text-sm font-semibold text-muted-foreground">
            $1,600/m2 - 200m2
          </p>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <Card className="text-center" variant="outline">
          <CardContent>
            <p className="text-md mb-1 font-semibold tracking-wide text-muted-foreground uppercase">
              Low Estimate
            </p>
            <p className="text-2xl font-bold text-muted">$314,500</p>
          </CardContent>
        </Card>
        <Card className="text-center" variant="outline">
          <CardContent>
            <p className="text-md mb-1 font-semibold tracking-wide text-muted-foreground uppercase">
              High Estimate
            </p>
            <p className="text-2xl font-bold text-muted">$444,000</p>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}

export default ResultsPanel
