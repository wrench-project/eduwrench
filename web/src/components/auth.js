import React, { Component } from "react"
import axios from "axios"
import { GoogleLogin, GoogleLogout } from "react-google-login"
import { Dropdown, Menu } from "semantic-ui-react"
import "./auth.css"

const CLIENT_ID =
  "1043042177326-hr8cj7m89j8s8i4bopgm9pkkllr4dedf.apps.googleusercontent.com"

class Auth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logged: false,
      loginType: "",
      accessToken: ""
    }

    this.login = this.login.bind(this)
    this.handleLoginFailure = this.handleLoginFailure.bind(this)
    this.logout = this.logout.bind(this)
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this)

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
      axios.get(window.location.protocol + "//" + window.location.hostname + ":3000/server_time").then(
          response => {
            let serverTime = new Date(response.data.time)
            let loginTime = new Date(localStorage.getItem("loginTime"))
            if (!loginTime || loginTime.getTime() < serverTime.getTime()) {
              this.setState(state => ({
                logged: false,
                loginType: "",
                accessToken: "",
                user: {}
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

  login(response) {
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
      this.props.signedIn()
    }
  }

  logout(response) {
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
    this.props.signedIn()
  }

  handleLoginFailure(response) {
    alert("Failed to log in")
  }

  handleLogoutFailure(response) {
    alert("Failed to log out")
  }

  render() {
    return (
      <>
          {(this.state.logged && this.state.loginType === "Google") ? (
            <Dropdown item style={{ backgroundColor: "#fff", padding: 0, paddingRight: "1em", margin: 0 }} trigger={
                <img className="thumbnail-image"
                     src={this.state.user.picture}
                     alt="user pic"
                />
            }>
              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  <strong>{this.state.user.name}</strong><br />
                  <small>{this.state.user.email}</small>
                </Dropdown.Item>
                <Dropdown.Item enabled>
                  <a href="/stats" className="grey-link">My EduWRENCH usage</a>
                </Dropdown.Item>
                <Dropdown.Divider />
                <GoogleLogout
                  clientId={CLIENT_ID}
                  buttonText="Sign Out"
                  onLogoutSuccess={this.logout}
                  onFailure={this.handleLogoutFailure}
                  className="google sign-out"
                  icon={false}
                >
                </GoogleLogout>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Menu.Item style={{ backgroundColor: "#fff" }} className="sign-in">
              <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Sign In"
                onSuccess={this.login}
                onFailure={this.handleLoginFailure}
                cookiePolicy={"single_host_origin"}
                responseType="code,token"
                isSignedIn={true}
                className="google sign-out"
              />
            </Menu.Item>
          )}
      </>
    )
  }
}

export default Auth
