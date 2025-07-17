# 🎵 Wackify - Music Weirdness Score

A modern web application that calculates how "weird" your music taste is based on your Spotify listening habits. Features a beautiful Next.js frontend and Flask backend.

## 🏗️ Project Structure

```
Wackify/
├── frontend/           # Next.js frontend (deploy to Vercel)
│   ├── src/app/       # Next.js app router
│   ├── vercel.json    # Vercel configuration
│   └── README.md      # Frontend documentation
├── backend/           # Flask backend (deploy to Render/Railway/Heroku)
│   ├── app.py         # Main Flask application
│   ├── requirements.txt # Python dependencies
│   ├── .env           # Environment variables
│   └── templates/     # HTML templates (legacy)
└── DEPLOYMENT_GUIDE.md # Complete deployment instructions
```

## ✨ Features

- 🎨 **Modern UI**: Beautiful gradient design with animations
- 📱 **Responsive**: Works perfectly on mobile and desktop
- ⚡ **Fast**: Built with Next.js for optimal performance
- 🔐 **Secure**: OAuth 2.0 with Spotify
- 📊 **Smart Analysis**: Calculates weirdness based on track popularity and artist uniqueness

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Spotify Developer Account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Wackify
   ```

2. **Start the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Set up environment variables**
   - Create `backend/.env` with your Spotify credentials
   - Create `frontend/.env.local` with backend URL

5. **Visit** `http://localhost:3000`

## 🎯 How It Works

1. **User clicks "Login with Spotify"** on the frontend
2. **Frontend redirects** to backend OAuth endpoint
3. **Backend handles** Spotify OAuth flow and stores session
4. **Backend redirects** back to frontend with session
5. **Frontend fetches** weirdness score from backend API
6. **Beautiful score display** with animations and insights

## 📊 Weirdness Calculation

The app calculates your weirdness score based on:

- **Track Popularity**: Less popular tracks = higher weirdness
- **Artist Uniqueness**: Artists with fewer followers = higher weirdness
- **Final Score**: Weighted combination (0-100 scale)

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Quick Deployment Summary:

1. **Backend**: Deploy to Render/Railway/Heroku
2. **Frontend**: Deploy to Vercel
3. **Spotify**: Update redirect URIs
4. **Environment**: Set production variables

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel** - Hosting

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin requests
- **Requests** - HTTP client
- **Render/Railway/Heroku** - Hosting

## 📱 Screenshots

### Login Page
Beautiful gradient design with Spotify integration

### Score Display
Animated score display with progress bar and insights

## 🔧 Environment Variables

### Backend (.env)
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-backend-url.com/callback
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own applications!

## 🆘 Support

If you encounter issues:

1. Check the [deployment guide](./DEPLOYMENT_GUIDE.md)
2. Verify environment variables are set correctly
3. Test locally before deploying
4. Check browser console and server logs

## 🎉 Credits

- **Spotify Web API** for music data
- **Next.js** for the amazing frontend framework
- **Flask** for the reliable backend
- **Tailwind CSS** for beautiful styling 