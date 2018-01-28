import React, { Component } from 'react';
import Button from '../../components/button';
import { mazeToSvgPath, gridToScreenCoordinates } from '../../utils/mazeToSvgPath';

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
    return (
      <div className="victim">
          <svg width="250" height="250">
            <path stroke="black" d={mazeToSvgPath(maze)} />
            <circle fill="red" r="5" cx={cx} cy={cy} />
          </svg>
          <p className="victim__health">{this.props.victimHealth}</p>
          <Button onClick={this.onNorthButtonClick.bind(this)} label="N" />
          <Button onClick={this.onSouthButtonClick.bind(this)} label="S" />
          <Button onClick={this.onEastButtonClick.bind(this)} label="E" />
          <Button onClick={this.onWestButtonClick.bind(this)} label="W" />
          <Button onClick={this.props.onRoundEnd} label="die" />
      </div>
    );
  }
}

export default Victim;
