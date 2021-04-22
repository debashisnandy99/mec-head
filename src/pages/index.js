import * as React from "react"
import LoginPage from "../components/login/login"
import HeaderPage from "../components/verification/components/header"
import { getUser, isLoggedIn, logout, handleLogin } from "../services/auth"

const IndexPage = () => {
  if (!isLoggedIn()) {
    return <LoginPage />
  }
  return <HeaderPage />
}

export default IndexPage
