import * as React from "react"
import { Spinner } from "react-bootstrap"

const Loading = () => (
  <div style={{
    height: "100%"
  }} className="d-flex align-items-center justify-content-center">
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </div>
)

export default Loading
