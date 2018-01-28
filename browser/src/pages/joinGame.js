import React, { Component } from 'react';
import Button from '../components/button';
import Layout from '../components/layout';
import Input from '../components/input';

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
     <Layout>
          <Input type="text" id="join-name" label="Enter Game Code" size={4} onChange={this.onRoomCodeInputChange.bind(this)} />
          <Button onClick={this.onJoinButtonClick.bind(this)} label="Ready!" />
      </Layout>
    );
  }
}

export default JoinGame;
