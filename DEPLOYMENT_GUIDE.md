# Wackify Deployment Guide

This guide will walk you through deploying your Wackify application to Vercel (frontend) and a backend hosting service.

## 🏗️ Architecture Overview

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: Flask API deployed on Render/Railway/Heroku
- **Database**: Session-based (no database needed)

## 📋 Prerequisites

1. **GitHub Account**: For code hosting
2. **Vercel Account**: For frontend deployment
3. **Backend Hosting**: Render, Railway, or Heroku
4. **Spotify Developer Account**: For API credentials

## 🚀 Step 1: Deploy Backend

### Option A: Render (Recommended - Free)

1. **Sign up** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `wackify-backend`
   - **Environment**: `Python 3`
   - **Root Directory**: `backend` (important!)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free

5. **Add Environment Variables**:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=https://your-backend-url.onrender.com/callback
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. **Deploy** and note your backend URL (e.g., `https://wackify-backend.onrender.com`)

### Option B: Railway

1. **Sign up** at [railway.app](https://railway.app)
2. **Create a new project**
3. **Deploy from GitHub**
4. **Add environment variables** (same as above)
5. **Deploy** and note your backend URL

### Option C: Heroku

1. **Sign up** at [heroku.com](https://heroku.com)
2. **Create a new app**
3. **Connect to GitHub**
4. **Add environment variables** (same as above)
5. **Deploy** and note your backend URL

## 🎨 Step 2: Deploy Frontend to Vercel

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import your GitHub repository**
3. **Configure the project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy** and note your frontend URL (e.g., `https://wackify-frontend.vercel.app`)

## 🔧 Step 3: Update Spotify App Settings

1. **Go to** [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Select your app**
3. **Go to Settings**
4. **Add Redirect URIs**:
   ```
   https://your-backend-url.onrender.com/callback
   http://localhost:5001/callback (for local development)
   ```

## 🔄 Step 4: Update Environment Variables

### Backend Environment Variables
Update your backend environment variables with the new URLs:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-backend-url.onrender.com/callback
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables
Update your Vercel environment variables:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
```

## 🧪 Step 5: Test Your Deployment

1. **Visit your frontend URL**
2. **Click "Login with Spotify"**
3. **Complete the OAuth flow**
4. **Verify the weirdness score displays correctly**

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your backend CORS settings include your frontend URL
   - Check that `supports_credentials=True` is set

2. **Session Issues**:
   - Backend sessions may not persist on some hosting platforms
   - Consider using Redis for session storage in production

3. **Environment Variables**:
   - Double-check all URLs are correct
   - Ensure no trailing slashes in URLs

4. **Spotify Redirect URI**:
   - Must exactly match what's in your Spotify app settings
   - Case-sensitive

### Debug Steps

1. **Check browser console** for frontend errors
2. **Check backend logs** for server errors
3. **Verify environment variables** are set correctly
4. **Test OAuth flow** step by step

## 📱 Custom Domain (Optional)

### Frontend (Vercel)
1. **Add custom domain** in Vercel dashboard
2. **Update DNS records** as instructed
3. **Update environment variables** with new domain

### Backend
1. **Add custom domain** to your hosting platform
2. **Update Spotify redirect URI**
3. **Update frontend environment variables**

## 🔒 Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Only allow necessary origins
4. **Rate Limiting**: Consider adding rate limiting to your API

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics for frontend
- Monitor performance and errors

### Backend Monitoring
- Use your hosting platform's monitoring tools
- Set up error alerts

## 🚀 Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Spotify app configured with correct redirect URIs
- [ ] Environment variables set correctly
- [ ] OAuth flow working end-to-end
- [ ] Weirdness score calculation working
- [ ] Error handling implemented
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up (optional)

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Review your hosting platform's logs**
3. **Verify all environment variables** are set correctly
4. **Test locally** first to isolate issues

## 📈 Next Steps

Once deployed, consider:

1. **Adding analytics** (Google Analytics, Vercel Analytics)
2. **Implementing caching** for better performance
3. **Adding more features** (user accounts, score history)
4. **Optimizing for mobile** devices
5. **Adding social sharing** features 