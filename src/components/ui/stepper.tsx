import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type StepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

function Stepper({ value, onChange, min = 1, max = 99, className }: StepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-lg border border-border",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease"
        className="h-11 w-10 rounded-none bg-muted text-lg font-semibold hover:bg-input"
      >
        −
      </Button>
      <span
        className={cn(
          "flex h-11 w-16 select-none items-center justify-center",
          "border-x border-border bg-background",
          "text-sm font-bold text-foreground"
        )}
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase"
        className="h-11 w-10 rounded-none bg-muted text-lg font-semibold hover:bg-input"
      >
        +
      </Button>
    </div>
  )
}

export { Stepper }
