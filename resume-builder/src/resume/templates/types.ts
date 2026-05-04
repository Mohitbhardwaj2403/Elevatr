import type { Palette } from "../palettes";
import type { ResumeData } from "../types";

export type ResumeTemplateProps = {
  data: ResumeData;
  palette: Palette;
};

export type ResumeTemplateDef = {
  id: string;
  name: string;
  description: string;
  Component: React.FC<ResumeTemplateProps>;
};

