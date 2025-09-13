import resume from "./data/resume.json";
import type { Resume } from "./types/resume";

import Navbar from "./components/Navbar";
import Introduction from "./components/Introduction";
import WorkExperience from "./components/WorkExperience";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

import "./index.css";

function App() {
    const data = resume as Resume;
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <Navbar />
            <main className="w-full max-w-5xl mx-auto px-6">
                <Introduction data={data.introduction} />
                <WorkExperience data={data.workExperience} />
                <Education data={data.education} />
                <Skills data={data.skills} />
                <Projects data={data.projects} />
                <Contact data={data.contact} />
            </main>
        </div>
    );
}
export default App;
