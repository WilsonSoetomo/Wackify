'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function WeirdnessPage() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/weirdness-score`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setScore(data.score);
        } else {
          setError('Failed to fetch weirdness score');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "You're a musical unicorn! 🦄";
    if (score >= 60) return "Pretty wacky taste you got there! 🎸";
    if (score >= 40) return "You're moderately weird! 🎵";
    if (score >= 20) return "You're somewhat mainstream! 🎤";
    return "You're pretty basic! 🎧";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-purple-500 to-pink-500";
    if (score >= 60) return "from-blue-500 to-purple-500";
    if (score >= 40) return "from-green-500 to-blue-500";
    if (score >= 20) return "from-yellow-500 to-green-500";
    return "from-gray-500 to-yellow-500";
  };

  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/logout`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Calculating your weirdness...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Wackify
          </h1>
        </div>

        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Weirdness Score</h2>
            
            {/* Score Display */}
            <div className="mb-6">
              <div className={`text-8xl font-bold bg-gradient-to-r ${getScoreColor(score || 0)} bg-clip-text text-transparent mb-2`}>
                {score}
              </div>
              <div className="text-2xl text-white font-semibold">/ 100</div>
            </div>

            {/* Score Message */}
            <p className="text-xl text-gray-300 mb-6">
              {getScoreMessage(score || 0)}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(score || 0)} transition-all duration-1000`}
                style={{ width: `${score || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Calculate Again
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Powered by Spotify Web API
          </p>
        </div>
      </div>
    </div>
  );
} 