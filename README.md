# Construction Cost Calculator

**Live:** [construction-cost-calculator-nu.vercel.app](https://construction-cost-calculator-nu.vercel.app/)

A modern, professional construction cost calculator for Australian residential properties. Built as a redesign of the [Duo Tax Construction Cost Calculator](https://duotax.com.au/construction-cost-calculator/), targeting the quality bar of a major financial institution.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** with `@tailwindcss/vite` (no PostCSS)
- **Tailwind CSS v4** — CSS-first architecture, all tokens in `src/index.css` via `@theme inline`
- **shadcn/ui** — component primitives via Radix UI
- **TanStack Form** + **Zod** — form state and validation
- **Inter Variable** font

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler (no emit) |
| `npm run format` | Format all `.ts`/`.tsx` files with Prettier |

## Project Structure

```
src/
├── components/
│   ├── calculator/       # Page-level calculator components
│   │   ├── CalculatorForm.tsx
│   │   ├── ResultsPanel.tsx
│   │   ├── BreakdownSection.tsx
│   │   ├── MobileResultsBar.tsx
│   │   └── ExportModal.tsx
│   ├── form/             # Reusable form field components
│   │   ├── FormInput.tsx
│   │   ├── FormSelect.tsx
│   │   ├── FormSlider.tsx
│   │   ├── FormStepper.tsx
│   │   ├── FormPillSelector.tsx
│   │   ├── FormSwitchCard.tsx
│   │   ├── FormBase.tsx
│   │   └── context.tsx
│   └── ui/               # shadcn/ui primitives
├── hooks/
│   ├── useCalculator.tsx  # Core cost calculation logic
│   └── useAppForm.tsx     # Form setup and defaults
├── lib/
│   ├── calculatorRates.ts # Construction rate constants
│   ├── data.ts            # Dropdown/option data
│   ├── formSchemas.ts     # Zod schemas for form input/output
│   ├── types.ts           # Shared TypeScript types
│   └── utils.ts           # cn() helper and utilities
├── index.css              # Tailwind v4 theme tokens (@theme inline)
└── App.tsx
```

## Theming

The app supports **light**, **dark**, and **system** themes via `ThemeProvider` (`src/components/theme-provider.tsx`). The selected theme is persisted to `localStorage` under the key `"theme"`.

**Keyboard shortcut:** Press `D` (when not focused on an input) to toggle between light and dark mode.

**Programmatic usage:**

```tsx
import { useTheme } from "@/components/theme-provider"

const { theme, setTheme } = useTheme()

setTheme("dark")    // force dark
setTheme("light")   // force light
setTheme("system")  // follow OS preference
```

To change the default theme, update the `defaultTheme` prop on `<ThemeProvider>` in `src/main.tsx`.

All colour tokens for both modes are defined in `src/index.css` — `:root` for light and `.dark` for dark. To customise the palette, edit the `oklch(...)` values there directly.

## Architecture Notes

**Tailwind v4 CSS-first setup** — there is no `tailwind.config.js`. All design tokens live in `src/index.css` under `@theme inline`. The `components.json` `tailwind.config` field is intentionally an empty string `""`.

**Adding shadcn/ui components:**

```bash
npx shadcn@latest add <component>
```

Components are placed in `src/components/ui/`.

**Path aliases** — `@/` resolves to `./src` (configured in `vite.config.ts` and `tsconfig.app.json`).
