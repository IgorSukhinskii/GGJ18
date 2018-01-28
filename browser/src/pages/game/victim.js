import React, { Component } from 'react';
import './victim.css';
import { mazeToSvgPath, gridToScreenCoordinates, generateGrid } from '../../utils/mazeToSvgPath';
import heart from './heart.svg';
import heartEmpty from './heartEmpty.svg';
import renderCollectibles from '../../utils/renderCollectibles';

class Victim extends Component {
  onNorthButtonClick() {
    this.props.onMoveButtonClick("N");
  }
  onSouthButtonClick() {
    this.props.onMoveButtonClick("S");
  }
  onEastButtonClick() {
    this.props.onMoveButtonClick("E");
  }
  onWestButtonClick() {
    this.props.onMoveButtonClick("W");
  }
  render() {
    console.log(this.props);
    const { victimPosition, maze } = this.props;
    const cx = gridToScreenCoordinates(victimPosition.x);
    const cy = gridToScreenCoordinates(victimPosition.y, maze.height);
    const hearts = [];
    let i = 0
    for (; i < this.props.victimHealth; i++) {
      hearts.push(heart);
    }
    for (; i < 3; i++) {
      hearts.push(heartEmpty);
    }
    const transform = `translate(${-cx}px,${-cy}px)`;
    console.log(transform);
    const collectibles = renderCollectibles(maze);
    return (
      <div className="victim">
          <svg className="victim__map" style={{transform}}>
            <path className="victim__grid" d={generateGrid(maze)} />
            <path className="victim__maze" d={mazeToSvgPath(maze)} />
            <circle className="victim__player" r="16" cx={cx} cy={cy} />
            {collectibles}
          </svg>
          <div className="victim__health">{hearts.map((h, i) => (<img key={i} alt="❤" src={h} className="victim__heart"/>))}</div>
          <div className="victim__buttons">
            <div className="victim__button victim__button--n" onClick={this.onNorthButtonClick.bind(this)}>N</div>
            <div className="victim__button victim__button--s" onClick={this.onSouthButtonClick.bind(this)}>S</div>
            <div className="victim__button victim__button--e" onClick={this.onEastButtonClick.bind(this)}>E</div>
            <div className="victim__button victim__button--w" onClick={this.onWestButtonClick.bind(this)}>W</div>
          </div>
      </div>
    );
  }
}

export default Victim;
