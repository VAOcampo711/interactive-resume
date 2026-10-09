# Interactive Resume

A modern, responsive resume website built with React, TypeScript, and Tailwind CSS. Features a clean, professional design with smooth navigation and mobile-friendly layout.

## Features

- **Responsive Design** - Mobile-first layout that scales across mobile, tablet, and desktop
- **Dark Mode** - Follows your system's light/dark setting
- **Smooth Navigation** - Sticky navbar with smooth scrolling and highlighting of the section you're viewing
- **Mobile Menu** - Hamburger menu that closes when you pick a section or tap outside it
- **Downloadable CV** - PDF and Word versions available from the Contact section
- **Data-Driven** - All content lives in a single JSON file, type-checked at build time
- **Fast Performance** - Built with Vite for fast development and builds
- **Accessible** - Semantic sections and headings, plus a labelled menu toggle

## Live Demo

[View Live Resume](https://interactive-resume-jade.vercel.app/)

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint
- **CI**: GitHub Actions, Dependabot
- **Deployment**: Vercel

## Project Structure

```
.github/
├── workflows/cicd.yml  # PR checks: lint, tests + coverage, audit, build
└── dependabot.yml      # Weekly dependency update PRs
public/
└── assets/cv/          # Downloadable CV files (PDF and Word)
src/
├── components/          # React components
│   ├── Contact.tsx     # Contact information section
│   ├── DownloadButtons.tsx # CV download links
│   ├── Education.tsx   # Education section
│   ├── Introduction.tsx # Hero/intro section
│   ├── Navbar.tsx      # Navigation bar
│   ├── Projects.tsx    # Projects showcase
│   ├── Skills.tsx      # Technical skills
│   └── WorkExperience.tsx # Work history
├── data/
│   └── resume.json     # Resume data
├── tests/              # Component tests + resume.json content checks
├── types/
│   └── resume.ts       # TypeScript type definitions
├── App.tsx            # Main app component
├── index.css          # Tailwind import and global base styles
├── main.tsx           # App entry point
└── setupTests.ts      # Test setup (jest-dom matchers)
```

## Getting Started

### Prerequisites

- Node.js 22.13 or later (the major version is pinned in `.nvmrc`, so `nvm use` picks it up)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VAOcampo711/interactive-resume.git
   cd interactive-resume
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
    - Navigate to `http://localhost:5173`

## Scripts

| Command                 | Description                                         |
|-------------------------|-----------------------------------------------------|
| `npm run dev`           | Start the dev server                                |
| `npm run build`         | Type-check (including `resume.json`) and build      |
| `npm run preview`       | Serve the production build locally                  |
| `npm run lint`          | Run ESLint                                          |
| `npm run test`          | Run tests in watch mode                             |
| `npm run test:run`      | Run tests once                                      |
| `npm run test:coverage` | Run tests once with a coverage report               |

## Customization

### Update Resume Content

Edit the `src/data/resume.json` file to customize with your information:

```json
{
  "introduction": {
    "name": "Your Name",
    "tagline": "Your professional tagline"
  },
  "workExperience": [
    {
      "company": "Company Name",
      "role": "Your Role",
      "period": "Start Date – End Date",
      "details": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Title",
      "year": "Year"
    }
  ],
  "skills": [
    {
      "category": "Category Name",
      "skills": ["Skill 1", "Skill 2"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "github": "https://github.com/username/repo"
    }
  ],
  "contact": {
    "email": "your.email@example.com",
    "mobile": "your-phone-number",
    "linkedin": "your-linkedin-url",
    "github": "your-github-url"
  }
}
```

A few things to know when editing it:

- **Multiple roles at one company**: leave `company` as `""` on the roles that follow. They are grouped under the company of the role above, so the first entry must have a company.
- **Education** entries are grouped by `institution` automatically.
- **`github`** is optional on projects and contact.
- **Checked automatically**:
  - `npm run build` fails if a field is misspelled, missing or the wrong type.
  - `src/tests/resumeData.test.ts` fails on blank values, invalid links or email, and duplicate entries.

### Add Resume Files

Place your CV files in `public/assets/cv/`. The download links in `src/components/DownloadButtons.tsx` point to `Vince_Ocampo_CV.pdf` and `Vince_Ocampo_CV.docx`, so update them if you rename the files. A test fails if a link points to a file that doesn't exist.

### Page Title and Link Previews

The page title, description and link-preview (Open Graph) tags are in `index.html`. Update them along with the tagline so shared links describe the current CV.

### Customize Styling

- **Colors, layout and typography**: Tailwind classes in the components
- **Global defaults** (font, base styles): `src/index.css`, inside `@layer base` so component classes always take priority

## Testing

```bash
# Watch mode
npm run test

# Run once
npm run test:run

# Run once with coverage (report also written to coverage/index.html)
npm run test:coverage
```

Coverage thresholds are set in `vite.config.ts`, and the run fails if coverage drops below them.

## Continuous Integration

Every pull request to `master` or `develop` runs [cicd.yml](.github/workflows/cicd.yml):

1. Lint (`npm run lint`)
2. Tests with coverage thresholds (`npm run test:coverage`)
3. Production dependency audit (`npm audit --omit=dev --audit-level=high`)
4. Type-check and build (`npm run build`)

Dependabot opens dependency update PRs against `develop`: npm weekly, with minor and patch updates grouped into one PR, and GitHub Actions monthly.

## Build & Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push to master

## Author

**Vince Ocampo**
- Email: vinceocampo711@icloud.com
- LinkedIn: [linkedin.com/in/vince-ocampo-1050a41a5](https://www.linkedin.com/in/vince-ocampo-1050a41a5)
- GitHub: [github.com/VAOcampo711](https://github.com/VAOcampo711)
