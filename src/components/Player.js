import React, {Component} from "react";

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
            uri: this.props.uri
        }
    }

    render() {
        return(
            <></>
        )
    }
}
export default Player;