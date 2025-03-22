import { animation, keyframes } from "./animation";
import { aspectRatio } from "./aspectRatio";
import { blur } from "./blur";
import { border } from "./border";
import { colors } from "./colors";
import { cursor } from "./cursor";
import { screens } from "./screens";
import { boxShadow } from "./shadows";
import { transition } from "./transitions";
import { typography } from "./typography";
import { zIndex } from "./zIndices";

const customTheme = {
  animation,
  aspectRatio,
  blur,
  boxShadow,
  colors,
  cursor,
  keyframes,
  screens,
  zIndex,
  ...border,
  ...transition,
  ...typography,
};

export default customTheme;
