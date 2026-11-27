import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contact from '../components/Contact';
import type { ContactInfo } from '../types/resume';

const mockContactData: ContactInfo = {
    email: 'jane.doe@example.com',
    mobile: '+64 21 555 0100',
    linkedin: 'https://www.linkedin.com/in/jane-doe',
    github: 'https://github.com/janedoe'
};

describe('Contact Component', () => {
    it('renders contact section with correct heading', () => {
        render(<Contact data={mockContactData} />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact');
        expect(screen.getByText('Feel free to reach out via')).toBeInTheDocument();
    });

    it('renders all contact links with correct href attributes', () => {
        render(<Contact data={mockContactData} />);

        expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:jane.doe@example.com');
        expect(screen.getByRole('link', { name: 'Mobile' })).toHaveAttribute('href', 'tel:+64215550100');
        expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/jane-doe');
        expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/janedoe');
    });

    it('conditionally renders GitHub link when provided', () => {
        const dataWithoutGithub = { ...mockContactData };
        delete dataWithoutGithub.github;

        const { rerender } = render(<Contact data={dataWithoutGithub} />);

        expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();

        rerender(<Contact data={mockContactData} />);

        expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    });

    it('sets target="_blank" and rel="noopener noreferrer" on external links', () => {
        render(<Contact data={mockContactData} />);

        const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
        expect(linkedinLink).toHaveAttribute('target', '_blank');
        expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

        const githubLink = screen.getByRole('link', { name: 'GitHub' });
        expect(githubLink).toHaveAttribute('target', '_blank');
        expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add target="_blank" to mailto and tel links', () => {
        render(<Contact data={mockContactData} />);

        expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
        expect(screen.getByRole('link', { name: 'Mobile' })).not.toHaveAttribute('target');
    });

    it('applies hover effects to contact links', () => {
        render(<Contact data={mockContactData} />);

        const emailLink = screen.getByRole('link', { name: 'Email' });
        expect(emailLink).toHaveClass('hover:shadow');
    });

    it('updates external links when data changes', () => {
        const updatedData = {
            ...mockContactData,
            linkedin: 'https://www.linkedin.com/in/updated-profile'
        };

        const { rerender } = render(<Contact data={mockContactData} />);
        rerender(<Contact data={updatedData} />);

        const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
        expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/updated-profile');
        expect(linkedinLink).toHaveAttribute('target', '_blank');
        expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
