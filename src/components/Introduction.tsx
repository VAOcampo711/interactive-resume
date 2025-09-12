import type { Introduction as Intro } from "../types/resume";

export default function Introduction({ data }: { data: Intro }) {
    return (
        <section id="introduction" className="py-20 bg-gray-50 dark:bg-gray-800 text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Hi, I’m {data.name}</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{data.tagline}</p>
        </section>
    );
}
