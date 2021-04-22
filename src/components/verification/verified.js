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
import UserProfile from "./components/userprofile"
import axios from "../../services/api"
import { url } from "../../services/details"
import { getUser, isLoggedIn, logout, handleLogin } from "../../services/auth"
import * as PendingStyles from "./pending.module.css"

class VerifiedPage extends React.Component {
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
          Docs: "verified",
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
                {this.state.user ? (
                  <UserProfile
                 
                    user={this.state.user}
                  ></UserProfile>
                ) : (
                  <Table responsive className="bg-white pointerCursor">
                    <thead>
                      <tr>
                        <th>#</th>
                        {["Name", "Phone Number", "Status"].map(
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
                          <tr
                          key={index}
                          onClick={() => {
                            this.setState({
                              user: user,
                            })
                          }}
                          >
                            <td>{index}</td>
                            <td>{user.name}</td>
                            <td>+91 {user.phone}</td>
                            <td>Verified</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                )}
              </Col>
              {/* {this.state.docs.map(value => (
                
              ))} */}
            </Row>
            {this.state.user ? (
              <></>
            ) : this.state.items.length === 1 ? (
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

export default VerifiedPage
