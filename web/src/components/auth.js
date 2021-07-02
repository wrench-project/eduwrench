import React, { Component } from "react"
import { GoogleLogin, GoogleLogout } from "react-google-login"
import "./auth.css"

const CLIENT_ID =
  "1043042177326-hr8cj7m89j8s8i4bopgm9pkkllr4dedf.apps.googleusercontent.com"

class Auth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLogined: false,
      accessToken: "",
      currentUser: ""
    }

    this.login = this.login.bind(this)
    this.handleLoginFailure = this.handleLoginFailure.bind(this)
    this.logout = this.logout.bind(this)
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this)
  }

  storeUser = () => {
    localStorage.setItem("currentUser", this.state.currentUser)
  }

  login(response) {
    if (response.accessToken) {
      this.setState(state => ({
        isLogined: true,
        accessToken: response.accessToken
      }))
      localStorage.setItem("login", "true")
    }
  }

  handleLogin = async googleData => {
    if (googleData.accessToken) {
      this.setState(state => ({
        isLogined: true,
        accessToken: googleData.accessToken
      }))
      localStorage.setItem("login", "true")
    }
    const res = await fetch("http://localhost:3000/auth/google", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await res.json()
    this.setState(state => ({ currentUser: data.email }))
    this.storeUser()
  }

  logout(response) {
    this.setState(state => ({
      isLogined: false,
      accessToken: "",
      currentUser: ""
    }))
    localStorage.setItem("login", "false")
    localStorage.setItem("currentUser", "")
  }

  handleLoginFailure(response) {
    alert("Failed to log in")
  }

  handleLogoutFailure(response) {
    alert("Failed to log out")
  }

  render() {
    return (
      <div>
        {this.state.isLogined ? (
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.logout}
            onFailure={this.handleLogoutFailure}
            className="google"
          ></GoogleLogout>
        ) : (
          <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Login"
            //onSuccess={this.login}
            onSuccess={this.handleLogin}
            onFailure={this.handleLoginFailure}
            cookiePolicy={"single_host_origin"}
            responseType="code,token"
            isSignedIn={true}
            className="google"
          />
        )}
      </div>
    )
  }
}

export default Auth
