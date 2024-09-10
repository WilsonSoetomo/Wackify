from flask import Flask, render_template, redirect, request, session, url_for, jsonify
from dotenv import load_dotenv
import os
import requests
from urllib.parse import urlencode

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
    return "Welcome! Let's see how weird your music is <a href='/login'>Login with Spotify</a>"

@app.route('login')
def login():
    scope = 'user-read-private user-read-email'

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
        req_budy ={
            'code': request.args['code'],
            'grant_type': 'authorization_code',
            'redirect_uri': SPOTIFY_REDIRECT_URI,
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET
        }

        response = requests.post()