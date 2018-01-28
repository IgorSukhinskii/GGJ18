import React, { Component } from 'react';
import Start from './pages/start';
import WaitingRoom from './pages/waitingRoom';
import JoinGame from './pages/joinGame';
import VictimGame from './pages/game/victim';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      roomCode: '',
      currentPage: 'start',
      players: [],
      playerType: "savior",
      maze: {},
      victimPosition: {}
    }
    this.ws = new WebSocket(`ws://${window.location.hostname}:8999`);
    this.ws.onmessage = (evt) => this.onWsMessage(JSON.parse(evt.data));
  }

  onWsMessage(data) {
    console.log(data);
    if (data.type === 'create') {
      this.setState({
        roomCode: data.payload.roomCode,
        currentPage: 'waitingRoom',
        players: [this.state.name]
      })
    } else if (data.type === 'join') {
      this.setState({
        players: data.payload.players
      })
    } else if (data.type === 'joinResult') {
      this.setState({
        currentPage: 'waitingRoom',
        players: data.payload.players
      })
    } else if (data.type === 'start') {
      this.setState({
        currentPage: 'game',
        playerType: data.payload.playerType,
        maze: data.payload.maze,
        victimPosition: data.payload.victimPosition
      });
    } else if (data.type === 'move') {
      this.setState({
        victimPosition: data.payload.position
      });
    }
  }

  sendMessage(data) {
    this.ws.send(JSON.stringify(data));
  }

  onJoinButtonClick(name) {
    this.setState({
      name,
      currentPage: 'joinGame'
    })
  }

  onStartButtonClick(name) {
    this.setState({
      name
    });
    this.sendMessage({
      type: 'create',
      payload: {
        name
      }
    });
  }

  onConnectButtonClick(roomCode) {
    this.setState({
      roomCode
    });
    this.sendMessage({
      type: 'join',
      payload: {
        name: this.state.name,
        roomCode
      }
    });
  }

  onStartGame() {
    this.sendMessage({
      type: 'start',
      payload: {}
    })
  }

  move(direction) {
    this.sendMessage({
      type: 'move',
      payload: {
        direction
      }
    })
  }

  render() {
    return (
      <div className="container">
        {this.state.currentPage === 'start' && (
          <Start
            sendMessage={this.sendMessage.bind(this)}
            onJoinButtonClick={this.onJoinButtonClick.bind(this)}
            onStartButtonClick={this.onStartButtonClick.bind(this)} />
        )}
        {this.state.currentPage === 'waitingRoom' && (
          <WaitingRoom
            roomCode={this.state.roomCode}
            players={this.state.players}
            onStartGame={this.onStartGame.bind(this)} />
        )}
        {this.state.currentPage === 'joinGame' && (
          <JoinGame onConnectButtonClick={this.onConnectButtonClick.bind(this)} />
        )}
        {this.state.currentPage === 'game' && this.state.playerType === 'victim' && (
          <VictimGame
            onMoveButtonClick={this.move.bind(this)}
            maze={this.state.maze}
            victimPosition={this.state.victimPosition} />
        )}
      </div>
    );
  }
}

export default App;
