import React, { Component } from 'react';
import './input.css';

class Input extends Component {
  render() {
    return (
    	<div className="input">
			{
				this.props.label && (<label htmlFor={this.props.id} className="input__label">{this.props.label}</label>)}
				<input type="text" maxLength={this.props.size} size={this.props.size} id={this.props.id} className="input__field" onChange={this.props.onChange} />
      </div>
    );
  }
}

export default Input;
