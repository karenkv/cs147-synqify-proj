import React, {Component} from 'react';
import './App.css';
import {authEndpoint, clientId, redirectUri, scopes} from "./config";
import logo from './assets/logo.svg';
import icon from './assets/search.svg';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            playing: false,
            results: []
        }
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
        }
    }

    handleLogin = () => {
        const toString = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20")}&response_type=token&show_dialog=true`
        window.open(toString, "_self");
    }

    handleSearch = (event) => {
        event.preventDefault();
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(event.target.search.value)}&type=track`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`,

            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            this.setState({
                results: data.tracks.items.map(track => {
                    return <p>{track.name} by {
                       track.artists.map(artist => {
                           return artist.name
                       }).join(",")
                    }</p>
                })
            })
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
           <div className={"App"}>
               <div className={"header"}>
                  <img src={logo} alt={"logo"}/>
                   {this.state.token && (
                       <>
                           <div className={"search"}>
                               <form onSubmit={this.handleSearch}>
                                   <img src={icon} alt="magnifying glass"/>
                                   <input type="text" name="search" placeholder="Search"/>
                               </form>
                           </div>
                           {this.state.results}
                       </>
                   )}
               </div>
               <div className={"body"}>
                   {!this.state.token && <button onClick={this.handleLogin}>Login to Spotify</button>}
                   {this.state.token && (
                       <>
                           <div>
                                <button>Connect a New Speaker</button>
                                <button>View Connected Speakers</button>
                           </div>
                       </>
                       )}
               </div>
           </div>
        );
    }
}

export default App;