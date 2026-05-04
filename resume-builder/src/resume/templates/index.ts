import type { ResumeTemplateDef } from "./types";

import { Template01Classic } from "./Template01Classic";
import { Template02Sidebar } from "./Template02Sidebar";
import { Template03Modern } from "./Template03Modern";
import { Template04Minimal } from "./Template04Minimal";
import { Template05TwoColumn } from "./Template05TwoColumn";
import { Template06Compact } from "./Template06Compact";
import { Template07Executive } from "./Template07Executive";
import { Template08Student } from "./Template08Student";
import { Template09AccentTop } from "./Template09AccentTop";
import { Template10Bordered } from "./Template10Bordered";

export const RESUME_TEMPLATES: ResumeTemplateDef[] = [
  {
    id: "t1-classic",
    name: "Classic ATS",
    description: "Clean, recruiter-friendly, ATS-safe layout.",
    Component: Template01Classic,
  },
  {
    id: "t2-sidebar",
    name: "Sidebar Pro",
    description: "Strong left sidebar for skills + certifications.",
    Component: Template02Sidebar,
  },
  {
    id: "t3-modern",
    name: "Modern Card",
    description: "Modern cards, great for tech roles.",
    Component: Template03Modern,
  },
  {
    id: "t4-minimal",
    name: "Minimal",
    description: "Minimal typography, calm and simple.",
    Component: Template04Minimal,
  },
  {
    id: "t5-two-col",
    name: "Two Column",
    description: "Balanced two-column layout for scanning.",
    Component: Template05TwoColumn,
  },
  {
    id: "t6-compact",
    name: "Compact",
    description: "Fits more content without looking crowded.",
    Component: Template06Compact,
  },
  {
    id: "t7-exec",
    name: "Executive",
    description: "Leadership-focused, impact-first structure.",
    Component: Template07Executive,
  },
  {
    id: "t8-student",
    name: "Student",
    description: "Best for students / internships / projects.",
    Component: Template08Student,
  },
  {
    id: "t9-accent",
    name: "Accent Top",
    description: "Top accent bar, modern without hurting ATS.",
    Component: Template09AccentTop,
  },
  {
    id: "t10-bordered",
    name: "Bordered",
    description: "Soft bordered sections for clarity.",
    Component: Template10Bordered,
  },
];

