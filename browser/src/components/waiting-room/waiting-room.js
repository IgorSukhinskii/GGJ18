import React, { Component } from 'react';
import Button from '../button';
import './waiting-room.css';

class WaitingRoom extends Component {
	render() {
		return (
			<div className="waiting-room">
				<div className="waiting-room__room-label">Game code:</div>
				<div className="waiting-room__room-code">{this.props.roomCode}</div>

				<div className="waiting-room__room-label">Joined Players:</div>
				<ul className="waiting-room__players">
					{this.props.players.map((player, i) => (<li key={i} className="waiting-room__player">{player.name}</li>))}
				</ul>
				<Button label="start" onClick={this.props.onStartGame} />
			</div>
		);
	}
}

export default WaitingRoom;
