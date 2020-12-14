import React, {Component} from "react";
import {apiEndpoint} from "../utils/config";
import {PubSub} from "aws-amplify";

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: props.token,
            deviceId: props.deviceId,
            img: null,
            playing: false,
            currentTime: 0,
            trackUri: null
        }
        this.getPlayerInfo = this.getPlayerInfo.bind(this);
        this.progressBar = {
            width: (this.state.progress / this.state.duration) * 100 + '%'
        }
    }

    componentDidMount() {
        this.playerInterval = setInterval(() => this.getPlayerInfo(), 1000);
    }

    getPlayerInfo = () => {
        fetch(`${apiEndpoint}/me/player`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        }).then(async response => {
            const string = await response.text();
            const data = string === "" ? {} : JSON.parse(string);
            if (data !== {}) {
                if (data.is_playing) {
                    this.setState({playing: true})
                } else {
                    this.setState({playing: false})
                }
                try {
                    this.handlePlayerPlaying();
                } catch {
                    this.handlePlayerNotPlaying();
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    playerInterval = () => {
        this.getPlayerInfo();
    }

    handlePlayerPlaying = () => {
        fetch(`${apiEndpoint}/me/player/currently-playing`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }
        }).then(response => response.json()).then(data => {
            if (data.item.album !== undefined) {
                this.setState({img: data.item.album.images[0].url});
            }
            this.setState({
                currentTime: data.progress_ms,
                progress: (data.progress_ms / data.item.duration_ms),
                name: data.item.name,
                artists: data.item.artists.map(artist => {return artist.name}).join(", ")
            });
        }).catch(err => {
            console.log(err);
        });
    }

    handlePlayerNotPlaying = () => {
        fetch(`${apiEndpoint}/me/player/recently-played`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`,
            }
        }).then(response => response.json()).then(data => {
            if (data.items !== undefined) {
                this.setState({
                    img: data.items[0].track.album.images[0].url,
                    progress: 0,
                    name: data.items[0].track.name,
                    artists: data.items[0].track.artists.map(artist => {return artist.name}).join(", "),
                    trackUri: data.items[0].track.uri
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    pauseSong = () => {
        PubSub.publish('pause-song', {'timeStamp': Date.now() + 2000})
            .then(async response => {
                await new Promise(r => setTimeout(r, 2000));
                fetch(`${apiEndpoint}/me/player/pause`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.state.token}`,
                    }
                }).then(response => {
                    if (response.ok) {
                        this.setState({playing: false})
                    }
                }).catch(err => {
                    console.log(err);
                });
            });
    }

    playSong = () => {
        PubSub.publish('play-song', {
            'spotifyUri': this.state.trackUri, 'timeStamp': Date.now() + 2000, 'songProgress': this.state.currentTime
        }).then(async response => {
            await new Promise(r => setTimeout(r, 2000));
            fetch(`${apiEndpoint}/me/player/play`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.token}`,
                }
            }).then(response => {
                if (response.ok) {
                    this.setState({playing: false})
                }
            }).catch(err => {
                console.log(err);
            });
        });
    }

    render() {
        return (
            <div className={'player'}>
                <img src={this.state.img} alt={'Album Cover'}/>
                <p><b>{this.state.name}</b><br/><i>by {this.state.artists}</i></p>
                <div className={"progress"}>
                    <div className={"progress-bar"} style={{transform: `scaleX(${this.state.progress})`}}/>
                </div>
                <button onClick={this.state.playing ? this.pauseSong : this.playSong}>{this.state.playing ? '❚❚' : '►'}</button>
            </div>
        )
    }
}

export default Player;