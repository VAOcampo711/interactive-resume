import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Contact from '../components/Contact';
import type { ContactInfo } from '../types/resume';

const mockContactData: ContactInfo = {
    email: 'andrei.ocampo711@gmail.com',
    mobile: '021 026 00051',
    linkedin: 'https://www.linkedin.com/in/vince-ocampo-1050a41a5',
    github: 'https://github.com/VAOcampo711'
};

describe('Contact Component', () => {
    beforeEach(() => {
        // Reset any mocks before each test
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Clean up after each test
        vi.restoreAllMocks();
    });

    it('renders contact section with correct heading', () => {
        render(<Contact data={mockContactData} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact');
        expect(screen.getByText('Feel free to reach out via email, LinkedIn, or GitHub')).toBeInTheDocument();
    });

    it('renders all contact links with correct attributes', () => {
        render(<Contact data={mockContactData} />);

        // Check email link
        const emailLink = screen.getByRole('link', { name: 'Email' });
        expect(emailLink).toHaveAttribute('href', 'mailto:andrei.ocampo711@gmail.com');

        // Check mobile link
        const mobileLink = screen.getByRole('link', { name: 'Mobile' });
        expect(mobileLink).toHaveAttribute('href', 'tel:021 026 00051');

        // Check LinkedIn link
        const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
        expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/vince-ocampo-1050a41a5');

        // Check GitHub link
        const githubLink = screen.getByRole('link', { name: 'GitHub' });
        expect(githubLink).toHaveAttribute('href', 'https://github.com/VAOcampo711');
    });

    it('conditionally renders GitHub link when provided', () => {
        const dataWithoutGithub = { ...mockContactData };
        delete dataWithoutGithub.github;

        const { rerender } = render(<Contact data={dataWithoutGithub} />);

        // GitHub link should not be present
        expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();

        // Re-render with GitHub data
        rerender(<Contact data={mockContactData} />);

        // GitHub link should now be present
        expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    });

    it('adds target="_blank" and rel="noopener noreferrer" to external links', async () => {
        render(<Contact data={mockContactData} />);

        // Wait for useEffect to run
        await waitFor(() => {
            const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
            expect(linkedinLink).toHaveAttribute('target', '_blank');
            expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

            const githubLink = screen.getByRole('link', { name: 'GitHub' });
            expect(githubLink).toHaveAttribute('target', '_blank');
            expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });

    it('does not add target="_blank" to mailto and tel links', async () => {
        render(<Contact data={mockContactData} />);

        await waitFor(() => {
            const emailLink = screen.getByRole('link', { name: 'Email' });
            expect(emailLink).not.toHaveAttribute('target', '_blank');

            const mobileLink = screen.getByRole('link', { name: 'Mobile' });
            expect(mobileLink).not.toHaveAttribute('target', '_blank');
        });
    });

    it('applies hover effects to contact links', () => {
        render(<Contact data={mockContactData} />);

        const emailLink = screen.getByRole('link', { name: 'Email' });
        expect(emailLink).toHaveClass('hover:shadow');
    });

    it('updates external links when data changes', async () => {
        const initialData = mockContactData;
        const updatedData = {
            ...mockContactData,
            linkedin: 'https://www.linkedin.com/in/updated-profile'
        };

        const { rerender } = render(<Contact data={initialData} />);

        // Re-render with updated data
        rerender(<Contact data={updatedData} />);

        await waitFor(() => {
            const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
            expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/updated-profile');
            expect(linkedinLink).toHaveAttribute('target', '_blank');
        });
    });
});