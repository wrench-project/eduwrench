import React, { Component } from "react"
import ContentSignIn from './simulation/content_signin';

class SigninCheck extends Component {
  render() {
    return (
      this.props.auth === "true" ? this.props.data : <ContentSignIn content={this.props.content}/>
    )
  }
}

export default SigninCheck