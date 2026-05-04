import type { ResumeData } from "../types";

import TemplateClassic from "./TemplateClassic";
import TemplateModern from "./TemplateModern";
import TemplateSidebar from "./TemplateSidebar";
import TemplateLatexClean from "./TemplateLatexClean";
import TemplateLatexTwoColumn from "./TemplateLatexTwoColumn";
import TemplateMinimal from "./TemplateMinimal";
import TemplateExecutive from "./TemplateExecutive";
import TemplateCompact from "./TemplateCompact";
import TemplateAccentHeader from "./TemplateAccentHeader";
import TemplateTimeline from "./TemplateTimeline";

export type ResumeTemplateDef = {
  id: string;
  name: string;
  description: string;
  Component: (props: { data: ResumeData }) => JSX.Element;
};

export const RESUME_TEMPLATES: ResumeTemplateDef[] = [
  { id: "t-classic", name: "Classic", description: "Clean ATS-friendly layout", Component: TemplateClassic },
  { id: "t-modern", name: "Modern", description: "Modern card + split layout", Component: TemplateModern },
  { id: "t-sidebar", name: "Sidebar", description: "Left sidebar for links & skills", Component: TemplateSidebar },
  { id: "t-latex-clean", name: "LaTeX Clean", description: "Tight LaTeX-inspired hierarchy", Component: TemplateLatexClean },
  { id: "t-latex-2col", name: "LaTeX Two Column", description: "LaTeX-inspired 2-column layout", Component: TemplateLatexTwoColumn },
  { id: "t-minimal", name: "Minimal", description: "Minimal typography, compact spacing", Component: TemplateMinimal },
  { id: "t-executive", name: "Executive", description: "Achievement-forward executive style", Component: TemplateExecutive },
  { id: "t-compact", name: "Compact", description: "Two-column compact one-page feel", Component: TemplateCompact },
  { id: "t-accent", name: "Accent Header", description: "Bold accent header band", Component: TemplateAccentHeader },
  { id: "t-timeline", name: "Timeline", description: "Timeline-style experience section", Component: TemplateTimeline },
];

export function templateById(id: string) {
  return RESUME_TEMPLATES.find((t) => t.id === id) || RESUME_TEMPLATES[0];
}

