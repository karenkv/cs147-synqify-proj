import React, {Component} from 'react';
import Amplify, {Auth, PubSub} from 'aws-amplify';
import {AWSIoTProvider} from "@aws-amplify/pubsub/lib/Providers";
import {awsconfig} from './aws-exports';
import {cookies} from "./utils/cookies";
import {authEndpoint, apiEndpoint, clientId, redirectUri, scopes, region, mqttEndpoint} from "./utils/config";
import logo from './assets/logo.svg';
import icon from './assets/search.svg';
import './App.css';


Amplify.configure(awsconfig);
Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: region,
    aws_pubsub_endpoint: mqttEndpoint,
   }));
Auth.currentCredentials().then(creds => console.log(creds));


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: cookies === {} ? null : cookies.get('token'),
            playing: false,
            results: [],
            currentTrack: null,
            deviceId: null,
            player: null,
            speakers: []
        }
        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        this.handlePlaySong = this.handlePlaySong.bind(this);
    }

    componentDidMount() {
        const result = {};
        window.location.hash
            .substr(1).split('&').forEach(function(part) {
                const item = part.split('=');
                result[item[0]] = decodeURIComponent(item[1]);
            });
        if (result['access_token'] !== undefined) {
            this.setState({
                token: result['access_token']
            });
            let d = new Date();
            d.setTime(d.getTime() + result['expires_in']);
            cookies.set('token', result['access_token'], {path: '/', expires: d});
            window.open(redirectUri, "_self");
        }
        PubSub.subscribe('speaker-connected').subscribe({
            next: data => {
                try {
                    if(!this.state.speakers.includes(data.value.speaker)) {
                        this.setState({speakers: [...this.state.speakers, data.value.speaker]})
                        console.log(this.state.speakers);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            },
            error: error => console.error(error),
            close: () => console.log('Done'),
        });
    }

    handleLogin = () => {
        const toString = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20")}&response_type=token&show_dialog=true`
        window.open(toString, "_self");
    }

    handleSearch = (event) => {
        event.preventDefault();
        fetch(`${apiEndpoint}/search?q=${encodeURIComponent(event.target.search.value)}&type=track`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            if(data.tracks.items.length > 0) {
                this.setState({
                    results: data.tracks.items.map(track => {
                        return (
                            <div className={"result"}>
                                <button onClick={() => this.handlePlaySong(track.uri)}>►</button>
                                <p>
                                    {track.name} by {
                                    track.artists.map(artist => {
                                        return artist.name
                                    }).join(", ")
                                }</p>
                            </div>
                        )
                    })
                })
            } else {
                this.setState({results: [<p>No results found.</p>]})
            }
        }).catch(err => {
            console.log(err);
            cookies.remove('token');
            alert("Access token expired! Please login again.");
            this.handleLogin();
        })
    }

    handlePlaySong = (trackUri) => {
        this.setState({currentTrack: trackUri});
        PubSub.publish('new-song-played', {'spotify-uri': trackUri});
        fetch(`${apiEndpoint}/me/player/play?device_id=${this.state.deviceId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`,
            },
            body: JSON.stringify({
                "uris": [trackUri]
            })
        }).then(response => response.json()).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    }

    checkForPlayer = () => {
        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: "Synqify",
                getOAuthToken: cb => {
                    cb(this.state.token);
                },
            });
            this.player.connect();
        }
        this.createEventHandlers();
    }

    createEventHandlers = () => {
        this.player.on('initialization_error', e => {
            console.error(e);
        });
        this.player.on('authentication_error', e => {
            console.error(e);
            this.setState({ token: null });
        });
        this.player.on('account_error', e => {
            console.error(e);
        });
        this.player.on('playback_error', e => {
            console.error(e);
        });
        this.player.on('player_state_changed', state => {
            console.log(state);
        });
        this.player.on('ready', data => {
            let { device_id } = data;
            this.setState({ deviceId: device_id });
        });
    }

    render() {
        return (
            <div className={"App"}>
                {!this.state.token &&
                    <div className={"login"}>
                        <img src={logo} alt={"logo"}/>
                        <button onClick={this.handleLogin}>Login to Spotify</button>
                    </div>
                }
                {this.state.token &&
                    <div className={"home"}>
                        <div className={"header"}>
                            <img src={logo} alt={"logo"}/>
                            <div className={"search"}>
                               <form onSubmit={this.handleSearch}>
                                   <img src={icon} alt="magnifying glass"/>
                                   <input type="text" name="search" placeholder="Search"/>
                               </form>
                           </div>
                           <div className={"results"}>
                               {this.state.results}
                           </div>
                        </div>
                        <div className={"body"}>
                           <div className={"speakers"}>
                                <button>Connect a New Speaker</button>
                                <button>View Connected Speakers</button>
                           </div>
                           <div className={"player"}>
                           </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default App;