import "styled-components";
import { theme } from "./designSystem";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: typeof theme.colors;
    fontFamily: typeof theme.fontFamily;
  }
}
