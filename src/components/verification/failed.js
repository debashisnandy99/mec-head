import React, { useState } from "react"
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Pagination,
  Table,
} from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import Header from "./components/header"
import Loading from "./components/loading"
import NoDataFound from "./components/nodatafound"
import axios from "../../services/api"
import UserProfile from "./components/userprofile"
import { url } from "../../services/details"
import { getUser, isLoggedIn, logout, handleLogin } from "../../services/auth"
import * as PendingStyles from "./pending.module.css"

class FailedPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 1,
      isLoading: true,
      users: [],
      totalNumber: 0,
      items: [],
      isEmpty: true,
      user: undefined,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    axios
      .get("/admin/pendingVerification?page=" + this.state.active, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${getUser().token}`,
          Docs: "failed",
        },
      })
      .then(res => {
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
        console.log(e)
      })
  }

  verifyUserDocsForm = uid => {
    axios
      .post(
        "/admin/verifyandstore",
        {
          uid: uid,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
        }
      )
      .then(res => {
        this.getData()
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
    console.log(this.state.users)
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
                          this.setState({
                            user: undefined,
                          })
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
                {this.state.user ? (
                  <UserProfile
                    verifyUserDocsForm={uid => this.verifyUserDocsForm(uid)}
                    user={this.state.user}
                    backToHome={() => {}}
                  ></UserProfile>
                ) : this.state.users.length == 0 ? (
                  <p className="text-center">No Data Found</p>
                ) : (
                  <Table responsive className="bg-white pointerCursor">
                    <thead>
                      <tr>
                        <th>#</th>
                        {["Name", "Phone", "Status"].map((value, index) => (
                          <th key={index}>{value}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.users.map((value, index) => (
                        <tr
                          key={index}
                          onClick={() => {
                            console.log(value)
                            this.setState({
                              user: value,
                            })
                          }}
                        >
                          <td>{index}</td>
                          <td>{value.name}</td>
                          <td>{value.phone}</td>
                          <td>Failed</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Col>
              {/* {this.state.users.map(value => (
                
              ))} */}
            </Row>
            {this.state.user ? (
              <></>
            ) : Math.ceil(this.state.totalNumber / 2) === 1 ? (
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
      </>
    )
  }
}

export default FailedPage
