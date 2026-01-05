export interface Project {
  id: string;
  badge: string;
  headline: string;
  description: string;
  visualGradient: string;
  link: string;
  longDescription: string;
  image?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
}