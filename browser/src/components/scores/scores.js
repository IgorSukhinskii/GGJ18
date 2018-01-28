import React, { Component } from 'react';
import './scores.css';
class Scores extends Component {
	render() {
		const icons = {
			"savior": "",
			"killer": "scores__player_killer",
			"victim": "scores__player_victim"
		}
		return (
			<div className="scores">
				{this.props.winner ? (
					<div className="scores__winner">The Winner Is <br/>
						<span className="scores__winner-name">{this.props.winner}</span>
					</div>
				) : (
					<div>
						<div className="scores__label">Round results:</div>
						<div className="scores__killer">{this.props.killer} was the killer!</div>
						<div className="scores__result">
						{this.props.result === "escape"
							? `${this.props.victim} has managed to escape!`
							: `${this.props.victim} has perished in this horrible maze!`}
						</div>
					</div>
				)}

				<ul className="scores__players">
					{this.props.players.map((player, i) => (
						<li key={i} className={`scores__player ${icons[player.playerType]}`}>
							<span className="scores__player-name">{player.name}</span>
							<span className="scores__player-score">{player.score}</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

export default Scores;
