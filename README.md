# Scenius

> **Live Application**: https://scenius-seven.vercel.app/

[![Deploy to GitHub Pages](https://github.com/moxious/historynet/actions/workflows/deploy.yml/badge.svg)](https://github.com/moxious/historynet/actions/workflows/deploy.yml)

*Mapping collective genius*

An interactive visualization tool for exploring historical social networks. Scenius renders knowledge bases as force-directed graphs, allowing users to discover connections between historical figures, their works, locations, and organizations.

## About the Name

"Scenius" is a term coined by Brian Eno to describe the collective intelligence of creative communities. Unlike the myth of the "lone genius," scenius recognizes that great creative work emerges from fertile scenes—groups of people encouraging, competing with, and reacting to each other. This perfectly captures what the application visualizes: the networks of influence, collaboration, and connection between historical figures.

## Features

- **Interactive Graph Visualization**: Explore networks using a force-directed graph powered by D3.js
- **Timeline View**: See historical events chronologically with automatic lane assignment
- **Multiple Node Types**: Support for Persons, Objects, Locations, and Entities (POLE model)
- **Detailed Information Panel**: Click any node or edge to view comprehensive metadata
- **Light/Dark Theme**: Toggle between themes with URL persistence for sharing
- **Filtering**: Filter by date ranges and text matching
- **Shareable URLs**: All view and filter state is captured in URLs for easy sharing
- **Multiple Datasets**: Switch between different historical knowledge bases

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/moxious/historynet.git
   cd historynet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check for issues |
| `npm run lint:fix` | Run ESLint and automatically fix issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without making changes |

## Project Structure

```
historynet/
├── public/
│   └── datasets/           # JSON knowledge bases
│       └── ai-llm-research/
│           ├── manifest.json
│           ├── nodes.json
│           └── edges.json
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Visualization layouts (graph, timeline)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
└── .prettierrc             # Prettier configuration
```

## Dataset Format

Datasets consist of three JSON files:

- **manifest.json**: Dataset metadata (name, description, last updated)
- **nodes.json**: Array of node objects (persons, objects, locations, entities)
- **edges.json**: Array of edge objects representing relationships

See [GRAPH_SCHEMA.md](./GRAPH_SCHEMA.md) for the complete schema specification.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **D3.js** - Force-directed graph visualization
- **React Router** - URL state management (HashRouter for GitHub Pages)
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Deployment

Scenius uses dual deployment for reliability:

| Target | URL | Features |
|--------|-----|----------|
| **Vercel** (Primary) | https://scenius-seven.vercel.app/ | Full app + API endpoints |
| **GitHub Pages** (Backup) | https://moxious.github.io/historynet/ | Frontend only (no API) |

Both deployments are triggered automatically when changes are pushed to the `main` branch.

### API Endpoints

API endpoints are only available on Vercel:
- `GET /api/health` — Health check (returns `{ status: 'ok', timestamp, environment }`)

### Manual Deployment

To deploy manually:

1. Build the production bundle:

```bash
npm run build
```

2. The `dist/` folder contains the production-ready static files.

### GitHub Pages Setup

To enable GitHub Pages for your fork:

1. Go to **Settings** → **Pages** in your GitHub repository
2. Under **Build and deployment**, select **GitHub Actions** as the source
3. The workflow at `.github/workflows/deploy.yml` handles the rest

### Vercel Setup

The project is linked to Vercel for automatic deployments:
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Deploy: `vercel --prod`

### URL Structure

URLs use hash routing for cross-deployment compatibility:
- `https://scenius-seven.vercel.app/#/` - Home
- `https://scenius-seven.vercel.app/#/?dataset=ai-llm-research` - Load specific dataset
- `https://scenius-seven.vercel.app/#/?dataset=ai-llm-research&selected=person-geoffrey-hinton&type=node` - Deep link to node
- `https://scenius-seven.vercel.app/#/?theme=dark` - Dark mode
- `https://scenius-seven.vercel.app/#/?dataset=ai-llm-research&theme=dark` - Dataset with dark mode

## Documentation

- [PRD.md](./PRD.md) - Product Requirements Document
- [GRAPH_SCHEMA.md](./GRAPH_SCHEMA.md) - Node and edge schema specification
- [ROADMAP.md](./ROADMAP.md) - Implementation roadmap
- [PROGRESS.md](./PROGRESS.md) - Task tracking
- [AGENTS.md](./AGENTS.md) - Agent collaboration guidelines

## Contributing

See [AGENTS.md](./AGENTS.md) for guidelines on contributing to this project.

## License

MIT
