import { describe, it, expect } from 'vitest';
import resume from '../data/resume.json';
import type { Resume } from '../types/resume';

// Checks the real content in resume.json — component tests use their own fixtures
const data: Resume = resume;

const isFilled = (value: string) => value.trim().length > 0;

const isHttpsUrl = (value: string) => {
    try {
        return new URL(value).protocol === 'https:';
    } catch {
        return false;
    }
};

const duplicates = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i);

describe('resume.json content', () => {
    it('has a name and tagline', () => {
        expect(isFilled(data.introduction.name)).toBe(true);
        expect(isFilled(data.introduction.tagline)).toBe(true);
    });

    it('has at least one entry in every section', () => {
        expect(data.workExperience.length).toBeGreaterThan(0);
        expect(data.education.length).toBeGreaterThan(0);
        expect(data.skills.length).toBeGreaterThan(0);
        expect(data.projects.length).toBeGreaterThan(0);
    });

    it('starts work experience with a company (blank companies continue the one above)', () => {
        expect(isFilled(data.workExperience[0].company)).toBe(true);
    });

    it('has a role, period and filled-in details for every job', () => {
        data.workExperience.forEach(job => {
            expect(isFilled(job.role), `role missing for ${job.period}`).toBe(true);
            expect(isFilled(job.period), `period missing for ${job.role}`).toBe(true);
            expect(job.details.length, `no details for ${job.role}`).toBeGreaterThan(0);
            job.details.forEach(detail => expect(isFilled(detail), `blank detail in ${job.role}`).toBe(true));
        });
    });

    it('has an institution, degree and year for every education entry', () => {
        data.education.forEach(edu => {
            expect(isFilled(edu.institution)).toBe(true);
            expect(isFilled(edu.degree)).toBe(true);
            expect(isFilled(edu.year), `year missing for ${edu.degree}`).toBe(true);
        });
    });

    it('has a name and at least one filled-in skill for every skill category', () => {
        data.skills.forEach(group => {
            expect(isFilled(group.category)).toBe(true);
            expect(group.skills.length, `no skills in ${group.category}`).toBeGreaterThan(0);
            group.skills.forEach(skill => expect(isFilled(skill), `blank skill in ${group.category}`).toBe(true));
        });
    });

    it('has a title, description and valid GitHub link for every project', () => {
        data.projects.forEach(project => {
            expect(isFilled(project.title)).toBe(true);
            expect(isFilled(project.description), `description missing for ${project.title}`).toBe(true);
            if (project.github !== undefined) {
                expect(isHttpsUrl(project.github), `bad GitHub link for ${project.title}`).toBe(true);
            }
        });
    });

    it('has valid contact details', () => {
        const { email, mobile, linkedin, github } = data.contact;
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        expect(isFilled(mobile)).toBe(true);
        expect(isHttpsUrl(linkedin), 'bad LinkedIn link').toBe(true);
        if (github !== undefined) {
            expect(isHttpsUrl(github), 'bad GitHub link').toBe(true);
        }
    });

    // The components use these values as React keys, so they must be unique
    it('has no duplicate entries that would collide as list keys', () => {
        expect(duplicates(data.skills.map(g => g.category))).toEqual([]);
        data.skills.forEach(group => expect(duplicates(group.skills), group.category).toEqual([]));
        expect(duplicates(data.projects.map(p => p.title))).toEqual([]);
        expect(duplicates(data.workExperience.map(j => `${j.role}-${j.period}`))).toEqual([]);
        data.workExperience.forEach(job => expect(duplicates(job.details), job.role).toEqual([]));

        const institutions = [...new Set(data.education.map(e => e.institution))];
        institutions.forEach(institution => {
            const degrees = data.education.filter(e => e.institution === institution).map(e => e.degree);
            expect(duplicates(degrees), institution).toEqual([]);
        });
    });
});
