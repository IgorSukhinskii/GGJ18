import React, { Component } from 'react';
import logo from './logo.png';
import './layout.css';

class Layout extends Component {
	render() {
		return (
			<div className="layout">
				<header className="layout__header">
					{!this.props.nologo && (<img src={logo} alt="Murder Game" className="layout__logo-pic" />)}

				</header>
				<div className="layout__container">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Layout;
