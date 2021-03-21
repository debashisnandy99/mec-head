import React, { useState } from "react"
import { Container, Button, Row, Alert, Modal, Form } from "react-bootstrap"

const SubmitModal = props => {
  const [validated, setValidated] = useState(false)

  const handleSubmit = event => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity() === false) {
      setValidated(true)
    } else {
      props.verifyUserDocsForm(event)
      setValidated(false)
    }
  }

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Verify User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.errorMessage !== "" ? (
            <Alert variant="danger">{props.errorMessage}</Alert>
          ) : (
            <></>
          )}
          <Form.Group>
            <Form.Label>Upload SoftCopy</Form.Label>
            <br></br>
            <Form.Control
              className="form-control"
              required
              type="file"
              id="image"
            />
            <Form.Control.Feedback type="invalid">
              Please softcopy copy.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <Button type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
export default SubmitModal
