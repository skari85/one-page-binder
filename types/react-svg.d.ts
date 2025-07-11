import * as React from "react"

declare module "react" {
  export type ReactSVG = React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}