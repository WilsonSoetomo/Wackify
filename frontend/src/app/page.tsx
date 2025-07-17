'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSpotifyLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to our API route for Spotify login
      window.location.href = '/api/spotify-login';
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center p-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Wackify</h1>
          <p className="text-gray-200 text-xl">Discover your music weirdness</p>
        </div>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 mb-6 text-lg">
              Connect your Spotify account to analyze your music taste and get your weirdness score
            </p>
          </div>
          
          <button
            onClick={handleSpotifyLogin}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-semibold py-4 px-6 rounded-xl w-full flex items-center justify-center space-x-3 transition duration-300 transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            )}
            <span>{isLoading ? 'Connecting...' : 'Login with Spotify'}</span>
          </button>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              We'll analyze your listening history to calculate your weirdness score
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 