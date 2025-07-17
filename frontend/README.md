# Wackify Frontend

A modern Next.js frontend for the Wackify music weirdness analyzer.

## Features

- Modern UI with Tailwind CSS
- Spotify OAuth integration
- Real-time music analysis
- Responsive design
- Glass morphism effects

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This frontend is configured for deployment on Vercel. The backend should be deployed separately and the `NEXT_PUBLIC_BACKEND_URL` environment variable should be updated accordingly.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Vercel (deployment) 