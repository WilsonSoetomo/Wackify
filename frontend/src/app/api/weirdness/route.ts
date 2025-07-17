import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

async function getSpotifyData(accessToken: string): Promise<WeirdnessData> {
  // Get user's top tracks
  const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!tracksResponse.ok) {
    throw new Error('Failed to fetch top tracks');
  }

  const tracksData = await tracksResponse.json();
  const tracks: Track[] = tracksData.items.map((item: any) => ({
    name: item.name,
    artist: item.artists[0].name,
    image_url: item.album.images[0]?.url,
  }));

  // Get track features for analysis
  const trackIds = tracksData.items.map((item: any) => item.id).join(',');
  const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!featuresResponse.ok) {
    throw new Error('Failed to fetch track features');
  }

  const featuresData = await featuresResponse.json();

  // Calculate weirdness score based on various factors
  let totalWeirdness = 0;
  let factorCount = 0;

  featuresData.audio_features.forEach((feature: any) => {
    if (feature) {
      // Danceability (lower = weirder)
      totalWeirdness += (1 - feature.danceability) * 20;
      factorCount++;

      // Energy (lower = weirder)
      totalWeirdness += (1 - feature.energy) * 15;
      factorCount++;

      // Valence (lower = weirder)
      totalWeirdness += (1 - feature.valence) * 15;
      factorCount++;

      // Acousticness (higher = weirder)
      totalWeirdness += feature.acousticness * 20;
      factorCount++;

      // Instrumentalness (higher = weirder)
      totalWeirdness += feature.instrumentalness * 30;
      factorCount++;
    }
  });

  const averageWeirdness = totalWeirdness / factorCount;
  const weirdnessScore = Math.round(Math.min(100, Math.max(0, averageWeirdness)));

  // Generate description and explanation
  let description = '';
  let explanation = '';

  if (weirdnessScore >= 80) {
    description = 'You are a musical unicorn!';
    explanation = 'Your taste is incredibly unique and eclectic. You probably discover artists before they become popular.';
  } else if (weirdnessScore >= 60) {
    description = 'You have quite eclectic taste!';
    explanation = 'You enjoy music that most people haven\'t heard of. You\'re not afraid to explore new genres.';
  } else if (weirdnessScore >= 40) {
    description = 'You have some unique preferences!';
    explanation = 'You mix mainstream hits with some more obscure tracks. You\'re open to new sounds.';
  } else if (weirdnessScore >= 20) {
    description = 'You prefer the familiar!';
    explanation = 'You mostly stick to popular music and well-known artists. Nothing wrong with that!';
  } else {
    description = 'You love the hits!';
    explanation = 'You enjoy mainstream music and popular artists. You know what you like!';
  }

  // Get genre analysis
  const genres: Genre[] = [];
  const genreCounts: { [key: string]: number } = {};

  for (const track of tracksData.items) {
    for (const artist of track.artists) {
      const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (artistResponse.ok) {
        const artistData = await artistResponse.json();
        for (const genre of artistData.genres) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
      }
    }
  }

  const totalTracks = tracksData.items.length;
  for (const [genre, count] of Object.entries(genreCounts)) {
    genres.push({
      name: genre,
      percentage: Math.round((count / totalTracks) * 100),
    });
  }

  // Sort genres by percentage
  genres.sort((a, b) => b.percentage - a.percentage);

  return {
    score: weirdnessScore,
    description,
    explanation,
    top_tracks: tracks.slice(0, 10),
    genres: genres.slice(0, 10),
  };
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    const weirdnessData = await getSpotifyData(accessToken);
    return NextResponse.json(weirdnessData);
  } catch (error) {
    console.error('Weirdness API error:', error);
    return NextResponse.json({ error: 'Failed to calculate weirdness score' }, { status: 500 });
  }
} 