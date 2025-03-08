/**
 * Copyright (c) 2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, { Component } from "react"
import { Button, Dropdown } from 'semantic-ui-react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { StaticImage } from 'gatsby-plugin-image';
import { nanoid } from 'nanoid';
import axios from 'axios';
import "./signin.css";

const GOOGLE_CLIENT_ID =
  "1043042177326-hr8cj7m89j8s8i4bopgm9pkkllr4dedf.apps.googleusercontent.com"
const CILOGON_CLIENT_ID =
  "cilogon:/client_id/b5deb22f68b35d12084368473a0881a"

let redirect_uri = ""
if (window.location.port === "") {
  redirect_uri = window.location.protocol + "//" + window.location.hostname + "/callback"
}
else {
  redirect_uri = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/callback"
}

// generate random state value
const randomState = nanoid(20);

class SignIn extends Component {

  constructor(props) {
    super(props)

    this.state = {
      logged: false,
      loginType: "",
      accessToken: ""
    }

    this.googleLogin = this.googleLogin.bind(this)
    this.handleLoginFailure = this.handleLoginFailure.bind(this)
    this.googleLogout = this.googleLogout.bind(this)
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this)

    this.cilogin = this.cilogin.bind(this)
    this.cilogout = this.cilogout.bind(this)

    this.cilogon_link = "https://cilogon.org/authorize" + "?" +
      "response_type=code&" +
      "client_id=" + CILOGON_CLIENT_ID + "&" +
      "state=" + randomState + "&" +
      "redirect_uri=" + redirect_uri + "&" +
      "scope=openid email profile org.cilogon.userinfo";

    if (!document.cookie) {
      localStorage.setItem("login", "false")
      this.setState(state => ({
        logged: false,
        loginType: "",
        accessToken: "",
        user: {}
      }))
    }

    const isBrowser = () => typeof window !== "undefined"
    if (isBrowser()) {
      axios.get("http://" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/server_time").then(
        response => {
          let serverTime = new Date(response.data.time)
          let loginTime = new Date(localStorage.getItem("loginTime"))
          // console.log(serverTime + "-" + loginTime);
          if (!loginTime || loginTime.getTime() < serverTime.getTime()) {
            this.setState(state => ({
              logged: false,
              loginType: "",
              accessToken: "",
              user: {}
            }))
          }
          else if (localStorage.getItem("login") === "true" && localStorage.getItem("loginType") === "CILogon") {
            this.setState(state => ({
              logged: true,
              loginType: "CILogon",
              accessToken: this.state.accessToken,
              user: {
                given: localStorage.getItem("givenName"),
                name: localStorage.getItem("userName"),
                email: localStorage.getItem("currentUser"),
                // picture: response.profileObj.imageUrl
              }
            }))
          }
        },
        error => {
          console.log(error)
          alert("Error obtaining server time.")
        }
      )
    }


  }

  googleLogin(response) {
    if (response.accessToken) {
      this.setState(state => ({
        logged: true,
        loginType: "Google",
        accessToken: response.accessToken,
        user: {
          given: response.profileObj.givenName,
          name: response.profileObj.name,
          email: response.profileObj.email,
          picture: response.profileObj.imageUrl
        }
      }))
      document.cookie = "eduwrench=eduWRENCH"
      localStorage.setItem("loginTime", new Date())
      localStorage.setItem("login", "true")
      localStorage.setItem("loginType", "Google")
      localStorage.setItem("session_id", sessionStorage.getItem("SessionName"))
      localStorage.setItem("currentUser", response.profileObj.email)
      localStorage.setItem("userName", response.profileObj.name)
      localStorage.setItem("userPicture", response.profileObj.imageUrl)
    }
  }

  googleLogout(response) {
    this.setState(state => ({
      logged: false,
      loginType: "",
      accessToken: "",
      user: {}
    }))
    localStorage.setItem("login", "false")
    localStorage.setItem("loginType", "")
    localStorage.setItem("currentUser", "")
    localStorage.setItem("userName", "")
    localStorage.setItem("userPicture", "")
  }

  handleLoginFailure(response) {
    console.log(response)
    alert("Failed to log in")
  }

  handleLogoutFailure(response) {
    alert("Failed to log out")
  }

  cilogin() {
    const width = 600;
    const height = 700;
    const top = window.outerHeight / 2 + window.screenY - height / 2;
    const left = window.outerWidth / 2 + window.screenX - width / 2;

    const child = window.open(this.cilogon_link, '_blank', `width=${width},height=${height},top=${top},left=${left}`);

    window.addEventListener("message", (event) => {

      if (event.source !== child) {
        return; // do not listen to message if not sent from child
      }

      let origin_url = ""
      if (window.location.port === "") {
        origin_url = window.location.protocol + "//" + window.location.hostname
      } else {
        origin_url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port
      }
      if (event.origin !== origin_url) {
        // console.log(`unknown origin ${event.origin}`);
        child.close();
        setTimeout(() => alert("Failed to Sign In. Please try again."), 0);
        return;
      }
      // console.log(event.data);

      let searchStr = String(event.data);
      let searchParams = searchStr.split("&");
      if (searchParams.length !== 2) {
        // did not get code and state back -> invalid
        console.log("invalid sign in");
        child.close();
        setTimeout(() => alert("Failed to Sign In. Please try again."), 0);
        return;
      }

      // console.log(searchParams[0]);
      // console.log(searchParams[1]);

      if (searchParams[0].indexOf('code=') < 0) {
        // first param is not code -> invalid
        console.log("invalid sign in code");
        child.close();
        setTimeout(() => alert("Failed to Sign In. Please try again."), 0);
        return;
      }

      if (searchParams[1].indexOf('state=') < 0) {
        // second param is not state -> invalid
        console.log("invalid sign in state");
        child.close();
        setTimeout(() => alert("Failed to Sign In. Please try again."), 0);
        return;
      }

      let code = searchParams[0].substring(6);
      let state = searchParams[1].substring(6);

      if (state !== randomState) {
        // state values mismatch -> invalid
        console.log("Mismatched state values");
        child.close();
        setTimeout(() => alert("Failed to Sign In. Please try again."), 0);
        return;
      }

      const data = {
        code: code,
        client_id: CILOGON_CLIENT_ID,
        redirect_uri: redirect_uri,
      }

      // console.log(data.code);
      axios.post("http://" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/get/oauth_token", data).then(
        response => {

          if (response.data.access_token) {
            this.setState(state => ({
              accessToken: response.data.access_token,
            }))
            const getUserInfo = {
              accessToken: response.data.access_token,
            }
            return axios.post("http://" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/get/cilogon_userinfo", getUserInfo);
          }
        },
        error => {
          console.log(error);
          child.close();
          setTimeout(() => alert("Failed to Sign In. Please try again."), 0);
          return;
        }
      )
        // use accesstoken to get user info
        .then(
          response => {
            // console.log(response.data);

            this.setState(state => ({
              logged: true,
              loginType: "CILogon",
              user: {
                given: response.data.given_name,
                name: response.data.given_name + " " + response.data.family_name,
                email: response.data.email,
                // picture: response.profileObj.imageUrl
              }
            }))
            document.cookie = "eduwrench=eduWRENCH"
            localStorage.setItem("loginTime", new Date())
            localStorage.setItem("login", "true")
            localStorage.setItem("loginType", "CILogon")
            localStorage.setItem("session_id", sessionStorage.getItem("SessionName"))
            localStorage.setItem("currentUser", response.data.email)
            localStorage.setItem("givenName", response.data.given_name)
            localStorage.setItem("userName", response.data.given_name + " " +  response.data.family_name)
            // localStorage.setItem("userPicture", response.profileObj.imageUrl)
          },
          error => {
            console.log(error);
            child.close();
            setTimeout(() => alert("Failed to Sign In. Please try again."), 0);
            return;
          }
        )

    }, false);

  }

  cilogout() {
    try {
      this.setState(state => ({
        logged: false,
        loginType: "",
        accessToken: "",
        user: {}
      }))
      localStorage.setItem("login", "false")
      localStorage.setItem("loginType", "")
      localStorage.setItem("currentUser", "")
      localStorage.setItem("givenName", "")
      localStorage.setItem("userName", "")
      // localStorage.setItem("userPicture", "")
    } catch (e) {
      console.log(e.message);
      alert("Failed to log out");
    }
  }

  render() {
    return (
      <>
        {this.state.logged ? (

          <Dropdown item style={{ backgroundColor: "#fff", padding: 0, paddingRight: "1em", margin: 0 }} trigger={
            <img className="thumbnail-image"
                 src={this.state.user.picture}
                 alt="user pic"
            />
          }>
            <Dropdown.Menu>
              <Dropdown.Item disabled>
                <strong>{this.state.user.name}</strong><br/>
                <small>{this.state.user.email}</small>
              </Dropdown.Item>
              <Dropdown.Item enabled>
                <a href="/stats" className="grey-link">My EduWRENCH usage</a>
              </Dropdown.Item>
              <Dropdown.Divider/>


              {this.state.loginType === "CILogon" ? (
                <Button className="cilogon sign-out" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500, fontSize: "14px", padding: "10px", margin: 0, color: "#0000008A" }} onClick={this.cilogout}>Sign Out</Button>
              ) : (
                <GoogleLogout
                  clientId={GOOGLE_CLIENT_ID}
                  buttonText="Sign Out"
                  onLogoutSuccess={this.googleLogout}
                  onFailure={this.handleLogoutFailure}
                  className="google sign-out"
                  icon={false}
                >
                </GoogleLogout>
              )}

            </Dropdown.Menu>
          </Dropdown>

        ) : (

          <Dropdown item style={{ backgroundColor: "#fff", padding: 0, paddingRight: "1em", margin: 0, fontSize: '16px', fontFamily: "Roboto, sans-serif", fontWeight: 500 }} text="Sign In">
            <Dropdown.Menu>
              <Dropdown.Item style={{ backgroundColor: "#fff" }} className="sign-in">
                <GoogleLogin
                  clientId={GOOGLE_CLIENT_ID}
                  buttonText="Sign In"
                  onSuccess={this.googleLogin}
                  onFailure={this.handleLoginFailure}
                  cookiePolicy={"single_host_origin"}
                  responseType="code,token"
                  isSignedIn={true}
                  className="google sign-out"
                />
              </Dropdown.Item>
              <Dropdown.Divider/>
              <Dropdown.Item fluid style={{ backgroundColor: "#fff" }} className="sign-in">
                <Button className="cilogon sign-out" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500, fontSize: "14px", color: "#0000008A", textAlign: "center", paddingLeft: "10px" }} onClick={this.cilogin}>
                  <StaticImage
                    src="../images/cilogon.png"
                    style={{
                      width: 20,
                      height: 20,
                      // marginRight: "10px",
                      // padding: "10px 10px 10px 10px",
                    }}
                    alt="CILogon"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  Sign In&nbsp;&nbsp;&nbsp;
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        )}
      </>
    )
  }

}

export default SignIn
