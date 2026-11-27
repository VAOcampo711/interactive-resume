import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import resume from '../data/resume.json';

describe('App Component', () => {
    it('renders without crashing', () => {
        expect(() => render(<App />)).not.toThrow();
    });

    it('renders all main sections', () => {
        render(<App />);

        expect(document.getElementById('introduction')).toBeInTheDocument();
        expect(document.getElementById('work')).toBeInTheDocument();
        expect(document.getElementById('education')).toBeInTheDocument();
        expect(document.getElementById('skills')).toBeInTheDocument();
        expect(document.getElementById('projects')).toBeInTheDocument();
        expect(document.getElementById('contact')).toBeInTheDocument();
    });

    it('renders sticky navigation bar with the resume name', () => {
        const { container } = render(<App />);

        const navbar = container.querySelector('nav');
        expect(navbar).toBeInTheDocument();
        expect(navbar).toHaveClass('sticky', 'top-0');
        expect(navbar).toHaveTextContent(resume.introduction.name);
    });

    it('renders full-width main landmark', () => {
        const { container } = render(<App />);

        const main = container.querySelector('main');
        expect(main).toBeInTheDocument();
        expect(main).toHaveClass('w-full');
    });

    it('applies base layout and dark mode classes to root wrapper', () => {
        const { container } = render(<App />);

        const rootDiv = container.firstChild as HTMLElement;
        expect(rootDiv).toHaveClass(
            'bg-gray-50',
            'dark:bg-gray-900',
            'text-gray-900',
            'dark:text-gray-100',
            'min-h-screen'
        );
    });

    it('passes resume.json data to all components correctly', () => {
        render(<App />);

        expect(screen.getByRole('heading', { level: 1, name: resume.introduction.name })).toBeInTheDocument();
        expect(screen.getByText(resume.workExperience[0].company)).toBeInTheDocument();
        expect(screen.getByText(resume.education[0].institution)).toBeInTheDocument();
        expect(screen.getByText(resume.skills[0].skills[0])).toBeInTheDocument();
        expect(screen.getByText(resume.projects[0].title)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
            'href',
            `mailto:${resume.contact.email}`
        );
    });
});
