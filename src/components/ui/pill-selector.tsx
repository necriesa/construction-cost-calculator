import { cn } from "@/lib/utils"
import { Button } from "./button"

export type PillOption = {
  label: string
  value: string
}

type PillSelectorProps = {
  name: string
  options: PillOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

function PillSelector({
  name,
  options,
  value,
  onChange,
  className,
}: PillSelectorProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="radiogroup"
      aria-label={name}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <Button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium select-none",
              "transition-colors duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-accent hover:bg-accent/20 hover:text-accent"
            )}
          >
            {opt.label}
          </Button>
        )
      })}
    </div>
  )
}

export { PillSelector }
