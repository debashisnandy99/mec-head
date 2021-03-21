import * as React from "react"
import { Link, navigate } from "gatsby"
import { logout} from "../../../services/auth"

import { Nav, Container, Row, Col,Button } from "react-bootstrap"

const HeaderPage = () => {
  return (
    <div>
      <Container fluid>
        <Row className="pl-5 pt-4">
          <Col md={6}>
          <h2 >MEC ADMIN</h2>
          </Col>
          <Col md={6} className="text-right">
          <Button onClick={() => logout()} variant="dark">Logout</Button>
          </Col>
        </Row>
      </Container>
      <ul className="nav nav-tabs nav-fill">
        <li className="nav-item">
          <Link
            className={
              "nav-link " + (window.location.pathname === `/` ? "active" : "")
            }
            to="/"
          >
            Pending
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={
              "nav-link " +
              (window.location.pathname === `/verified` ? "active" : "")
            }
            to="/verified"
          >
            Verified
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={
              "nav-link " +
              (window.location.pathname === `/failed` ? "active" : "")
            }
            to="/failed"
          >
            Failed
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default HeaderPage
