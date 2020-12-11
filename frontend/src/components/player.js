import React, {Component} from "react";
import {apiEndpoint} from "../utils/config";

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: props.token,
            deviceId: props.deviceId,
            img: null,
            playing: false
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
                    this.handlePlayerPlaying();
                } else {
                    this.setState({playing: false})
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
            if (data.item.album !== null) {
                this.setState({img: data.item.album.images[0].url});
            }
            this.setState({
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
            if (data.items[0].track.album !== null) {
                this.setState({img: data.items[0].track.album.images[0].url});
            }
            this.setState({
                progress: 0,
                name: data.items[0].track.name,
                artists: data.items[0].track.artists.map(artist => {return artist.name}).join(", ")
            })
        }).catch(err => {
            console.log(err);
        });
    }

    pauseSong = () => {
        fetch(`${apiEndpoint}/me/player/pause`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`,
            }
        }).then(response => {
            if(response.ok) {
                this.setState({playing: false})
            }
        }).catch(err => {
            console.log(err);
        });
    }

    playSong = () => {
        fetch(`${apiEndpoint}/me/player/play`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`,
            }
        }).then(response => {
            if(response.ok) {
                this.setState({playing: false})
            }
        }).catch(err => {
            console.log(err);
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