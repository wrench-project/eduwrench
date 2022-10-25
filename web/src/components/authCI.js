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

  login() {
    const width = 600;
    const height = 700;
    const top = window.outerHeight / 2 + window.screenY - height / 2;
    const left = window.outerWidth / 2 + window.screenX - width / 2;

    const child = window.open(this.cilogon_link, '_blank', `width=${width},height=${height},top=${top},left=${left}`);

    window.addEventListener("message", (event) => {
      if (event.origin !== "https://eduwrench.org" && event.origin !== "http://localhost:8000") {
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
        client_id: CLIENT_ID,
        redirect_uri: redirect_uri,
      }

      // console.log(data.code);
      axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/get/oauth_token", data).then(
        response => {

          if (response.data.access_token) {
            this.setState(state => ({
              accessToken: response.data.access_token,
            }))
            const getUserInfo = {
              accessToken: response.data.access_token,
            }
            return axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/get/cilogon_userinfo", getUserInfo);
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
            console.log(response.data);

            this.setState(state => ({
              logged: true,
              user: {
                given: response.data.given_name,
                name: response.data.given_name + response.data.family_name,
                email: response.data.email,
                // picture: response.profileObj.imageUrl
              }
            }))
            document.cookie = "eduwrench=eduWRENCH"
            localStorage.setItem("loginTime", new Date())
            localStorage.setItem("login", "true")
            localStorage.setItem("session_id", sessionStorage.getItem("SessionName"))
            localStorage.setItem("currentUser", response.data.email)
            localStorage.setItem("userName", response.data.given_name + response.data.family_name)
            // localStorage.setItem("userPicture", response.profileObj.imageUrl)
          },
          error => {
            console.log(error);
            child.close();
            setTimeout(() => alert("Failed to Sign In. Please try again."), 0);
            return;
          }
        )

    }, { once: true });

  }

  logout() {
    try {
      this.setState(state => ({
        logged: false,
        accessToken: "",
        user: {}
      }))
      localStorage.setItem("login", "false")
      localStorage.setItem("currentUser", "")
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
              <Button className="cilogon sign-out" onClick={this.logout}>Sign Out</Button>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Menu.Item style={{ backgroundColor: "#fff" }} className="sign-in">
            <Button className="cilogon sign-out" onClick={this.login}>Sign In</Button>
          </Menu.Item>
        )}
      </>
    )
  }
}

export default AuthCI


