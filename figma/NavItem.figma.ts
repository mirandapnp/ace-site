// url=https://www.figma.com/design/2K5znmoaC65yDuVPAXrsjI/ACE?node-id=357-28647
// source=components/nav-item.tsx
// component=NavItem
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.findText("Button");
const children = label && label.type === "TEXT" ? label.textContent : "Label";

export default {
  example: figma.code`<NavItem href="#">${children}</NavItem>`,
  imports: ['import { NavItem } from "@/components/nav-item"'],
  id: "nav-item",
  metadata: { nestable: true },
};
