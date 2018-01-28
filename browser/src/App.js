import React, { Component } from 'react';
import Start from './pages/start';
import WaitingRoom from './pages/waitingRoom';
import JoinGame from './pages/joinGame';
import VictimGame from './pages/game/victim';
import OutsiderGame from './pages/game/outsider';
import Scores from './pages/scores';

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
      victimPosition: {},
      victimHealth: 0,
      playerNumber: 0
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
        players: data.payload.players,
        playerNumber: 0
      })
    } else if (data.type === 'join') {
      this.setState({
        players: data.payload.players
      })
    } else if (data.type === 'joinResult') {
      if (data.payload.result === 'success') {
        this.setState({
          currentPage: 'waitingRoom',
          players: data.payload.players,
          playerNumber: data.payload.playerNumber
        });
      } else {
        alert('Cannot connect to the room');
      }
    } else if (data.type === 'start') {
      this.setState({
        currentPage: 'game',
        playerType: data.payload.playerType,
        maze: data.payload.maze,
        victimPosition: data.payload.victimPosition,
        victimHealth: data.payload.victimHealth
      });
    } else if (data.type === 'move') {
      this.setState({
        victimPosition: data.payload.position,
        maze: data.payload.maze,
        victimHealth: data.payload.victimHealth
      });
    } else if (data.type === 'finishRound') {
      const { killer, result, players, victim } = data.payload;
      this.setState({
        currentPage: 'scores',
        killer,
        result,
        players,
        victim
      }) 
    } else if (data.type === 'endGame') {
      const { winner } = data.payload;
      this.setState({
        winner
      })
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

  onRoundEnd() {
    this.sendMessage({
      type: "finishRound",
      payload: {}
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
            onRoundEnd={this.onRoundEnd.bind(this)}
            maze={this.state.maze}
            victimPosition={this.state.victimPosition}
            victimHealth={this.state.victimHealth} />
        )}
        {this.state.currentPage === 'game' && this.state.playerType !== 'victim' && (
          <OutsiderGame
            maze={this.state.maze}
            victimPosition={this.state.victimPosition}
            playerType={this.state.playerType}
            playerNumber={this.state.playerNumber} />
        )}
        {this.state.currentPage === 'scores' && (
          <Scores
            killer={this.state.killer}
            result={this.state.result}
            victim={this.state.victim}
            players={this.state.players}
            winner={this.state.winner} />
        )}
      </div>
    );
  }
}

export default App;
