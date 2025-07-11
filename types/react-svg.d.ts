declare module "react" {
  import type { SVGProps, FunctionComponent } from "react"
  // lucide-react@0.454 expects a ReactSVG type which no longer exists in React 19 type declarations.
  // Provide a minimal fallback so TypeScript can compile.
  export type ReactSVG = FunctionComponent<SVGProps<SVGSVGElement>>
}