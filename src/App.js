import React, {Component} from 'react';
import './App.css';
import logo from './assets/logo.svg';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null
        }
    }

    handleLogin = () => {

    }

    render() {
        return (
           <div className={"App"}>
               <div className={"header"}>
                  <img src={logo} alt={"logo"}/>
               </div>
               <div className={"body"}>
                  <button onClick={this.handleLogin}>Login to Spotify</button>
               </div>
           </div>
        );
    }
}

export default App;