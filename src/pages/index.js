import * as React from "react"
import LoginPage from "../components/login/login"
import HeaderPage from "../components/verification/components/header"
import { getUser, isLoggedIn, logout, handleLogin } from "../services/auth"
import { navigate } from "gatsby"

const IndexPage = () => {
  if (isLoggedIn()) {
    if (typeof window !== `undefined`) {
      navigate("/home", {
        replace: true,
      })
    }
  } else {
    return <LoginPage />
  }
  return <div></div>
}

export default IndexPage
