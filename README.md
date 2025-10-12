# ProWeb Studio - npm Workspaces Monorepo

This project uses npm workspaces for a clean developer experience with a single entry point for commands.

## Quick Start

```bash
# Clone and install (everything from root)
git clone <repository>
cd ProWeb-Studio-V1
npm install

# Copy environment file
cp ops/.env.example site/.env.local

# Start development
npm run dev
```

## Project Structure

```
├── package.json          # Root workspace configuration
├── package-lock.json     # Single lockfile for all workspaces
├── site/                 # Main Next.js application workspace
│   ├── package.json      # Site-specific dependencies
│   ├── src/              # Application source code
│   └── ...
├── docs/                 # Documentation
├── ops/                  # Operations and deployment
└── scripts/              # Utility scripts
```

## Available Commands

All commands run from the root directory and proxy to the appropriate workspace:

### Development
```bash
npm run dev                 # Start development server
npm run build               # Production build  
npm run build:prod          # Production build with validations
npm run start               # Start production server
```

### Code Quality
```bash
npm run lint                # Lint code
npm run lint:fix            # Fix linting issues automatically
npm run typecheck           # TypeScript type checking
npm run format              # Format code with Prettier
npm run format:check        # Check code formatting
npm test                    # Run unit tests
npm run test:e2e            # Run end-to-end tests
```

### Analysis & CI
```bash
npm run analyze             # Bundle analysis
npm run build:analyze       # Build with bundle analysis
npm run ci:quality-check    # Complete quality gate pipeline
npm run ci:build            # Complete CI build pipeline
```

## Workspace Benefits

- **Single lockfile**: Deterministic installs with one `package-lock.json`
- **Unified commands**: Run everything from root with consistent interface
- **Dependency management**: Shared dependencies hoisted to root when possible
- **Clean structure**: Clear separation between root config and application code

## Deployment

This project is configured for Vercel deployment with workspace support:

- **Build Command**: `npm run build:prod --workspace=site`
- **Install Command**: `npm install` (workspace-aware)
- **Output Directory**: `site/.next`

See [docs/DEPLOY.md](docs/DEPLOY.md) for complete deployment instructions.

## Development Workflow

1. **Clone and setup**: `npm install` (installs all workspace dependencies)
2. **Development**: `npm run dev` (starts development server)
3. **Quality checks**: `npm run ci:quality-check` (lint, typecheck, test, format)
4. **Build**: `npm run build:prod` (production build with validations)
5. **Deploy**: Push to main branch (Vercel auto-deploys)

## Direct Workspace Commands

If needed, you can run commands directly in a workspace:

```bash
# Run command in specific workspace
npm run <command> --workspace=site
# or
npm run <command> -w site

# Work directly in workspace directory
cd site
npm run <command>
```

## Migration from Previous Setup

The workspace migration:
- ✅ Consolidated duplicate dependencies
- ✅ Created single lockfile at root
- ✅ Added proxy scripts for all common commands
- ✅ Updated documentation and deployment configs
- ✅ Maintained all existing functionality

Contributors can now use a single entry point for all commands while maintaining the same development experience.