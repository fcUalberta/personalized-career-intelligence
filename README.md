# Career Compass — Personalized Career Intelligence Dashboard

> Real-time job matching, skill gap analysis, compensation benchmarking, and market positioning — all in one place.

![Career Compass Dashboard](https://img.shields.io/badge/status-live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Stack](https://img.shields.io/badge/stack-React%20%2B%20Node%20%2B%20PostgreSQL-informational)

---

## Overview

Career Compass is a full-stack job intelligence dashboard for active job seekers. It pulls live job listings from Adzuna, scores them against your profile and target roles, benchmarks your compensation against market data, and surfaces skill gaps — all updated continuously.

![Demo Video](https://drive.google.com/file/d/1vXLLDtQlTPcuK71YR9qaggEDOTqzUjAd/view?usp=sharing) 
![Project Overview](https://docs.google.com/document/d/12x6JZzHu1BFfzfcf8mlv4sq6sUgrZ81nmchoHhRaVmc/edit?usp=sharing)

**Key capabilities:**

| Feature | What it does |
|---|---|
| 🎯 **Live Match Feed** | Fetches real jobs from Adzuna and scores each one against your skills, title, location, and salary floor |
| 📊 **Comp Benchmarking** | Pulls salary estimates from JSearch (via RapidAPI) and places you at a percentile band (P25–P90) |
| 🔍 **Skill Gap Analysis** | Compares skills required by your target roles against your profile and shows what's missing |
| 📡 **Market Positioning** | Aggregates match scores across all target roles to surface your strongest and weakest markets |
| 🔔 **Smart Alerts** | Surfaces unread notifications for job matches, comp changes, and trajectory signals |
| 👤 **Profile & Target Roles** | Full CRUD for your work profile, skills list, and tracked roles with location and comp floor |

---

## Tech Stack

### Frontend — `artifacts/job-dashboard`
- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** — Marrow & Loom design system (warm paper palette, Fraunces serif + Karla sans)
- **TanStack Query** for data fetching and caching
- **Wouter** for client-side routing
- **Recharts** for insights charts

### Backend — `artifacts/api-server`
- **Node.js** + **Express** + **TypeScript**
- **Drizzle ORM** + **PostgreSQL** (Replit managed DB)
- **Zod** for request validation
- Live job data from **Adzuna API** (10-minute cache)
- Salary estimates from **JSearch via RapidAPI** (24-hour per-role cache)

### Shared
- **pnpm workspaces** monorepo
- Shared DB schema package at `lib/db`

---

## Project Structure

```
/
├── artifacts/
│   ├── job-dashboard/          # React frontend
│   │   └── src/
│   │       ├── components/     # Layout, UI primitives
│   │       ├── pages/          # Dashboard, Profile, Jobs, Insights, Alerts, Target Roles
│   │       └── index.css       # Design tokens (Marrow & Loom)
│   └── api-server/             # Express REST API
│       └── src/
│           ├── lib/
│           │   ├── jobData.ts  # Adzuna fetch + match scoring
│           │   ├── salaryApi.ts# JSearch salary estimates
│           │   └── insights.ts # Skill gap + market positioning
│           └── routes/         # /api/* endpoints
└── lib/
    └── db/                     # Drizzle schema (profiles, targetRoles, alerts)
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Fetch user profile |
| `PUT` | `/api/profile` | Update profile |
| `GET` | `/api/target-roles` | List tracked roles |
| `POST` | `/api/target-roles` | Add a target role |
| `DELETE` | `/api/target-roles/:id` | Remove a target role |
| `GET` | `/api/jobs` | Live matched jobs from Adzuna |
| `GET` | `/api/insights` | Skill gaps, salary bands, market position |
| `GET` | `/api/alerts` | Unread career alerts |
| `PATCH` | `/api/alerts/:id/read` | Mark alert as read |

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL database

### 1. Clone and install

```bash
git clone https://github.com/fcUalberta/personalized-career-intelligence.git
cd personalized-career-intelligence
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the root (never commit this):

```env
# Adzuna — https://developer.adzuna.com
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key

# RapidAPI (JSearch) — https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
RAPIDAPI_KEY=your_rapidapi_key

# Session
SESSION_SECRET=a_long_random_string

# Database (Postgres connection URL)
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 3. Push the database schema

```bash
pnpm --filter @workspace/db db:push
```

### 4. Run in development

```bash
# Start the API server
pnpm --filter @workspace/api-server run dev

# Start the dashboard (in a separate terminal)
pnpm --filter @workspace/job-dashboard run dev
```

The dashboard will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

---

## Design System — Marrow & Loom

The UI uses a custom warm editorial design system:

| Token | Value | Usage |
|---|---|---|
| Paper | `#F2EAD9` | Page background |
| Card | `#FBF6EB` | Card surfaces |
| Ink | `#2A1F16` | Primary text, sidebar |
| Accent | `#E2491F` | CTA, active states, kicker labels |
| Serif | Fraunces | Display headings |
| Sans | Karla | Body, smallcaps labels, data |
| Radius | 0.875rem | Card corners |

---

## Match Scoring

Jobs are scored against your profile using a weighted algorithm:

- **Title match** (40%) — fuzzy comparison between job title and your current title / target roles
- **Skills overlap** (40%) — intersection of your skill list against the job description
- **Location match** (10%) — exact or regional match
- **Salary match** (10%) — job salary range vs. your compensation floor

Scores are shown as a percentile label (e.g. `50% MATCH`) on every job card.

> **Note:** Adzuna job descriptions are often brief, which can cap match scores at ~50% even for strong matches. Full description indexing would improve scoring accuracy.

---

## Screenshots

### Dashboard
> Live match feed, stat cards, market position snapshot, and system status — all at a glance.

![Dashboard](screenshots/dashboard.jpg)

---

### Profile
> Set your current title, skills, years of experience, location, and compensation floor to calibrate all match scoring.

![Profile](screenshots/profile.jpg)

---

### Target Roles
> Track up to N roles with location and salary floor — each one becomes a scoring vector for the job feed and insights engine.

![Target Roles](screenshots/target-roles.jpg)

---

### Live Job Feed
> Real jobs from Adzuna scored and filtered in real time. Filter by target role or minimum match threshold. Matched and gap skills shown per listing.

![Live Jobs](screenshots/jobs.jpg)

---

### Market Insights
> Per-role skill gap heatmap, compensation percentile band (P25 → P75), and predicted career trajectory based on your current profile node.

![Insights](screenshots/insights.jpg)

---

### Alerts
> Event log for job matches, comp changes, skill gap nudges, and trajectory signals — with unread indicators and one-click dismiss.

![Alerts](screenshots/alerts.jpg)

---

## License

MIT — free to use, modify, and distribute.
