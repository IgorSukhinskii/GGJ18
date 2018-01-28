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
          <h1 className="start__logo">
            Murder Game
          </h1>
        </header>
        <div className="start__container">
          <label htmlFor="input-name" className="start__label">Enter Nickname</label>
          <input type="text" id="input-name" className="start__input" onChange={this.onNameInputChange.bind(this)} />
          <Button onClick={this.onJoinButtonClick.bind(this)} className="start__button" label="Join Game" />
          <Button onClick={this.onStartButtonClick.bind(this)} className="start__button" label="Start Game" />
        </div>
      </div>
    );
  }
}

export default Start;
