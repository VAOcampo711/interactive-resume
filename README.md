# Interactive Resume

A modern, responsive resume website built with React, TypeScript, and Tailwind CSS. Features a clean, professional design with smooth navigation and mobile-friendly layout.

## Features

- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Modern UI** - Clean, professional design with dark mode support
- **Smooth Navigation** - Sticky navbar with smooth scrolling to sections
- **Mobile-Friendly** - Hamburger menu and touch-optimized interactions
- **Fast Performance** - Built with Vite for lightning-fast development and builds
- **Type Safe** - Full TypeScript support for better development experience
- **Accessible** - Semantic HTML and proper ARIA labels

## Live Demo

[View Live Resume](https://interactive-resume-jade.vercel.app/)

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## Project Structure

```
src/
├── components/          # React components
│   ├── Contact.tsx     # Contact information section
│   ├── DownloadButtons.tsx # Resume download functionality
│   ├── Education.tsx   # Education section
│   ├── Introduction.tsx # Hero/intro section
│   ├── Navbar.tsx      # Navigation bar
│   ├── Projects.tsx    # Projects showcase
│   ├── Skills.tsx      # Technical skills
│   └── WorkExperience.tsx # Work history
├── data/
│   └── resume.json     # Resume data
├── tests/              # Test files
├── types/
│   └── resume.ts       # TypeScript type definitions
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

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

### Customize Styling

- **Colors**: Modify Tailwind classes in components
- **Layout**: Adjust spacing and sizing with Tailwind utilities
- **Typography**: Update text sizes and fonts in components

### Add Resume Files

Place your resume files in `public/assets/cv/`:

Update filenames in `src/components/DownloadButtons.tsx` if needed.

## Testing

Run the test suite:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test

# Run tests once
npm run test:run
```

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

## Mobile Features

- **Hamburger Menu**: Collapsible navigation on mobile devices
- **Touch Optimization**: Proper touch targets and interactions
- **Responsive Typography**: Scales appropriately across screen sizes
- **Mobile-First Layout**: Optimized layout for small screens

## Design Features

- **Dark Mode Support**: Automatic dark/light theme switching
- **Smooth Animations**: CSS transitions and hover effects
- **Professional Layout**: Clean, modern design suitable for job applications
- **Print Friendly**: Optimized for printing (if needed)

## Author

**Vince Ocampo**
- Email: andrei.ocampo711@gmail.com
- LinkedIn: [linkedin.com/in/vince-ocampo-1050a41a5](https://www.linkedin.com/in/vince-ocampo-1050a41a5)
- GitHub: [github.com/VAOcampo711](https://github.com/VAOcampo711)
