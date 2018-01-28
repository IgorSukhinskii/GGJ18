import React, { Component } from 'react';
import './layout.css';

class Layout extends Component {
	render() {
		return (
			<div className="layout">
				<header className="layout__header">
					{!this.props.nologo && (<h1 className="layout__logo">
						Murder Game
					</h1>)
					}

				</header>
				<div className="layout__container">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Layout;
