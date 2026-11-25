// url=https://www.figma.com/design/2K5znmoaC65yDuVPAXrsjI/ACE?node-id=219-3564
// source=components/secondary-button.tsx
// component=SecondaryButton
import figma from "figma";

const instance = figma.selectedInstance;
const color = instance.getEnum("color", {
  outline: "outline",
  black: "black",
  yellow: "yellow",
  "white outline": "white-outline",
  "text only": "text-only",
});
const arrow = instance.getBoolean("arrow");
const label = instance.findText("Button");
const children = label && label.type === "TEXT" ? label.textContent : "Action";

export default {
  example: figma.code`<SecondaryButton href="#" color="${color}" arrow={${arrow}}>${children}</SecondaryButton>`,
  imports: ['import { SecondaryButton } from "@/components/secondary-button"'],
  id: "secondary-button",
  metadata: { nestable: true },
};
