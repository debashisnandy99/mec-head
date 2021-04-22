import * as React from "react"
import PendingPage from "../pending"
import FailedPage from "../failed"
import VerifiedPage from "../verified"

const RightPage = ({ currentNav }) => {
  switch (currentNav) {
    case 0:
      return <PendingPage />
    case 1:
      return <FailedPage />
    case 2:
      return <VerifiedPage />
    default:
      break
  }
}

export default RightPage
