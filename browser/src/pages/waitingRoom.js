import React, { Component } from 'react';
import Layout from '../components/layout';
import WaitingRoom from '../components/waiting-room/waiting-room';

class WaitingRoomPage extends Component {
  render() {
    return (
        <Layout nologo>
            <WaitingRoom roomCode={this.props.roomCode} players={this.props.players} onStartGame={this.props.onStartGame}/>
        </Layout>
    );
  }
}

export default WaitingRoomPage;
