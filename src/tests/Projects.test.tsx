import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Projects from '../components/Projects';
import type { Project } from '../types/resume';

const mockProjectsData: Project[] = [
    {
        title: 'Interactive Resume',
        description: 'This website!',
        github: 'https://github.com/VAOcampo711/interactive-resume'
    },
    {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution built with React and Node.js',
        github: 'https://github.com/VAOcampo711/ecommerce-platform'
    },
    {
        title: 'Data Analysis Tool',
        description: 'Python-based tool for analyzing large datasets with visualization features'
        // No GitHub link for this project
    }
];

describe('Projects Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders projects section with correct heading', () => {
        render(<Projects data={mockProjectsData} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Projects');
    });

    it('renders all projects with their titles and descriptions', () => {
        render(<Projects data={mockProjectsData} />);

        // Check all project titles are rendered
        expect(screen.getByText('Interactive Resume')).toBeInTheDocument();
        expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
        expect(screen.getByText('Data Analysis Tool')).toBeInTheDocument();

        // Check all project descriptions are rendered
        expect(screen.getByText('This website!')).toBeInTheDocument();
        expect(screen.getByText('A full-stack e-commerce solution built with React and Node.js')).toBeInTheDocument();
        expect(screen.getByText('Python-based tool for analyzing large datasets with visualization features')).toBeInTheDocument();
    });

    it('renders GitHub links for projects that have them', () => {
        render(<Projects data={mockProjectsData} />);

        const githubLinks = screen.getAllByText('View on GitHub');
        expect(githubLinks).toHaveLength(2); // Only 2 projects have GitHub links

        // Check the first GitHub link
        expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/VAOcampo711/interactive-resume');
        expect(githubLinks[0]).toHaveAttribute('target', '_blank');
        expect(githubLinks[0]).toHaveAttribute('rel', 'noreferrer');

        // Check the second GitHub link
        expect(githubLinks[1]).toHaveAttribute('href', 'https://github.com/VAOcampo711/ecommerce-platform');
        expect(githubLinks[1]).toHaveAttribute('target', '_blank');
        expect(githubLinks[1]).toHaveAttribute('rel', 'noreferrer');
    });

    it('does not render GitHub link for projects without github property', () => {
        const projectWithoutGithub = mockProjectsData.find(p => p.title === 'Data Analysis Tool');
        render(<Projects data={[projectWithoutGithub!]} />);

        expect(screen.queryByText('View on GitHub')).not.toBeInTheDocument();
    });

    it('renders empty state when no projects provided', () => {
        render(<Projects data={[]} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Projects');
        // Should still render the section but with no project cards
        expect(screen.queryByText('View on GitHub')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes for layout and styling', () => {
        const { container } = render(<Projects data={mockProjectsData} />);

        // Check section has correct classes
        const section = container.querySelector('section');
        expect(section).toHaveClass('py-12', 'bg-gray-50', 'dark:bg-gray-800');

        // Check grid layout
        const gridContainer = container.querySelector('.grid');
        expect(gridContainer).toHaveClass('md:grid-cols-2', 'gap-6');

        // Check project cards have hover effects
        const projectCards = container.querySelectorAll('.hover\\:scale-105');
        expect(projectCards).toHaveLength(3);
    });

    it('applies hover effects and transitions to project cards', () => {
        const { container } = render(<Projects data={mockProjectsData} />);

        const projectCards = container.querySelectorAll('.transition');
        expect(projectCards).toHaveLength(3);

        projectCards.forEach(card => {
            expect(card).toHaveClass('hover:scale-105', 'transition');
        });
    });

    it('renders project titles with correct heading level and styling', () => {
        render(<Projects data={mockProjectsData} />);

        const projectTitles = screen.getAllByRole('heading', { level: 3 });
        expect(projectTitles).toHaveLength(3);

        projectTitles.forEach(title => {
            expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-800', 'dark:text-gray-200');
        });
    });

    it('renders GitHub links with hover effects', () => {
        render(<Projects data={mockProjectsData} />);

        const githubLinks = screen.getAllByText('View on GitHub');
        githubLinks.forEach(link => {
            expect(link).toHaveClass('hover:underline');
            expect(link).toHaveClass('text-blue-600', 'dark:text-blue-400');
        });
    });

    it('handles single project correctly', () => {
        const singleProject = [mockProjectsData[0]];
        render(<Projects data={singleProject} />);

        expect(screen.getByText('Interactive Resume')).toBeInTheDocument();
        expect(screen.getByText('This website!')).toBeInTheDocument();
        expect(screen.getByText('View on GitHub')).toBeInTheDocument();

        // Should not render other projects
        expect(screen.queryByText('E-commerce Platform')).not.toBeInTheDocument();
        expect(screen.queryByText('Data Analysis Tool')).not.toBeInTheDocument();
    });
});