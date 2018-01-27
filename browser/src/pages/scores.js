import React, { Component } from 'react';

class Scores extends Component {
  render() {
    return (
      <div className="scores">
        <div className="scores__label">Round results:</div>
        <div className="scores__killer">{this.props.killer} was the killer!</div>
        <div className="scores__result">
          {this.props.result === "escape"
            ? `${this.props.victim} has managed to escape!`
            : `${this.props.victim} has perished in this horrible maze!`}
        </div>
        {this.props.winner && (
          <div className="scores__winner">{this.props.winner} has won the run!</div>
        )}
        <ul className="scores__players">
          {this.props.players.map((player, i) => (
            <li key={i} className="waiting-room__player">{player.name}: {player.score}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Scores;
