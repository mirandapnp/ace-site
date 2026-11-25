// url=https://www.figma.com/design/2K5znmoaC65yDuVPAXrsjI/ACE?node-id=1088-11561
// source=components/label-badge.tsx
// component=LabelBadge
import figma from "figma";

const instance = figma.selectedInstance;
const variant = instance.getEnum("variant", {
  top: "top",
  kid: "kid",
  new: "new",
});

export default {
  example: figma.code`<LabelBadge variant="${variant}" />`,
  imports: ['import { LabelBadge } from "@/components/label-badge"'],
  id: "label-badge",
  metadata: { nestable: true },
};
