# Spotify Music Weirdness Score

This Flask application calculates how "weird" a user's music taste is based on their Spotify listening habits. It uses data from Spotify's API to evaluate track popularity, genre diversity, and artist uniqueness, and returns a score between 0 and 100.

## Features
- **Spotify Authentication**: Users log in with their Spotify account to provide access to their top tracks.
- **Weirdness Calculation**: Calculates a weirdness score using the following metrics:
  - **Popularity Weirdness**: Based on the popularity of tracks.
  - **Genre Diversity**: Based on how many and how varied the genres of the tracks are.
  - **Artist Uniqueness**: Based on how niche or common the artists are (using the number of followers as a proxy).
  
## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/spotify-weirdness-score.git
    cd spotify-weirdness-score
    ```

2. Create a virtual environment and activate it:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Create a `.env` file in the project root and add your Spotify API credentials:
    ```bash
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIFY_REDIRECT_URI=http://localhost:5001/callback
    ```

## Usage

1. Run the Flask app:
    ```bash
    flask run
    ```

2. Open your browser and go to `http://localhost:5001/`. You will be presented with a login link to Spotify.

3. After logging in, you can hit the `/weirdness-score` endpoint to retrieve your weirdness score:
    ```bash
    http://localhost:5001/weirdness-score
    ```

### Spotify API Authentication Flow
The app uses the Spotify OAuth flow to authenticate users and get their top tracks. The `access_token` is used to make authorized requests to the Spotify API, and the token is refreshed if it expires.

### Weirdness Score Calculation
The weirdness score is calculated based on three factors:
- **Popularity Weirdness**: Measures how mainstream or obscure the tracks are (less popular tracks = higher weirdness).
- **Genre Weirdness**: Evaluates how diverse the user's music genres are (more diversity = higher weirdness).
- **Artist Uniqueness**: Based on the number of followers each artist has (fewer followers = higher weirdness).

These three metrics are combined into a final weirdness score, weighted as follows:
- Popularity Weirdness: 40%
- Genre Weirdness: 40%
- Artist Uniqueness: 20%

### Endpoints
- `/`: Home page with login link.
- `/login`: Redirects to Spotify for login.
- `/callback`: Handles the Spotify OAuth callback and stores the access token.
- `/weirdness-score`: Returns the weirdness score in JSON format.

### Example Response
```json
{
  "popularity_weirdness": 78.5,
  "genre_weirdness": 66.7,
  "artist_weirdness": 45.2,
  "final_weirdness": 69.8
}


