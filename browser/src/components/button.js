import React, { Component } from 'react';
import './button.css';

class Button extends Component {
  render() {
    return (
      <div className="button" onClick={this.props.onClick}>
          <span className="button__text">{this.props.label}</span>
      </div>
    );
  }
}

export default Button;
