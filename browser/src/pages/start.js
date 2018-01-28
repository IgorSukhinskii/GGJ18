import React, { Component } from 'react';
import Button from '../components/button';
import Input from '../components/input';
import Layout from '../components/layout';

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }
  onNameInputChange(evt) {
    this.setState({ name: evt.target.value });
  }
  onJoinButtonClick() {
    this.props.onJoinButtonClick(this.state.name);
  }
  onStartButtonClick() {
    this.props.onStartButtonClick(this.state.name);
  }
  render() {
    return (
     <Layout>
          <Input id="nickname" onChange={this.onNameInputChange.bind(this)} size={10} label="Enter Nickname" />
          <Button onClick={this.onJoinButtonClick.bind(this)} label="Join Game" />
          <Button onClick={this.onStartButtonClick.bind(this)} label="Start Game" />
     </Layout>
    );
  }
}

export default Start;
