/**
 * Copyright (c) 2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, { Component } from "react"
import Auth from "./auth"
import AuthCI from "./authCI"

class SignIn extends Component {

  constructor(props) {
    super(props)

    this.signedIn = this.signedIn.bind(this)

    this.state = {
      googleLogin: "false",
      cilogon: "false"
    }

  }

  signedIn() {
    console.log(this.state.googleLogin);
    console.log(this.state.cilogon);

    this.setState({
      googleLogin: localStorage.getItem("login"),
      cilogon: localStorage.getItem("loginCI")
    })

    // googleLogin = localStorage.getItem("login");
    // cilogon = localStorage.getItem("loginCI");

    console.log(this.state.googleLogin);
    console.log(this.state.cilogon);
  }

  render() {
    return (
      <>
        {(this.state.googleLogin === "true") ? (
          <Auth signedIn={this.signedIn}/>

        ) : (
          (this.state.cilogon === "true") ? (
            <AuthCI signedIn={this.signedIn}/>
          ) : (
            <>
              <Auth signedIn={this.signedIn}/>
              <AuthCI signedIn={this.signedIn}/>
            </>
          )
        )}
      </>
      // <AuthCI signedIn={this.signedIn}/>
    )
  }

}

export default SignIn
