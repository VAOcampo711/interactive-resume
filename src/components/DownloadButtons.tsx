import { Download, FileText } from 'lucide-react';

const linkClassName = "flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl font-medium transition-colors duration-200 shadow border border-gray-200 dark:border-gray-700";

export default function DownloadButtons() {
    return (
        <div className="text-center mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Download Resume
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
                <a href="/assets/cv/Vince_Ocampo_CV.pdf" download className={linkClassName}>
                    <FileText size={20} className="text-red-600" />
                    Download PDF
                </a>

                <a href="/assets/cv/Vince_Ocampo_CV.docx" download className={linkClassName}>
                    <Download size={20} className="text-blue-600" />
                    Download Word
                </a>
            </div>
        </div>
    );
}
