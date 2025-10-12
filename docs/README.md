# Studio Anwar — Prelaunch Stage 1.1 (RECOVER UI)

Herstelde UI en inhoud op basis van originele 3D-site. Geen visuele redesign; alleen merknaam, logo's en NL-copy aangepast. Integraties: Plausible (cookieless), Cal.com embed, Brevo SMTP.

## Workspace Structure

This project uses npm workspaces for a clean developer experience with a single entry point for commands.

### Workspace Layout
- **Root**: Monorepo configuration and proxy scripts
- **site**: Main Next.js application workspace

## Snelstart (Quick Start)

**Single command setup from root:**
```bash
# Clone and setup
git clone <repository>
cd ProWeb-Studio-V1

# Copy environment file
cp ops/.env.example site/.env.local

# Install all dependencies (workspace-aware)
npm install

# Start development server
npm run dev
```

Open http://localhost:3000

## Available Commands

All commands can be run from the root directory:

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run build:prod   # Production build with validations
```

### Code Quality
```bash
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run typecheck    # TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm test             # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

### Performance & Analysis
```bash
npm run analyze         # Bundle analysis
npm run build:analyze   # Build with analysis
npm run ci:quality-check # Full quality check pipeline
npm run ci:build        # Full CI build pipeline
```

### Workspace Commands
If you need to run commands in a specific workspace:
```bash
npm run <command> --workspace=site
# or
npm run <command> -w site
```

## Privacy-first
- Plausible cookieless
- Geen cookie-banner tenzij niet-essentiële trackers worden toegevoegd

## Legal
Zie `/privacy` en `/voorwaarden`. Placeholder velden (KvK, Btw, adres) invullen bij lancering.

## Rapportage
Scripts voor Lighthouse en a11y zijn opgenomen in `reports/README.md`. Uitvoerlocaties: `reports/lighthouse/` en `reports/a11y/`.
