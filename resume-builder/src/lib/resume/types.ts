export type ResumeLink = {
  label: string;
  url: string;
};

export type ResumeWorkExperience = {
  id: string;
  company: string;
  location?: string;
  role: string;
  startDate: string;
  endDate: string; // "Present" allowed
  bullets: string[];
};

export type ResumeEducation = {
  id: string;
  school: string;
  degree: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  highlights?: string[];
};

export type ResumeProject = {
  id: string;
  name: string;
  link?: string;
  tech?: string[];
  bullets: string[];
};

export type ResumeCertification = {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
};

export type ResumeSkillGroup = {
  id: string;
  category: string;
  skills: string[];
};

export type ResumeData = {
  meta: {
    title: string;
    templateId: string;
    paletteId: string;
  };
  basics: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    links: ResumeLink[];
  };
  summary: string;
  skills: ResumeSkillGroup[];
  work: ResumeWorkExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  achievements: string[];
};

export const defaultResumeData: ResumeData = {
  meta: {
    title: "My Resume",
    templateId: "t-classic",
    paletteId: "bw",
  },
  basics: {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    links: [{ label: "LinkedIn", url: "" }],
  },
  summary: "",
  skills: [{ id: "sg-1", category: "Skills", skills: [] }],
  work: [
    {
      id: "we-1",
      company: "",
      location: "",
      role: "",
      startDate: "",
      endDate: "Present",
      bullets: [""],
    },
  ],
  projects: [
    {
      id: "pr-1",
      name: "",
      link: "",
      tech: [],
      bullets: [""],
    },
  ],
  education: [
    {
      id: "ed-1",
      school: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      highlights: [""],
    },
  ],
  certifications: [{ id: "c-1", name: "", issuer: "", date: "" }],
  achievements: [""],
};

