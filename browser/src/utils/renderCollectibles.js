import React from 'react';
import {gridToScreenCoordinates} from './mazeToSvgPath';
import './collectibles.css';

export default function renderCollectibles(maze) {
  const colors = ["#0F3D9C", "#A9AC03", "#0B9838", "#990525"];
  const result = [];
  for (let x = 0; x < maze.width; x++) {
    for (let y = 0; y < maze.height; y++) {
      const cell = maze.cells[x][y];
      for (let c of cell.collectibles) {
        if (c.type === "exit") {
          const cx = gridToScreenCoordinates(x - 0.5) + 4;
          const cy = gridToScreenCoordinates(y - 0.5, maze.height) + 6;
          result.push((
            <svg key={x*20 + y} viewBox="0 0 74.87 74.87" width="36" height="36" x={cx} y={cy}>
              <circle cx="37.44" cy="37.44" r="32.44" stroke={colors[c.owner % colors.length]} strokeWidth="10" fill="none" strokeMiterlimit="10"/>
              <circle cx="29.91" cy="9.31" r="7.55" fill="#fbfbfc"/>
              <path d="M10.51 31.95h11.85l10.79-11.86h20.48l6.46 9.71" fill="none" strokeMiterlimit="10" stroke="#fbfbfc" strokeLinecap="round" strokeWidth="5"/>
              <path strokeWidth="9" stroke="#fbfbfc" strokeLinecap="round" fill="none" strokeMiterlimit="10" d="M35.84 22.79l8.08 15.63"/>
              <path d="M42.31 40.04l-18.33 29.1m22.64-30.18l4.31 17.25h18.33" fill="none" strokeMiterlimit="10" stroke="#fbfbfc" strokeLinecap="round" strokeWidth="5"/>
            </svg>
          ));
        } else if (c.type === "trap") {
          const cx = gridToScreenCoordinates(x - 0.5) + 4;
          const cy = gridToScreenCoordinates(y + 0.5, maze.height) + 6;
          result.push((
            <svg key={x*20 + y} viewBox="0 0 85.7 54.29" width="36" height="36" x={cx} y={cy}>
              <ellipse cx="42.85" cy="31.93" rx="39.35" ry="18.87" stroke="#fbfbfc" strokeMiterlimit="10" fill="none" strokeWidth="7"/>
              <ellipse fill="#fbfbfc" cx="42.85" cy="27.62" rx="12.94" ry="6.2"/>
              <path strokeWidth="2" fill="#fbfbfc" stroke="#fbfbfc" strokeMiterlimit="10" d="M3.5 27.08h78.7v1.08H3.5z"/>
              <path fill="#fbfbfc" d="M42.31 0l3.77 6.53 3.77 6.53H34.77l3.77-6.53L42.31 0zM22.91 2.16l3.77 6.53 3.77 6.53H15.36l3.77-6.53 3.78-6.53zM62.79 2.16l3.77 6.53 3.77 6.53H55.25l3.77-6.53 3.77-6.53zM42.31 37.73l3.77 6.53 3.77 6.53H34.77l3.77-6.53 3.77-6.53zM22.91 33.42l3.77 6.53 3.77 6.53H15.36l3.77-6.53 3.78-6.53zM62.79 33.42l3.77 6.53 3.77 6.53H55.25l3.77-6.53 3.77-6.53z"/>
            </svg>
          ));
        } else if (c.type === "medkit") {
          const cx = gridToScreenCoordinates(x) - 12;
          const cy = gridToScreenCoordinates(y, maze.height) - 12;
          result.push((
            <svg key={x*20 + y} viewBox="0 0 24 24" width="24" height="24" x={cx} y={cy}>
              <path fill="red" d="M 12 12 m -4,4 h -8 v -8 h 8 v -8 h 8 v 8 h 8 v 8 h -8 v 8 h -8 v -8" />
            </svg>
          ))
        }
      }
    }
  }
  return result;
}