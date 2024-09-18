from flask import Flask, render_template, redirect, request, session, url_for, jsonify
from dotenv import load_dotenv
import os
import requests
from urllib.parse import urlencode
from datetime import datetime
import math

load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(148)

SPOTIFY_CLIENT_ID      = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET  = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI   = os.getenv("SPOTIFY_REDIRECT_URI")

SPOTIFY_AUTH_URL  = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_URL   = "https://api.spotify.com/v1"
SPOTIFY_SCOPES    = "user-top-read"

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login')
def login():
    scope = 'user-read-private user-read-email user-top-read playlist-read-private'

    params = {
        'client_id': SPOTIFY_CLIENT_ID,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
        'show_dialog' : True
    }
    auth_url = f'{SPOTIFY_AUTH_URL}?{urlencode(params)}'
    return redirect(auth_url)

@app.route('/callback')
def callback():
    if 'error'in request.args:
        return jsonify({'error': request.args['error']})
    
    if 'code' in request.args:
        req_body = {
            'code': request.args['code'],
            'grant_type': 'authorization_code',
            'redirect_uri': SPOTIFY_REDIRECT_URI,
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET
        }

        response = requests.post(SPOTIFY_TOKEN_URL, data = req_body)
        token_info = response.json()

        session['access_token'] = token_info['access_token']
        session['expires_at'] = datetime.now().timestamp() + 3600

        return redirect('/weirdness-score')
    
def get_artist(artist_id):
    headers = {
        'Authorization' : f"Bearer {session['access_token']}"
    }
    response = requests.get(SPOTIFY_API_URL + f'/artists/{artist_id}', headers = headers)

    if response.status_code == 200:
        artist_info = response.json()
        return artist_info
    else:
        return None

@app.route('/playlists')
def get_playlists():
    if 'access_token' not in session:
        return redirect('/login')
    
    if datetime.now().timestamp() > session['expires_at']:
        print('TOKEN EXPIRED, REFRESHING....')

        return redirect('/refresh-token')
    
    headers = {
        'Authorization' : f"Bearer {session['access_token']}"
    }

    response = requests.get(SPOTIFY_API_URL + '/me/playlists', headers = headers)
    playlists = response.json()

    return jsonify(playlists)

def get_user_top_tracks():
    headers = {
        'Authorization' : f"Bearer {session['access_token']}"
    }

    response = requests.get(SPOTIFY_API_URL + '/me/top/tracks', headers = headers)
    if response.status_code == 200:
        user_tracks = response.json()['items']
        return user_tracks
    else:
        return None

@app.route('/refresh-token')
def refresh_token():
    if 'refresh_token' not in session:
        return redirect('/login')
    
    if datetime.now().timestamp() > session['expires_at']:
        req_body = {
            'grant_type' : 'refresh_token',
            'refresh_token': session['refresh_token'],
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET
        }
        response = requests.post(SPOTIFY_TOKEN_URL, data = req_body)
        new_token_info = response.json()

        session['access_token'] = new_token_info['access_token']
        session['expires_at'] =  datetime.now().timestamp() + new_token_info['expires_in']

        return redirect('/playlists')
    
def calculate_weirdness_score():
    if 'access_token' not in session:
        return redirect('/login')
    
    if datetime.now().timestamp() > session['expires_at']:
        print('TOKEN EXPIRED, REFRESHING....')
        return redirect('/refresh-token')
    user_tracks = get_user_top_tracks()

    if not user_tracks:
        return jsonify({
            'error' : 'Could not fetch user tracks'
        }), 400
    popularity_sum = 0
    artist_uniqueness = 0
    total_tracks = len(user_tracks)

    for track in user_tracks:
        popularity_sum += track['popularity']
        artist = get_artist(track['artists'][0]['id'])

        if artist:
            artist_uniqueness += artist['followers']['total']
    
    avg_popularity = popularity_sum / total_tracks
    popularity_weirdness = 100 - avg_popularity

    # Normalize artist uniqueness (fewer followers = weirder)
    avg_artist_followers = artist_uniqueness / total_tracks

    # Assuming max possible followers for normalization (e.g., 70 million)
    max_followers = 70_000_000
    artist_uniqueness = max(0, 100 - (avg_artist_followers / max_followers * 100))

    final_weirdness = (popularity_weirdness * 0.2) + (artist_uniqueness * 0.8)

    return round(final_weirdness, 0)

@app.route('/weirdness-score')
def show_weirdness():
    if 'access_token' not in session:
        return redirect(url_for('login'))

    weirdness_score = calculate_weirdness_score()
    
    return render_template('weirdness.html', score=weirdness_score)
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
