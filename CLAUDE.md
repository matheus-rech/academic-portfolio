# Dr. Matheus Machado Rech - AI-Powered Academic Portfolio

## Project Overview

An interactive academic portfolio/CV for Dr. Matheus Machado Rech featuring:
- AI-powered chat assistant (Gemini API) for visitors to ask questions
- Interactive publication management with filtering
- Certificate upload and verification system
- Harvard-compliant CV export (HTML/PDF)
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS (via CDN)
- **AI:** Google Gemini API (`@google/genai`)
- **Deployment:** GitHub Pages via GitHub Actions

## Quick Start

```bash
# Install dependencies
npm install

# Create .env.local with API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build
```

## Deployment

- **Repository:** https://github.com/matheus-rech/academic-portfolio
- **Live Site:** https://matheus-rech.github.io/academic-portfolio/
- **Branch:** `meta` (triggers auto-deploy)
- **GitHub Secret:** `GEMINI_API_KEY` (required for AI chat)

### Deploy Changes
```bash
git add . && git commit -m "description" && git push origin meta
```

## Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Main application component with all sections |
| `index.html` | Entry point + print/export CSS styles |
| `vite.config.ts` | Build config, base URL, API key injection |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow |
| `public/certificates/` | Upload certificates here for reliable URLs |

## Features & Implementation Details

### CV Export
- Export button generates clean standalone HTML
- Removes interactive elements (buttons, icons, chat)
- Harvard-compliant formatting (Times New Roman, 1in margins, left-aligned header)
- Hidden elements in print: `.pub-type-tag`, impact statements, featured badges

### AI Chat Assistant
- Uses Gemini API for conversational responses
- API key injected at build time via `process.env.GEMINI_API_KEY`
- Chat appears as floating button in bottom-right corner

### Certificate System
- Upload button visible in "DOSSIER VIEW" mode
- Certificates stored in `public/certificates/` folder
- Accessible via: `https://matheus-rech.github.io/academic-portfolio/certificates/filename.pdf`

### Publication Management
- Publications can be marked as "Featured" (star button)
- Type tags `[Peer-Reviewed]`, `[Accepted]` wrapped in `.pub-type-tag` class
- Impact statements hidden in export view

## CSS Classes for Styling Control

- `.cv-container` - Main CV wrapper
- `.sidebar-panel` - Right sidebar (hidden in export)
- `.chat-assistant` - AI chat component (hidden in export)
- `.pub-type-tag` - Publication type badges (hidden in export)
- `body.print-mode` - Applied during export for formal styling

## Pending Improvements / Ideas

- [ ] Add more certificates to `public/certificates/`
- [ ] Consider backend proxy for API key security
- [ ] Add print-specific page breaks for long CVs
- [ ] Implement certificate verification links in CV
- [ ] Add analytics to track portfolio visits
- [ ] Consider adding a blog/news section
- [ ] Mobile responsiveness refinements

## Environment Variables

| Variable | Purpose | Where Used |
|----------|---------|------------|
| `GEMINI_API_KEY` | Google Gemini API key | `.env.local` (local), GitHub Secret (prod) |

## Troubleshooting

### AI Chat not working on deployed site
1. Check GitHub Secret `GEMINI_API_KEY` exists
2. Re-run deployment workflow
3. Check browser console for errors

### Export looks wrong
1. Ensure `.cv-container` class is on CV wrapper
2. Check `index.html` print styles
3. Test with browser print preview (Cmd+P)

### Deployment failing
1. Check Actions tab for error logs
2. Verify `enablement: true` in configure-pages step
3. Ensure Pages is set to "GitHub Actions" source
