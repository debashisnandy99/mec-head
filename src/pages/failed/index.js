import * as React from "react"
import LoginPage from "../../components/login/login"
import FailedPage from "../../components/verification/failed"
import { getUser, isLoggedIn, logout, handleLogin } from "../../services/auth"

const FailedIndexPage = () => {
  if (!isLoggedIn()) {
    return <LoginPage />
  }
  return <FailedPage />
}

export default FailedIndexPage
