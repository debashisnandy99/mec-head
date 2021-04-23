import * as React from "react"
import LoginPage from "../components/login/login"
import HeaderPage from "../components/verification/components/header"
import { navigate } from "gatsby"
import { getUser, isLoggedIn, logout, handleLogin } from "../services/auth"

const IndexPage = () => {
  if (!isLoggedIn()) {
    if (typeof window !== `undefined`) {
      navigate("/", {
        replace: true,
      })
    }
  } else {
    return <HeaderPage />
  }
  return <div></div>
}

export default IndexPage
