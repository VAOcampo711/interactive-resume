import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DownloadButtons from '../components/DownloadButtons';

// Files actually present in public/assets/cv (keys are paths relative to this file)
const cvFiles = Object.keys(import.meta.glob('../../public/assets/cv/*'))
    .map(path => path.split('/').pop());

describe('DownloadButtons Component', () => {
    // Test Case 1: Component renders with correct heading and links
    it('renders download section with correct heading and links', () => {
        render(<DownloadButtons />);

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Download Resume');
        expect(screen.getByRole('link', { name: /download pdf/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /download word/i })).toBeInTheDocument();
    });

    // Test Case 2: PDF link points at the PDF and downloads it
    it('links to the PDF CV as a download', () => {
        render(<DownloadButtons />);

        const link = screen.getByRole('link', { name: /download pdf/i });
        expect(link).toHaveAttribute('href', '/assets/cv/Vince_Ocampo_CV.pdf');
        expect(link).toHaveAttribute('download');
    });

    // Test Case 3: Word link points at the docx and downloads it
    it('links to the Word CV as a download', () => {
        render(<DownloadButtons />);

        const link = screen.getByRole('link', { name: /download word/i });
        expect(link).toHaveAttribute('href', '/assets/cv/Vince_Ocampo_CV.docx');
        expect(link).toHaveAttribute('download');
    });

    // Test Case 4: Every download link points at a file that exists in public/assets/cv
    it('only links to CV files that exist in public/assets/cv', () => {
        render(<DownloadButtons />);

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2);
        links.forEach(link => {
            const href = link.getAttribute('href')!;
            expect(href.startsWith('/assets/cv/')).toBe(true);
            expect(cvFiles).toContain(href.split('/').pop());
        });
    });

    // Test Case 5: Link styling and icons
    it('displays correct icons and styling for each link', () => {
        const { container } = render(<DownloadButtons />);

        const pdfLink = screen.getByRole('link', { name: /download pdf/i });
        const wordLink = screen.getByRole('link', { name: /download word/i });

        expect(pdfLink.querySelector('svg')).toBeInTheDocument();
        expect(wordLink.querySelector('svg')).toBeInTheDocument();

        expect(container.querySelector('.text-red-600')).toBeInTheDocument();
        expect(container.querySelector('.text-blue-600')).toBeInTheDocument();
    });

    // Test Case 6: Responsive layout
    it('applies responsive layout classes correctly', () => {
        const { container } = render(<DownloadButtons />);

        const linkContainer = container.querySelector('.flex');
        expect(linkContainer).toHaveClass('flex-col', 'sm:flex-row');
    });

    // Test Case 7: Hover effects
    it('applies hover effects to links', () => {
        render(<DownloadButtons />);

        const pdfLink = screen.getByRole('link', { name: /download pdf/i });
        const wordLink = screen.getByRole('link', { name: /download word/i });

        expect(pdfLink).toHaveClass('hover:bg-gray-50');
        expect(pdfLink).toHaveClass('transition-colors');
        expect(wordLink).toHaveClass('hover:bg-gray-50');
        expect(wordLink).toHaveClass('transition-colors');
    });

    // Test Case 8: Dark mode support
    it('includes dark mode styling classes', () => {
        render(<DownloadButtons />);

        const pdfLink = screen.getByRole('link', { name: /download pdf/i });
        const wordLink = screen.getByRole('link', { name: /download word/i });

        expect(pdfLink).toHaveClass('dark:bg-gray-900');
        expect(pdfLink).toHaveClass('dark:hover:bg-gray-800');
        expect(pdfLink).toHaveClass('dark:text-gray-200');
        expect(pdfLink).toHaveClass('dark:border-gray-700');

        expect(wordLink).toHaveClass('dark:bg-gray-900');
        expect(wordLink).toHaveClass('dark:hover:bg-gray-800');
        expect(wordLink).toHaveClass('dark:text-gray-200');
        expect(wordLink).toHaveClass('dark:border-gray-700');
    });
});