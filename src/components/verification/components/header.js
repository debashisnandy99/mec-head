import React, { useState, useEffect } from "react"
import {
  Container,
  Navbar,
  Row,
  Col,
  Button,
  Dropdown,
  Spinner,
} from "react-bootstrap"
import LeftPage from "./left"
import RightPage from "./right"
import axios from "../../../services/api"
import {
  getUser,
  isLoggedIn,
  logout,
  handleLogin,
} from "../../../services/auth"
import * as ProfileCss from "./header.module.css"

const HeaderPage = () => {
  const [navOptions, setNavOptions] = useState(0)
  const [user, setUser] = useState()
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const updateDimensions = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }
  useEffect(() => {
    window.addEventListener("resize", updateDimensions)
    console.log(`Bearer ${getUser().token}`)
    axios
      .get("/admin/user", {
        headers: {
          "content-type": "multipart/formdata",
          Authorization: `Bearer ${getUser().token}`,
        },
      })
      .then(user => {
        setUser(user.data)
      })
      .catch(err => {
        setUser(undefined)
      })
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  
  return (
    <div className={`full-container`}>
      <Navbar className={`${ProfileCss.navBg} py-3`} expand="lg">
        <Navbar.Text
          style={{
            color: "black !important",
            fontWeight: "bold ",
          }}
        >
          MEC Admin Dashboard
        </Navbar.Text>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Dropdown>
              <Dropdown.Toggle className={ProfileCss.dropdown}>
                Hi,{" "}
                <span className={ProfileCss.boldText}>
                  {!user ? ".........." : user.name}
                </span>{" "}
                <span className={ProfileCss.nameBox}>
                  {!user ? "." : user.name.substring(0, 1)}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Container className="mt-4">
        {!user ? (
          <Spinner
            style={{
              top: "50%",
              left: "50%",
              position: "absolute",
            }}
            animation="grow"
          />
        ) : (
          <Row>
            <Col md={3}>
              <LeftPage
                user={user}
                currentNav={navOptions}
                changeNavListener={idx => setNavOptions(idx)}
              />
            </Col>
            <Col md={9}>
              <RightPage currentNav={navOptions} />
            </Col>
          </Row>
        )}
      </Container>
      <footer
        style={{
          position:  "relative",
          left: 0,
          bottom: 0,
        }}
      >
        <Container>
          <Row className="py-4">
            <Col>2020 &copy; Ankur Biswas</Col>
          </Row>
        </Container>
      </footer>
    </div>
  )
}

export default HeaderPage
