import React, { Component } from "react"
import axios from "axios"
import { Button, Dropdown, Menu } from "semantic-ui-react"
import "./auth.css"
import { nanoid } from "nanoid";

const CLIENT_ID =
  "cilogon:/client_id/b5deb22f68b35d12084368473a0881a"
const CLIENT_SECRET = "DOOJf_Ubo7_1Z-lKYy5wkPPL5Qr9Uu6nbLVbHWaDYkz75yQIYFvt3Psdv5YW8gcweQlYlhDrU_IRyyTV1jA6yA"
const redirect_uri = "http://localhost:8000/callback"
// generate random state value
const randomState = nanoid(20);

class AuthCI extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logged: false,
      accessToken: ""
    }



    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.cilogon_link = "https://cilogon.org/authorize" + "?" +
      "response_type=code&" +
      "client_id=" + CLIENT_ID + "&" +
      "state=" + randomState + "&" +
      "redirect_uri=" + redirect_uri + "&" +
      "scope=openid email profile org.cilogon.userinfo";

    if (!document.cookie) {
      localStorage.setItem("login", "false")
      this.setState(state => ({
        logged: false,
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
    const width = 600;
    const height = 700;
    const top = window.outerHeight / 2 + window.screenY - height / 2;
    const left = window.outerWidth / 2 + window.screenX - width / 2;

    const child = window.open(this.cilogon_link, 'cilogon', `width=${width},height=${height},top=${top},left=${left}`);

    window.addEventListener("message", (event) => {
      if (event.origin !== "https://eduwrench.org" && event.origin !== "http://localhost:8000") {
        console.log(`unknown origin ${event.origin}`);
        return;
      }
      // console.log(event.data);

      let searchStr = String(event.data);
      let searchParams = searchStr.split("&");
      if (searchParams.length !== 2) {
        // did not get code and state back -> invalid
        alert("Invalid Sign In. Please try again.");
        return;
      }

      // console.log(searchParams[0]);
      // console.log(searchParams[1]);

      if (searchParams[0].indexOf('code=') < 0) {
        // first param is not code -> invalid
        alert("Invalid Sign In Code. Please try again. 2");
        return;
      }

      if (searchParams[1].indexOf('state=') < 0) {
        // second param is not state -> invalid
        alert("Invalid Sign In State. Please try again. 3");
        return;
      }

      let code = searchParams[0].substring(6);
      let state = searchParams[1].substring(6);

      // console.log(code);
      if (state !== randomState) {
        // state values mismatch -> invalid
        alert("Mismatched state values. Please try signing in again.");
        return;
      }

      const data = {
        code: code,
        client_id: CLIENT_ID,
        redirect_uri: redirect_uri,
      }

      // console.log(data.code);
      axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/get/oauth_token", data).then(
        response => {
          // console.log(response.data);
          // console.log(response.data.access_token);

          if (response.data.access_token) {
            this.setState(state => ({
              logged: true,
              accessToken: response.data.access_token,
            }))
            const getUserInfo = {
              accessToken: response.data.access_token,
            }
            return axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/get/cilogon_userinfo", getUserInfo);
          }
        },
        error => {
          console.log(error)
          alert("Error logging in.")
        }
      )
        // use accesstoken to get user info
        .then(
          response => {
            console.log(response.data);
            // console.log(response.data.access_token);

          },
          error => {
            console.log(error)
            alert("Error logging in.")
          }
        )

      // console.log(accessToken);
      //
      // if (accessToken !== "") {
      //   const getUserInfo = {
      //     accessToken: accessToken,
      //   }
      //
      //   axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/get/cilogon_userinfo", getUserInfo).then(
      //     response => {
      //       console.log(response.data)
      //     },
      //     error => {
      //       console.log(error)
      //       alert("Error getting CILogon User Info.")
      //     }
      //   )
      // }

    }, false);

  }

  login1(response) {

    // if (response.accessToken) {
    //   this.setState(state => ({
    //     logged: true,
    //     accessToken: response.accessToken,
    //     user: {
    //       given: response.profileObj.givenName,
    //       name: response.profileObj.name,
    //       email: response.profileObj.email,
    //       picture: response.profileObj.imageUrl
    //     }
    //   }))
    //   document.cookie = "eduwrench=eduWRENCH"
    //   localStorage.setItem("loginTime", new Date())
    //   localStorage.setItem("login", "true")
    //   localStorage.setItem("session_id", sessionStorage.getItem("SessionName"))
    //   localStorage.setItem("currentUser", response.profileObj.email)
    //   localStorage.setItem("userName", response.profileObj.name)
    //   localStorage.setItem("userPicture", response.profileObj.imageUrl)
    // } else {
    //   alert("Failed to log in")
    // }
  }

  logout() {
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

  render() {
    return (
      <>
        <Menu.Menu position="right">
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
                <Button onClick={this.logout}></Button>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Menu.Item style={{ backgroundColor: "#fff" }} className="sign-in">
              <Button color='red' onClick={this.login}>Login</Button>
            </Menu.Item>
          )}
        </Menu.Menu>
      </>
    )
  }
}

export default AuthCI


