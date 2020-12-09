import React from "react"
import { GoogleLogout } from "react-google-login"

const clientId =
  "1043042177326-hr8cj7m89j8s8i4bopgm9pkkllr4dedf.apps.googleusercontent.com"

function Logout() {
  const onSuccess = () => {
    console.log("Logout made successfully")
    alert("Logout made successfully ✌")
  }

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  )
}

export default Logout
