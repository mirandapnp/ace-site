// url=https://www.figma.com/design/2K5znmoaC65yDuVPAXrsjI/ACE?node-id=219-3492
// source=components/primary-button.tsx
// component=PrimaryButton
import figma from "figma";

const instance = figma.selectedInstance;
const color = instance.getEnum("color", {
  gray: "gray",
  yellow: "yellow",
});
const label = instance.findText("Button");
const children = label && label.type === "TEXT" ? label.textContent : "Action";

export default {
  example: figma.code`<PrimaryButton href="#" color="${color}">${children}</PrimaryButton>`,
  imports: ['import { PrimaryButton } from "@/components/primary-button"'],
  id: "primary-button",
  metadata: { nestable: true },
};
