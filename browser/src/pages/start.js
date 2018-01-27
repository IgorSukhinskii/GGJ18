import React, { Component } from 'react';
import Button from '../components/button';
import './start.css';

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }
  onNameInputChange(evt) {
    this.setState({ name: evt.target.value });
  }
  onJoinButtonClick() {
    this.props.onJoinButtonClick(this.state.name);
  }
  onStartButtonClick() {
    this.props.onStartButtonClick(this.state.name);
  }
  render() {
    return (
      <div className="start">
        <header className="start__header">
          <h1 className="start__title">Murder Transmission House Maze Escape Competitive Cooperative Social Experience with Mobile Devices Multiplayer Party: The Game</h1>
        </header>
        <div className="start__container">
          <input type="text" onChange={this.onNameInputChange.bind(this)} />
          <Button onClick={this.onJoinButtonClick.bind(this)} label="Join Game" />
          <Button onClick={this.onStartButtonClick.bind(this)} label="Start Game" />
        </div>
      </div>
    );
  }
}

export default Start;
