import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import DownloadButtons from '../components/DownloadButtons';

describe('DownloadButtons Component', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    /**
     * Call AFTER render(). Returns a real <a> element whose .click() is
     * spied on, and whose creation will be intercepted by the mock.
     */
    function mockAnchorCreation(): HTMLAnchorElement {
        const original = document.createElement.bind(document);
        const link = original('a') as HTMLAnchorElement;
        vi.spyOn(link, 'click').mockImplementation(() => {});
        vi.spyOn(document, 'createElement').mockImplementation((tag: string) =>
            tag === 'a' ? link : original(tag)
        );
        return link;
    }

    // Test Case 1: Component renders with correct heading and buttons
    it('renders download section with correct heading and buttons', () => {
        render(<DownloadButtons />);

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Download Resume');
        expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /download word/i })).toBeInTheDocument();
    });

    // Test Case 2: PDF download button functionality
    it('triggers PDF download when PDF button is clicked', () => {
        render(<DownloadButtons />);
        const link = mockAnchorCreation();

        fireEvent.click(screen.getByRole('button', { name: /download pdf/i }));

        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(link.href).toContain('Vince_Ocampo_CV.pdf');
        expect(link.download).toBe('Vince_Ocampo_CV.pdf');
    });

    // Test Case 3: Word download button functionality
    it('triggers Word download when Word button is clicked', () => {
        render(<DownloadButtons />);
        const link = mockAnchorCreation();

        fireEvent.click(screen.getByRole('button', { name: /download word/i }));

        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(link.href).toContain('Vince_Ocampo_CV.docx');
        expect(link.download).toBe('Vince_Ocampo_CV.docx');
    });

    // Test Case 4: Temporary link element lifecycle
    it('properly manages temporary download link lifecycle', () => {
        render(<DownloadButtons />);
        const link = mockAnchorCreation();

        // Spy on body methods after render so RTL's own calls are not captured
        const appendSpy = vi.spyOn(document.body, 'appendChild');
        const removeSpy = vi.spyOn(document.body, 'removeChild');

        fireEvent.click(screen.getByRole('button', { name: /download pdf/i }));

        expect(appendSpy).toHaveBeenCalledWith(link);
        expect(link.click).toHaveBeenCalledTimes(1);
        expect(removeSpy).toHaveBeenCalledWith(link);
    });

    // Test Case 5: Button styling and icons
    it('displays correct icons and styling for each button', () => {
        const { container } = render(<DownloadButtons />);

        const pdfButton = screen.getByRole('button', { name: /download pdf/i });
        const wordButton = screen.getByRole('button', { name: /download word/i });

        expect(pdfButton.querySelector('svg')).toBeInTheDocument();
        expect(wordButton.querySelector('svg')).toBeInTheDocument();

        expect(container.querySelector('.text-red-600')).toBeInTheDocument();
        expect(container.querySelector('.text-blue-600')).toBeInTheDocument();
    });

    // Test Case 6: Responsive layout
    it('applies responsive layout classes correctly', () => {
        const { container } = render(<DownloadButtons />);

        const buttonContainer = container.querySelector('.flex');
        expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
    });

    // Test Case 7: Hover effects
    it('applies hover effects to buttons', () => {
        render(<DownloadButtons />);

        const pdfButton = screen.getByRole('button', { name: /download pdf/i });
        const wordButton = screen.getByRole('button', { name: /download word/i });

        expect(pdfButton).toHaveClass('hover:bg-gray-50');
        expect(pdfButton).toHaveClass('transition-colors');
        expect(wordButton).toHaveClass('hover:bg-gray-50');
        expect(wordButton).toHaveClass('transition-colors');
    });

    // Test Case 8: Dark mode support
    it('includes dark mode styling classes', () => {
        render(<DownloadButtons />);

        const pdfButton = screen.getByRole('button', { name: /download pdf/i });
        const wordButton = screen.getByRole('button', { name: /download word/i });

        expect(pdfButton).toHaveClass('dark:bg-gray-900');
        expect(pdfButton).toHaveClass('dark:hover:bg-gray-800');
        expect(pdfButton).toHaveClass('dark:text-gray-200');
        expect(pdfButton).toHaveClass('dark:border-gray-700');

        expect(wordButton).toHaveClass('dark:bg-gray-900');
        expect(wordButton).toHaveClass('dark:hover:bg-gray-800');
        expect(wordButton).toHaveClass('dark:text-gray-200');
        expect(wordButton).toHaveClass('dark:border-gray-700');
    });
});