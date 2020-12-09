import React from "react"

import { GoogleLogin } from "react-google-login"
// refresh token

const clientId =
  "1043042177326-hr8cj7m89j8s8i4bopgm9pkkllr4dedf.apps.googleusercontent.com"

function Login() {
  const onSuccess = res => {
    console.log("Login Success: currentUser:", res.profileObj)
    alert(
      `Logged in successfully, welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    )
  }

  const onFailure = res => {
    console.log("Login failed: res:", res)
    alert(`Failed to login.`)
  }

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        style={{ marginTop: "100px" }}
        isSignedIn={true}
      />
    </div>
  )
}

export default Login
