import * as React from "react"
import PendingPage from "../pending"
import FailedPage from "../failed"
import VerifiedPage from "../verified"
import PedingIssuePage from "../pendingissuecard"
import IssuePage from "../issuedcard"

const RightPage = ({ currentNav }) => {
  switch (currentNav) {
    case 0:
      return <PendingPage />
    case 1:
      return <FailedPage />
    case 2:
      return <VerifiedPage />
    case 3:
      return <PedingIssuePage />
    case 4:
      return <IssuePage />
    default:
      break
  }
}

export default RightPage
