# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Dev server on http://localhost:3000
npm run build          # Production build
npm test               # Run tests (interactive watch mode)
npm run build-production  # Build + regenerate sitemap
npm run generate-sitemap  # Regenerate public/sitemap.xml only
npm run analyze-bundle    # Visualize bundle after build
```

## Architecture

Single-page React portfolio for Kaci Hamroun. All content is loaded dynamically from a backend API — there is no static content for the portfolio data in this repo.

**Routing** (`src/routes/RouteIndex.js`): Only two real routes exist — `/` (Home) and `/politique-confidentialite` (PrivacyPolicy). All other paths redirect to `/`. Pages are lazy-loaded via `React.lazy` + `Suspense`.

**Data flow**: `Home.js` fetches everything via `getUserData()` → `GET /api/kaci`. The response shape is `{ portfolios: [{ firstName, lastName, bio, skills, projects, jobs, profilePic, resumePdf, linkedinUrl, githubUrl, scheduleUrl }] }`. The contact form posts to `POST /api/contacts`.

**API layer** (`src/api/`):
- `axiosInstance.js` — configured axios with 10s timeout, automatic retry on network errors (3 attempts, exponential backoff: 2s/4s/8s), and HTTP status error mapping.
- `apiCalls.js` — `getUserData()`, `sendContactForm()`, and a `withLoading()` wrapper.
- `src/config/apiConfig.js` — exports `API_BASE_URL` from env vars `REACT_APP_API_BASE_URL` or `REACT_APP_SERVER_PROD`.

**Environment variables** (`.env`):
- `REACT_APP_API_BASE_URL` — primary API base URL
- `REACT_APP_SERVER_PROD` — fallback API base URL

**Key components**:
- `SEO.js` — headless component that imperatively updates `document.title`, meta tags, Open Graph, Twitter Card, and JSON-LD on mount/update.
- `ImageComponent.js` — wrapper around `<img>` with IntersectionObserver-based lazy loading, fallback image support, and load-state fade-in.
- `Navbar.js` — fixed nav with scroll-based transparency, smooth-scroll to section refs passed from `Home.js`.
- `CookieConsent.js` — wraps the entire app; manages cookie banner state.

**Custom hooks** (`src/hooks/`):
- `useMultipleLoading` — manages named loading states (keyed by string, e.g. `'userData'`, `'contactForm'`). Used in `Home.js` to track independent async operations.
- `useNetworkStatus` — online/offline detection via `navigator.onLine` and window events.

**Image helpers** (`src/utils/imageHelpers.js`):
- `getImageUrl(apiUrl, path)` — returns Cloudinary URLs as-is; prepends `apiUrl` for relative paths.
- `getOptimizedImageUrl(apiUrl, path, { width, height, quality })` — same but appends query params for resizing.
- `getSkillFallbackImage(name)` — returns inline SVG data URIs for common tech skills.

**Styling**: Tailwind CSS v3. Custom utility classes (`gradient-text`, `glow-accent`, `dot-pattern`, `shadow-card`, etc.) are defined in `App.css`. CSS custom properties define the design tokens (`--accent`, `--foreground`, `--background`, `--border`, etc.).

**Third-party integrations**:
- **Cal.com** (`@calcom/embed-react`) — embedded calendar in the Contact section with namespace `"30min"`.
- **ElevenLabs** (`<elevenlabs-convai>`) — AI voice widget, deferred until page is ready (rendered after `isReady` state is set).

**SEO / Production**:
- `scripts/generateSitemap.js` — generates `public/sitemap.xml` and `public/structured-data.json`.
- `public/_redirects` and `public/.htaccess` — SPA fallback rules for Netlify/Apache.
- `src/config/seoConfig.js` — centralized SEO configuration.
- Canonical URL is always `https://www.kacihamroun.com`.
