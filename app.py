from flask import Flask, render_template, redirect, request, session, url_for
from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json
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


def get_token():
    auth_string = SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET 
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization" : "Basic " + auth_base64,
        "Content-Type" : "application/x-www-form-urlencoded"
    }
    data = {"grant_type" : "client_credentials"}
    result = post(url, headers = headers, data = data)

    # print("Status Code: ", result.status_code)
    # print("Response Content: ", result.content.decode("utf-8"))

    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

def get_auth_header(token):
    return {"Authorization" : "Bearer " + token}

def search_for_artist(token, artist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"?q={artist_name}&type=artist&limit=1"
    query_url = url + query

    result = get(query_url, headers = headers)
    json_result = json.loads(result.content)["artists"]["items"]
    if len(json_result) == 0:
        print("No artists within this search exists")
        return None
    return json_result[0]

def get_song_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    headers = get_auth_header(token)
    result = get(url, headers = headers)
    json_result = json.loads(result.content)["tracks"]
    return json_result

@app.route("/")
def index():
    auth_query_params = {
        "response_type": "code",
        "client_id": SPOTIFY_CLIENT_ID,
        "scope" : SPOTIFY_SCOPES,
        "redirect_uri": SPOTIFY_REDIRECT_URI
    }
    url_args = urlencode(auth_query_params)
    auth_url = f"{SPOTIFY_AUTH_URL}?{url_args}"
    return render_template("index.html", auth_url = auth_url)

@app.route('/login')
def login():
    return redirect(url_for('index'))

@app.route("/callback")
def callback():
    if 'error' in request.args:
        error_message = request.args['error']
        return render_template('error.html', error_message=error_message)

    
    auth_code = request.args.get('code')
    token_data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET
    }
    token_response = post(SPOTIFY_TOKEN_URL, data = token_data)
    token_info = token_response.json()
    
    session['access_token'] = token_info.get('access_token')
    return redirect(url_for('profile'))

@app.route("/profile")
def profile():
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('index'))
    
    headers = {
        'Authorization' : f'Bearer {access_token}'
    } 
    response = get(f"{SPOTIFY_API_URL}/me/top/artists?limit=5", headers = headers)
    top_artists = response.json()
    return f"Top Artists: {json.dumps(top_artists, indent=2)}"

if __name__ == "__main__":
    app.run(debug=True)