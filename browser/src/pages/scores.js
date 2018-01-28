import React, { Component } from 'react';
import Layout from '../components/layout';
import Scores from '../components/scores/scores';

class ScoresPage extends Component {
  render() {
    return (
        <Layout nologo>
			<Scores
				killer={this.props.killer}
				result={this.props.result}
				victim={this.props.victim}
				winner={this.props.winner}
				players={this.props.players}
			/>
        </Layout>
    );
  }
}

export default ScoresPage;
