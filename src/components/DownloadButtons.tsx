import { Download, FileText } from 'lucide-react';

export default function DownloadButtons() {
    const handleDownload = (fileType: 'pdf' | 'docx') => {
        const fileName = fileType === 'pdf' ? 'Vince_Ocampo_CV.pdf' : 'Vince_Ocampo_CV.docx';
        const filePath = `/assets/cv/${fileName}`;

        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="text-center mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Download Resume
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
                <button
                    onClick={() => handleDownload('pdf')}
                    className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl font-medium transition-colors duration-200 shadow border border-gray-200 dark:border-gray-700"
                >
                    <FileText size={20} className="text-red-600" />
                    Download PDF
                </button>

                <button
                    onClick={() => handleDownload('docx')}
                    className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl font-medium transition-colors duration-200 shadow border border-gray-200 dark:border-gray-700"
                >
                    <Download size={20} className="text-blue-600" />
                    Download Word
                </button>
            </div>
        </div>
    );
}