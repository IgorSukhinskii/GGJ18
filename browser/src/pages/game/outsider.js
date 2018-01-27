import React, { Component } from 'react';
import { mazeToSvgPath, gridToScreenCoordinates } from '../../utils/mazeToSvgPath';

class Outsider extends Component {
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
      </div>
    );
  }
}

export default Outsider;
