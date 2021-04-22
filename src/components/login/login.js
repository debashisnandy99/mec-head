import React, { useState } from "react"
import { navigate } from "gatsby"
import {
  Col,
  Container,
  Row,
  Button,
  Form,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap"
import { getUser, isLoggedIn, logout, handleLogin } from "../../services/auth"

const LoginPage = () => {
  const [validated, setValidated] = useState(false)
  const [sendingData, setSendingDataStatus] = useState(false)
  const [wentWrong, setVaidationStatus] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = event => {
    const form = event.currentTarget
    setSendingDataStatus(true)

    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
      setSendingDataStatus(false)
    } else {
      event.preventDefault()
      event.stopPropagation()
      handleLogin(event.target.uname.value, event.target.password.value)
        .then(value => {
          if (value.message) {
            setErrorMessage(value.message)
            setVaidationStatus(true)
          } else {
            navigate("/", {
              replace: true,
            })
            setErrorMessage("")
            setVaidationStatus(false)
          }
          setSendingDataStatus(false)
          event.target.reset()
        })
        .catch(e => {
          setErrorMessage("Something went wrong")
          setVaidationStatus(true)
          setSendingDataStatus(false)
        })
      setValidated(false)
    }
  }
  return (
    <div className="full-height login-back">
      <div className="full-overlay">
        <Container>
          {wentWrong ? (
            <Row className="pb-2">
              <Col xs={{ span: 6, offset: 3 }}>
                <Alert variant="danger">{errorMessage}</Alert>
              </Col>
            </Row>
          ) : (
            <div></div>
          )}
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Card className="shadow p-3 mb-5 bg-white rounded">
               
                  <h4 className="text-center py-3">Admin MEC Panel</h4>
  
                <Card.Body>
                  <Container>
                    <Row>
                      <Col>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleSubmit}
                        >
                          <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                              required
                              id="uname"
                              type="text"
                              placeholder="Enter email"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter valid name.
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              required
                              id="password"
                              type="password"
                              placeholder="Password"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter valid password.
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Button variant="primary" type="submit">
                            {sendingData ? (
                              <Spinner
                                animation="border"
                                role="status"
                                size="sm"
                                className="mx-4"
                              >
                                <span className="sr-only">Loading...</span>
                              </Spinner>
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default LoginPage
