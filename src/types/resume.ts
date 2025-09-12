export type Introduction = { name: string; tagline: string };
export type Job = { company: string; role: string; period: string; details: string[] };
export type EducationEntry = { institution: string; degree: string; year: string };
export type Project = { title: string; description: string; github?: string };
export type ContactInfo = { email: string; linkedin: string; github?: string };

export type Resume = {
    introduction: Introduction;
    workExperience: Job[];
    education: EducationEntry[];
    skills: string[];
    projects: Project[];
    contact: ContactInfo;
};
