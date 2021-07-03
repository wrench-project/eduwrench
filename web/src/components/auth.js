import React, { Component } from "react"
import { GoogleLogin, GoogleLogout } from "react-google-login"
// import { NavDropdown, Dropdown } from "react-bootstrap"
import { Dropdown, Menu } from "semantic-ui-react"
import "./auth.css"

const CLIENT_ID =
  "1043042177326-hr8cj7m89j8s8i4bopgm9pkkllr4dedf.apps.googleusercontent.com"

class Auth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logged: false,
      accessToken: ""
    }

    this.login = this.login.bind(this)
    this.handleLoginFailure = this.handleLoginFailure.bind(this)
    this.logout = this.logout.bind(this)
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this)
  }

  login(response) {
    if (response.accessToken) {
      this.setState(state => ({
        logged: true,
        accessToken: response.accessToken,
        user: {
          given: response.profileObj.givenName,
          name: response.profileObj.name,
          email: response.profileObj.email,
          picture: response.profileObj.imageUrl
        }
      }))
      localStorage.setItem("login", "true")
      localStorage.setItem("currentUser", response.profileObj.email)
      localStorage.setItem("userName", response.profileObj.name)
      localStorage.setItem("userPicture", response.profileObj.imageUrl)
    }
  }

  logout(response) {
    this.setState(state => ({
      logged: false,
      accessToken: "",
      user: {}
    }))
    localStorage.setItem("login", "false")
    localStorage.setItem("currentUser", "")
    localStorage.setItem("userName", "")
    localStorage.setItem("userPicture", "")
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
        <Menu.Menu position="right">
          {this.state.logged ? (
            <Dropdown item style={{ backgroundColor: "#fff", padding: 0, paddingRight: "1em", margin: 0 }} text={
              <div className="pull-left">
                <img className="thumbnail-image"
                     src={this.state.user.picture}
                     alt="user pic"
                />
              </div>
            }>
              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  <strong>{this.state.user.name}</strong><br />
                  <small>{this.state.user.email}</small>
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
            <Menu.Item style={{ backgroundColor: "#fff" }}>
              <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Login"
                onSuccess={this.login}
                onFailure={this.handleLoginFailure}
                cookiePolicy={"single_host_origin"}
                responseType="code,token"
                isSignedIn={true}
                className="google sign-out"
              />
            </Menu.Item>
          )}
        </Menu.Menu>
      </>
    )
  }
}

export default Auth
