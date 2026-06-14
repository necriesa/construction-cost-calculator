import type { ReactNode } from "react"

export type FormControlProps = {
  label: string
  description?: string
  controlFirst?: boolean
  horizontal?: boolean
  placeholder?: string
}

export type FormBaseProps = {
  children: ReactNode
} & FormControlProps
