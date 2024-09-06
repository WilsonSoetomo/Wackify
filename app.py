from flask import Flask, jsonify, redirect, request, session, url_for
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

@app.route("/login")
def login():
    auth_query_params = {
        "response_type": "code",
        "client_id": SPOTIFY_CLIENT_ID,
        "scope" : SPOTIFY_SCOPES,
        "redirect_uri": SPOTIFY_REDIRECT_URI
    }
    url_args = urlencode(auth_query_params)
    auth_url = f"{SPOTIFY_AUTH_URL}?{url_args}"
    return redirect(auth_url)

@app.route("/callback")
def callback():
    auth_code = request.args.get('code')