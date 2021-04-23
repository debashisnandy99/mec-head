import React, { useState } from "react"
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Pagination,
  Table,
  Form,
  Modal,
} from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import Header from "./components/header"
import Loading from "./components/loading"
import NoDataFound from "./components/nodatafound"
import UserProfile from "./components/userprofile"
import SubmitModal from "./components/submitmodal"
import axios from "../../services/api"
import { url } from "../../services/details"
import { getUser, isLoggedIn, logout, handleLogin } from "../../services/auth"
import * as PendingStyles from "./pending.module.css"

class PendingIssuePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 1,
      isLoading: true,
      users: [],
      totalNumber: 0,
      items: [],
      isEmpty: true,
      modalShow: false,
      uid: "",
      errorMessage: "",
      user: undefined,
      modalShow: false,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    axios
      .get("/admin/mecGetPendingCard?page=" + this.state.active, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${getUser().token}`,
          Docs: "pending",
        },
      })
      .then(res => {
        console.log(res.data)
        let items = []
        for (let number = 1; number <= res.data.totalItem; number++) {
          items.push(
            <Pagination.Item key={number} active={number === this.state.active}>
              {number}
            </Pagination.Item>
          )
        }
        this.setState({
          isLoading: false,
          users: [...res.data.users],
          items: [...items],
          totalNumber: res.data.totalItem,
          isEmpty: false,
          user: undefined,
        })
      })
      .catch(e => {
        if (e.response) {
          if (e.response.data.message === "jwt expired") {
            logout()
          }
        }
      })
  }



  render() {
    return (
      <>
        {this.state.isLoading ? (
          <Loading />
        ) : this.state.isEmpty ? (
          <NoDataFound />
        ) : (
          <Container>
            {this.state.user ? (
              <Row className="mb-3">
                <Col>
                  <Card>
                    <Card.Body>
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="pointerCursor"
                        style={{
                          height: "20px",
                          width: "20px",
                        }}
                        onClick={() => {
                          this.getData()
                        }}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : (
              <></>
            )}
            <Row>
              <Col>
                <Table responsive className="bg-white pointerCursor">
                  <thead>
                    <tr>
                      <th>#</th>
                      {["Name", "Phone Number", "Status", ""].map(
                        (value, index) => (
                          <th key={index}>{value}</th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.users.map((user, index) => {
                      console.log(user)
                      return (
                        <tr key={index}>
                          <td>{index}</td>
                          <td>{user.name}</td>
                          <td>+91 {user.phone}</td>
                          <td>Pending</td>
                          <td>
                            <Button
                              onClick={() => {
                                this.setState({
                                  modalShow: true,
                                  user: user._id,
                                })
                              }}
                              variant="success"
                              size="sm"
                            >
                              Issue Card
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Col>
              {/* {this.state.docs.map(value => (
                
              ))} */}
            </Row>

            {Math.ceil(this.state.totalNumber / 2) === 1 ? (
              <></>
            ) : (
              <Row>
                <Col sm={12} className="text-right">
                  <Pagination>{this.state.items}</Pagination>
                </Col>
              </Row>
            )}
          </Container>
        )}
        <FormMecEnter
          show={this.state.modalShow}
          refreshData={() => {
            this.setState({
              modalShow: false,
              user: undefined,
            })
            this.getData()
          }}
          uid={this.state.user}
          onHide={() => this.setState({ modalShow: false, user: undefined })}
        />
      </>
    )
  }
}

function FormMecEnter(props) {
  const [mecCard, setMecCard] = useState("")
  const [isInvalid, setIsInvalid] = useState(false)

  const attachMec = () => {
    console.log(mecCard)
    if (mecCard.length > 0) {
      axios
        .post(
          "/admin/issueMecCard",
          {
            uid: props.uid,
            mec: mecCard,
          },
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${getUser().token}`,
            },
          }
        )
        .then(res => {
          setIsInvalid(false)
          props.refreshData()
        })
        .catch(err => {
          setIsInvalid(true)
        })
    } else {
      setIsInvalid(true)
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Attach MEC Card
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              isInvalid={isInvalid}
              value={mecCard}
              onChange={val => setMecCard(val.target.value)}
              type="text"
              placeholder="MEC Card Number"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={attachMec}>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PendingIssuePage
