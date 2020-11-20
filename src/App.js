import React, {Component} from 'react';
import './App.css';
import logo from './assets/logo.svg';

class App extends Component {
    render() {
        return (
           <div className={"App"}>
               <img src={logo} alt={"logo"}/>
           </div>
        );
    }
}

export default App;