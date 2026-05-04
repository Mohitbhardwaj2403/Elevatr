export type ResumeBasics = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
};

export type ResumeExperience = {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export type ResumeEducation = {
  id: string;
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  details: string;
};

export type ResumeProject = {
  id: string;
  name: string;
  link: string;
  tech: string;
  bullets: string[];
};

export type ResumeCertification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type ResumeData = {
  basics: ResumeBasics;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  achievements: string[];
};

