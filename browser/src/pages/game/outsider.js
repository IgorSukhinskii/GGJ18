import React, { Component } from 'react';
import './victim.css';
import { mazeToSvgPath, gridToScreenCoordinates, generateGrid } from '../../utils/mazeToSvgPath';
import killerIcon from '../../components/scores/icon_murderer.svg';
import saviorIcon from '../../components/scores/icon_survivor.svg';
import renderCollectibles from '../../utils/renderCollectibles';

class Victim extends Component {
  render() {
    console.log(this.props);
    const { victimPosition, maze, playerType, playerNumber } = this.props;
    const cx = gridToScreenCoordinates(victimPosition.x);
    const cy = gridToScreenCoordinates(victimPosition.y, maze.height);
    const collectibles = renderCollectibles(maze, playerNumber, playerType);
    return (
      <div className="victim">
          <svg className="victim__map victim__map--outsider">
            <path className="victim__grid" d={generateGrid(maze)} />
            <path className="victim__maze" d={mazeToSvgPath(maze)} />
            <circle className="victim__player victim__player--outsider" r="16" cx={cx} cy={cy} />
            {collectibles}
          </svg>
          <div className="victim__top">
            <img className="victim__icon" src={playerType === "savior" ? saviorIcon :killerIcon} alt="" />
          </div>
      </div>
    );
  }
}

export default Victim;
