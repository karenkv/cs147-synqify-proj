import React, {Component} from "react";
import {apiEndpoint} from "../utils/config";

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: props.token,
            deviceId: props.deviceId,
            img: null
        }
        this.getPlayerInfo = this.getPlayerInfo.bind(this);
        this.playerInterval = setInterval(() => this.getPlayerInfo(), 1000);
    }

    componentDidMount() {
        this.getPlayerInfo();
    }

    getPlayerInfo = () => {
        fetch(`${apiEndpoint}/me/player`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`,
            }
        }).then(response => response.json()).then(data => {
                console.log(data);
                if(data.is_playing) {
                    fetch(`${apiEndpoint}/me/player/currently-playing`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.state.token}`,
                        }
                    }).then(response => response.json()).then(data => {
                        console.log(data.item);
                        this.setState({img: data.item.album.images[0].url})
                    })
                } else {
                    fetch(`${apiEndpoint}/me/player/recently-played`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.state.token}`,
                        }
                    }).then(response => response.json()).then(data => {
                        console.log(data.items[0].track);
                        this.setState({img: data.items[0].track.album.images[0].url})
                    })
                }
            }).catch(err => {
                console.log(err);
            });
    }

    render() {
        return(
            <div className={'player'}>
                <img src={this.state.img} alt={'album cover'}/>
            </div>
        )
    }
}

export default Player;