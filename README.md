# Wackify

A modern music weirdness analyzer that connects to Spotify to analyze your music taste and calculate a "weirdness" score.

## Features

- **Spotify Integration**: Connect your Spotify account to analyze your listening history
- **Weirdness Score**: Get a personalized score based on your music taste
- **Modern UI**: Beautiful, responsive design with glass morphism effects
- **Real-time Analysis**: Instant results with detailed breakdowns
- **Genre Analysis**: See your top genres and their percentages
- **Top Tracks**: View your most listened tracks

## Project Structure

```
Wackify/
├── backend/          # Flask API server
│   ├── app.py       # Main Flask application
│   ├── requirements.txt
│   └── templates/   # HTML templates
├── frontend/        # Next.js frontend
│   ├── src/
│   ├── package.json
│   └── vercel.json
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with your Spotify credentials:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
SECRET_KEY=your_secret_key
```

5. Run the backend server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Click "Login with Spotify" to connect your account
3. Authorize the application to access your Spotify data
4. View your personalized weirdness score and analysis

## Deployment

### Backend Deployment

The backend can be deployed to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

Make sure to set the environment variables on your deployment platform.

### Frontend Deployment

The frontend is configured for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the `NEXT_PUBLIC_BACKEND_URL` environment variable to your deployed backend URL
4. Deploy

## Tech Stack

### Backend
- Flask
- Spotify Web API
- Python 3.8+

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Vercel (deployment)

## Environment Variables

### Backend (.env)
- `SPOTIFY_CLIENT_ID`: Your Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Your Spotify app client secret
- `SPOTIFY_REDIRECT_URI`: OAuth redirect URI
- `SECRET_KEY`: Flask secret key

### Frontend (.env.local)
- `NEXT_PUBLIC_BACKEND_URL`: URL of your deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License 