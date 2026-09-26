# WellFit

A full-stack fitness platform built with React, TypeScript, and Supabase — workout tutorials, nutrition-tracked recipes, fitness calculators, and an AI assistant that actually stays on topic.

**[Live Demo](https://wellfit-fitness.vercel.app/)** &middot; **[Report a Bug](devansht2546@gmail.com)**

---

## Features

- **Workout Library** — 55+ exercises across 12 categories (strength, boxing, yoga, cardio, and more), each with step-by-step form instructions and video demonstrations
- **Progress Tracking** — log sets, reps, weight, or duration per exercise and watch your progress chart over time
- **Recipes** — full ingredient lists, step-by-step instructions, and complete macro breakdowns (calories, protein, carbs, fat) per serving
- **Articles** — practical, no-fluff reads on nutrition, injury prevention, and recovery
- **Fitness Calculators** — BMI and One-Rep Max (Brzycki formula), no login required
- **WellFit AI** — a custom fitness-only chatbot with daily rate limiting, built on Google's Gemini API
- **Full Authentication** — email/password and Google OAuth, with per-user data isolation enforced at the database level
- **Site-wide Search** — find any workout, article, or recipe by title
- **Personal Profile** — track your own stats (age, weight, height) privately

## Tech Stack

**Frontend**
- React 19 + TypeScript
- React Router
- Recharts (progress charts)
- react-markdown (article rendering)

**Backend**
- Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- Row Level Security on every table — not just app-level checks
- Google Gemini API (chatbot), proxied through a Supabase Edge Function so the API key never touches the client

**Hosting**
- Vercel (frontend)
- Supabase (database, auth, storage, serverless functions)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Google AI Studio](https://aistudio.google.com) API key (for the chatbot)

### Installation

```bash
git clone https://github.com/Devansh2546/WellFit-app.git
cd wellfit-app
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Never commit this file — it's already covered in `.gitignore`.

### Database Setup

Full schema, seed data, and setup order are in [`sql-bundle/`](./sql-bundle), including:
- Table definitions for workouts, categories, articles, recipes, and their relationships
- Row Level Security policies for every table
- Auto-profile-creation trigger on signup
- Chatbot rate-limiting table

See [`sql-bundle/README.md`](./sql-bundle/README.md) for the exact run order.

### Chatbot Setup

The AI assistant runs through a Supabase Edge Function to keep the Gemini API key server-side:

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_key
supabase functions deploy chatbot
```

### Run Locally

```bash
npm run dev
```

## Project Structure

```
src/
  components/     # Reusable UI (Navbar, Footer, Chatbot, LogWorkoutForm...)
  pages/          # One file per route
  context/        # AuthContext — the single source of truth for auth state
  hooks/          # useCountUp, useScrollReveal
  lib/            # Supabase client
  types/          # TypeScript interfaces matching the database schema
supabase/
  functions/      # Edge Functions (chatbot proxy)
sql-bundle/       # Full schema + seed data, in run order
```

## Security Notes

- Every table uses Row Level Security — gated content is enforced by Postgres itself, not just hidden in the UI
- The chatbot is rate-limited per user per day, tracked server-side, unbypassable from the client
- The Gemini API key lives only in Supabase's Edge Function environment, never in frontend code

## License

This project is for educational/portfolio purposes.

## Acknowledgments

Built as a learning project to explore full-stack development with Supabase, React, and TypeScript — from database design through deployment.
