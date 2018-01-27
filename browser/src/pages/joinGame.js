import React, { Component } from 'react';
import Button from '../components/button';

class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: ''
    };
  }
  onRoomCodeInputChange(evt) {
    this.setState({ roomCode: evt.target.value });
  }
  onJoinButtonClick() {
    this.props.onConnectButtonClick(this.state.roomCode);
  }
  render() {
    return (
      <div className="start">
        <header className="start__header">
          <h1 className="start__title">Murder Transmission House Maze Escape Competitive Cooperative Social Experience with Mobile Devices Multiplayer Party: The Game</h1>
        </header>
        <div className="start__container">
          <input type="text" onChange={this.onRoomCodeInputChange.bind(this)} />
          <Button onClick={this.onJoinButtonClick.bind(this)} label="Join Game" />
        </div>
      </div>
    );
  }
}

export default JoinGame;
