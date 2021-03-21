import * as React from "react"
import LoginPage from "../../components/login/login"
import VerifiedPage from "../../components/verification/verified"
import { getUser, isLoggedIn, logout, handleLogin } from "../../services/auth"

const VerifiedIndexPage = () => {
  if (!isLoggedIn()) {
    return <LoginPage />
  }
  return <VerifiedPage />
}

export default VerifiedIndexPage
