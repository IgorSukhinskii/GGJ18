import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import './victim.css';
import { mazeToSvgPath, gridToScreenCoordinates, generateGrid } from '../../utils/mazeToSvgPath';
import heart from './heart.svg';
import arrow from './victim_control_up.svg';
import heartEmpty from './heartEmpty.svg';
import victimIcon from '../../components/scores/icon_victim.svg';
import radar from './radar.svg';
import radarPointer from './radar_pointer.svg';
import cover from './bg_game_victim.svg';

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
  timerRenderer({ hours, minutes, seconds, completed }) {
    if (completed) {
      // die
      this.props.onRoundEnd();
      return '00:00';
    } else {
      return `${("00"+minutes).slice(-2)}:${("00"+seconds).slice(-2)}`
    }
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
    return (
      <div className="victim">
          <svg className="victim__map" style={{transform}}>
            <path className="victim__grid" d={generateGrid(maze)} />
            <path className="victim__maze" d={mazeToSvgPath(maze)} />
            <circle className="victim__player" r="16" cx={cx} cy={cy} />
          </svg>
          <img className="victim__cover" src={cover} alt="cover" />
          <img className="victim__radar" src={radar} alt="radar" />
          <img className="victim__radar-pointer" src={radarPointer} alt="radar pointer" />
          <div className="victim__top">
            <img className="victim__icon" src={victimIcon} alt="" />
            <div className="victim__timer">
              <Countdown date={Date.now() + 120000} renderer={this.timerRenderer.bind(this)} />
            </div>
            <div className="victim__health">{hearts.map((h, i) => (<img key={i} alt="❤" src={h} className="victim__heart"/>))}</div>
          </div>
          <div className="victim__buttons-container">
            <div className="victim__buttons">
              <img className="victim__button victim__button--n" src={arrow} alt="N" onClick={this.onNorthButtonClick.bind(this)} />
              <img className="victim__button victim__button--s" src={arrow} alt="N" onClick={this.onSouthButtonClick.bind(this)} />
              <img className="victim__button victim__button--e" src={arrow} alt="N" onClick={this.onEastButtonClick.bind(this)} />
              <img className="victim__button victim__button--w" src={arrow} alt="N" onClick={this.onWestButtonClick.bind(this)} />
            </div>
          </div>
      </div>
    );
  }
}

export default Victim;
