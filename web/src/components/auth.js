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
    }

    this.login = this.login.bind(this)
    this.handleLoginFailure = this.handleLoginFailure.bind(this)
    this.logout = this.logout.bind(this)
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this)
  }

  login(response) {
    if (response.accessToken) {
      this.setState(state => ({
        isLogined: true,
        accessToken: response.accessToken,
      }))
    }
  }

  logout(response) {
    this.setState(state => ({
      isLogined: false,
      accessToken: "",
    }))
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
            onSuccess={this.login}
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
