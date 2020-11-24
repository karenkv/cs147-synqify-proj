import React, {Component} from 'react';
import './App.css';
import {authEndpoint, clientId, redirectUri, scopes} from "./config";
import logo from './assets/logo.svg';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
        }
    }

    handleLogin = () => {
        const toString = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20")}&response_type=token&show_dialog=true`
        window.open(toString, "_self");
    }

    render() {
        return (
           <div className={"App"}>
               <div className={"header"}>
                  <img src={logo} alt={"logo"}/>
               </div>
               <div className={"body"}>
                   {!this.state && <button onClick={this.handleLogin}>Login to Spotify</button>}
               </div>
           </div>
        );
    }
}

export default App;