// url=https://www.figma.com/design/2K5znmoaC65yDuVPAXrsjI/ACE?node-id=357-28687
// source=components/open-product-button.tsx
// component=OpenProductButton
import figma from "figma";

const instance = figma.selectedInstance;
const size = instance.getEnum("size", {
  big: "big",
  small: "small",
});

export default {
  example: figma.code`<OpenProductButton href="#" label="Open product" size="${size}" />`,
  imports: ['import { OpenProductButton } from "@/components/open-product-button"'],
  id: "open-product-button",
  metadata: { nestable: true },
};
