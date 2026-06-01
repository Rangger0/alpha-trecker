# Alpha Tracker

Alpha Tracker is a premium crypto research and execution workspace for operators who track ecosystems, screen wallets, organize tools, and review airdrop rewards from one dashboard.

The product flow is intentionally simple:

1. Research
2. Tracking
3. Execution
4. Reward Review

## Features

- Landing page for the Alpha Tracker workspace positioning and workflow.
- Supabase authentication with dedicated login and register pages.
- Dashboard, overview, ecosystem, faucet, swap, AI tools, deploy tools, and reward vault surfaces.
- Wallet screening, eligibility checking, wallet analyzer, sybil detector, and project research pages.
- Feedback inbox and floating feedback widget backed by Supabase.
- Theme system with light and dark Alpha Tracker color tokens.
- Lazy-loaded routes and split vendor chunks for production performance.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI / shadcn-style components
- Supabase Auth, database, storage, migrations, and edge functions
- Vercel-ready deployment config

## Installation

```bash
npm install
```

## Environment Variables

Create a local environment file and provide the Supabase project values:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional integrations used by edge functions or service modules should be configured in Supabase function secrets or deployment environment variables as needed.

## Database Setup

Apply the migrations in `supabase/migrations` to your Supabase project. The app expects Supabase to be the source of truth for important user data, including auth, feedback, rewards, wallets, claims, faucets, and ecosystem records.

```bash
supabase db push
```

Feedback-related edge functions live in `supabase/functions`.

## Development

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

Preview the compiled output:

```bash
npm run preview
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Deployment

The repository includes `vercel.json` and is ready for Vercel deployment.

1. Connect the GitHub repository to Vercel.
2. Add the required environment variables.
3. Deploy from the main branch or a reviewed pull request.
4. Confirm Supabase migrations and edge-function secrets are applied before production use.

## Screenshots

Preview assets are available in the `preview` directory:

- `preview/dashboard.png`
- `preview/ai-tools.png`
- `preview/swap.png`
- `preview/screening.png`

## Author

Rangger

GitHub: https://github.com/Rangger0
