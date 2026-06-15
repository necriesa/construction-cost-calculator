import * as React from "react"
import { CheckCircle2, ArrowRight, MailIcon } from "lucide-react"
import { useAppForm } from "@/hooks/useAppForm"
import { EmailSchema } from "@/lib/formSchemas"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { FINISH_LEVELS, PROPERTY_TYPES } from "@/lib/data"
import type { CalculatorResults } from "@/hooks/useCalculator"
import type { CalculatorFormInput } from "@/lib/formSchemas"

const fmt = (n: number) =>
  n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  })

function buildMailtoBody(
  firstName: string,
  results: CalculatorResults,
  formValues: CalculatorFormInput
): string {
  const finishLabel =
    FINISH_LEVELS.find((f) => f.value === formValues.finishLevel)?.label ??
    "Standard"
  const propertyLabel =
    PROPERTY_TYPES.find((p) => p.value === formValues.propertyType)?.label ??
    "Property"
  const div = "=========================================="

  const lines: string[] = [
    `Hi ${firstName},`,
    ``,
    `Here is your construction cost estimate from Duo Tax.`,
    ``,
    div,
    `PROPERTY:          ${propertyLabel} - ${finishLabel} Finish`,
    `FLOOR AREA:        ${formValues.floorArea} m2`,
    `STATE:             ${formValues.state}`,
    `COMPLETION YEAR:   ${formValues.completionYear}`,
    div,
    ``,
    `FINISH LEVEL ESTIMATE:   ${fmt(results.midEstimate)}`,
    `Rate per m2:             ${fmt(results.ratePerSqm)}/m2`,
    ``,
    `  Low estimate  (-8%):   ${fmt(results.lowEstimate)}`,
    `  High estimate (+9%):   ${fmt(results.highEstimate)}`,
    ``,
    div,
    `COST BREAKDOWN`,
    div,
    ``,
  ]

  results.breakdown.forEach((line, i) => {
    const prefix = i === 0 ? "  " : line.amount >= 0 ? "  +" : "  "
    lines.push(`${prefix}${line.label.padEnd(36)} ${fmt(line.amount)}`)
    if (line.note) lines.push(`    (${line.note})`)
  })

  lines.push(``)
  lines.push(`  ${"TOTAL".padEnd(36)} ${fmt(results.midEstimate)}`)
  lines.push(``)
  lines.push(div)
  lines.push(``)
  lines.push(`Disclaimer: This estimate is a guide only and should not be`)
  lines.push(`construed as legal or tax advice. Please consult a professional.`)
  lines.push(``)
  lines.push(`Duo Tax - https://duotax.com.au`)
  return lines.join("\n")
}

type ExportModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isSendingEmail: boolean
  onSendEmail: () => void
  onClose: () => void
  results: CalculatorResults
  formValues: CalculatorFormInput | null
}

type Step = "form" | "success"

const ExportModal = ({
  isOpen,
  onOpenChange,
  onSendEmail,
  onClose,
  results,
  formValues,
}: ExportModalProps) => {
  const [step, setStep] = React.useState<Step>("form")
  const [sentEmail, setSentEmail] = React.useState("")
  const [sentFirstName, setSentFirstName] = React.useState("")

  const finishLabel =
    FINISH_LEVELS.find((f) => f.value === formValues?.finishLevel)?.label ??
    "Standard"
  const propertyLabel =
    PROPERTY_TYPES.find((p) => p.value === formValues?.propertyType)?.label ??
    "Property"

  const form = useAppForm({
    defaultValues: { firstName: "", lastName: "", email: "" },
    validators: { onSubmit: EmailSchema },
    onSubmit: ({ value }) => {
      if (!formValues) return
      const subject = encodeURIComponent(
        `Your Construction Cost Estimate - ${propertyLabel}, ${finishLabel} Finish`
      )
      const body = encodeURIComponent(
        buildMailtoBody(value.firstName, results, formValues)
      )
      window.location.href = `mailto:${value.email}?subject=${subject}&body=${body}`
      setSentEmail(value.email)
      setSentFirstName(value.firstName)
      onSendEmail()
      setStep("success")
    },
  })

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) {
        setStep("form")
        form.reset()
      }
      onOpenChange(open)
    },
    [form, onOpenChange]
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          // Strip default gap/padding — each step controls its own layout
          "gap-0 overflow-hidden p-0",
          // Mobile: full-width bottom sheet
          "top-auto right-0 bottom-0 left-0 translate-x-0 translate-y-0",
          "max-h-[92dvh] max-w-full overflow-y-auto rounded-t-4xl rounded-b-none",
          // Desktop: centred modal (restore shadcn defaults)
          "sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2",
          "sm:-translate-x-1/2 sm:-translate-y-1/2",
          "sm:max-h-[90dvh] sm:max-w-md sm:rounded-4xl"
        )}
      >
        {step === "form" ? (
          <div className="p-6">
            <DialogHeader className="mb-5 pr-8">
              <DialogTitle className="text-lg font-bold text-foreground">
                Email my results
              </DialogTitle>
              <DialogDescription>
                We will send a full breakdown of your estimate straight to your
                inbox.
              </DialogDescription>
            </DialogHeader>

            {/* Estimate summary */}
            <div className="mb-6 rounded-xl bg-primary px-4 py-4">
              <p className="mb-0.5 text-xs font-semibold tracking-wider text-primary-foreground/55 uppercase">
                {propertyLabel} - {finishLabel} Finish
              </p>
              <p className="text-3xl font-bold text-primary-foreground">
                {results.isReady ? fmt(results.midEstimate) : "-"}
              </p>
              {results.isReady && (
                <>
                  <p className="mt-0.5 text-xs text-primary-foreground/55">
                    {fmt(results.ratePerSqm)}/m2 &middot;{" "}
                    {formValues?.floorArea} m2 &middot; {formValues?.state}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-primary-foreground/10 px-3 py-2 text-center">
                      <p className="text-xs tracking-wide text-primary-foreground/55 uppercase">
                        Low
                      </p>
                      <p className="text-sm font-bold text-primary-foreground">
                        {fmt(results.lowEstimate)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary-foreground/10 px-3 py-2 text-center">
                      <p className="text-xs tracking-wide text-primary-foreground/55 uppercase">
                        High
                      </p>
                      <p className="text-sm font-bold text-primary-foreground">
                        {fmt(results.highEstimate)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <form.AppField name="firstName">
                    {(field) => (
                      <field.input label="First name" placeholder="Jane" />
                    )}
                  </form.AppField>
                  <form.AppField name="lastName">
                    {(field) => (
                      <field.input label="Last name" placeholder="Smith" />
                    )}
                  </form.AppField>
                </div>
                <form.AppField name="email">
                  {(field) => (
                    <field.input
                      label="Email address"
                      type="email"
                      placeholder="jane@example.com"
                    />
                  )}
                </form.AppField>
              </div>

              <form.Subscribe selector={(state) => state.canSubmit}>
                {(canSubmit) => (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    disabled={!canSubmit}
                    className="mt-6 w-full"
                  >
                    Send my estimate <ArrowRight className="size-4" />
                  </Button>
                )}
              </form.Subscribe>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Your details are only used to send this estimate.
              </p>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="size-8 text-emerald-500" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">
              Check your email, {sentFirstName}!
            </h2>
            <p className="mb-1 text-sm text-muted-foreground">
              Your estimate has been prepared for
            </p>
            <p className="mb-6 text-sm font-semibold text-foreground">
              {sentEmail}
            </p>
            <p className="mb-8 max-w-xs text-xs text-muted-foreground">
              Your email client should have opened with the full cost breakdown
              ready to send. If nothing appeared, check that a default mail app
              is configured on your device.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="w-full max-w-xs"
              onClick={onClose}
            >
              <MailIcon className="size-4" /> Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ExportModal
