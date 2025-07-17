'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Track {
  name: string;
  artist: string;
  image_url?: string;
}

interface Genre {
  name: string;
  percentage: number;
}

interface WeirdnessData {
  score: number;
  description: string;
  explanation: string;
  top_tracks?: Track[];
  genres?: Genre[];
}

export default function WeirdnessPage() {
  const [data, setData] = useState<WeirdnessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchWeirdnessData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/weirdness`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch weirdness data');
        }

        const weirdnessData = await response.json();
        setData(weirdnessData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeirdnessData();
  }, []);

  const handleAnalyzeAgain = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/spotify-login`;
  };

  const handleLogout = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      await fetch(`${backendUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Analyzing your music taste...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center p-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const scorePercentage = (data.score / 100) * 360;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Wackify</h1>
          <p className="text-gray-200 text-xl">Your Music Weirdness Analysis</p>
        </div>

        {/* Main Content */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Your Weirdness Score</h2>
            
            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <div 
                  className="rounded-full w-full h-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(from 0deg, #1DB954 0deg, #1DB954 ${scorePercentage}deg, #374151 ${scorePercentage}deg, #374151 360deg)`
                  }}
                >
                  <div className="bg-gray-900 rounded-full w-40 h-40 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">{data.score}</div>
                      <div className="text-gray-300 text-sm">out of 100</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Description */}
            <div className="mb-8">
              <p className="text-gray-300 text-xl mb-3">{data.description}</p>
              <p className="text-gray-400">{data.explanation}</p>
            </div>
          </div>

          {/* Top Tracks */}
          {data.top_tracks && data.top_tracks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Your Top Tracks</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.top_tracks.map((track, index) => (
                  <div key={index} className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      {track.image_url && (
                        <img src={track.image_url} alt={track.name} className="w-12 h-12 rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{track.name}</p>
                        <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Genre Analysis */}
          {data.genres && data.genres.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Your Top Genres</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.genres.map((genre, index) => (
                  <div key={index} className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{genre.name}</span>
                      <span className="text-gray-400 text-sm">{genre.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button
            onClick={handleAnalyzeAgain}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 mr-4"
          >
            Analyze Again
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 