const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

require('dotenv').config()

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const redirectUri = process.env.SPOTIFY_REDIRECT_URI
const authEndpoint = 'https://accounts.spotify.com/authorize'
const scopes = ['user-read-private', 'user-read-email', 'user-read-currently-playing', 'user-read-playback-state',
    'user-read-playback-position', 'streaming']

const app = express()

console.log('Listening on 8080');
app.listen(8080);