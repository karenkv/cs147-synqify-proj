import React, {Component} from "react";

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.token,
            currentTrack: this.props.track
        }
    }

    render() {
        return(
            <div>{this.state.currentTrack}</div>
        )
    }
}

export default Player;