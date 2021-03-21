import * as React from "react"
import LoginPage from "../components/login/login"
import PendingPage from "../components/verification/pending"
import { getUser, isLoggedIn, logout, handleLogin } from "../services/auth"

const IndexPage = () => {
  if (!isLoggedIn()) {
    return <LoginPage />
  }
  return <PendingPage />
}

export default IndexPage
