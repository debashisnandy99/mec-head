import React, { useState } from "react"
import { Container, Button, Row, Col, Card, Pagination } from "react-bootstrap"
import Header from "./components/header"
import Loading from "./components/loading"
import NoDataFound from "./components/nodatafound"
import axios from "../../services/api"
import { url } from "../../services/details"
import { getUser, isLoggedIn, logout, handleLogin } from "../../services/auth"
import * as PendingStyles from "./pending.module.css"

class FailedPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 1,
      isLoading: true,
      docs: [],
      totalNumber: 0,
      items: [],
      isEmpty: true,
    }
  }

  componentDidMount() {
    axios
      .get("/verifier/getlist?page=" + this.state.active, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${getUser().token}`,
          Docs: "fail",
        },
      })
      .then(res => {
        let items = []
        for (let number = 1; number <= res.data.doc.totalItems; number++) {
          items.push(
            <Pagination.Item key={number} active={number === this.state.active}>
              {number}
            </Pagination.Item>
          )
        }
        this.setState({
          isLoading: false,
          docs: [...res.data.doc.docs],
          items: [...items],
          totalNumber: res.data.doc.totalItems,
          isEmpty: false,
        })
      })
      .catch(e => {
        console.log(e.response.data)
      })
  }

  render() {
    return (
      <>
        <Header />
        {this.state.isLoading ? (
          <Loading />
        ) : this.state.isEmpty ? (
          <NoDataFound />
        ) : (
          <Container>
            <Row>
              {this.state.docs.map(value => (
                <Col sm={12} key={value._id}>
                  <Card className="my-4">
                    <Card.Header>
                      <Container>
                        <Row>
                          <Col md={4}>
                            <Card.Img
                              variant="top"
                              height="250"
                              src={`${url()}/${value.user.photo}`}
                            />
                          </Col>
                          <Col md={4}>
                            <div className="mt-2">
                              <p className={PendingStyles.pTag}>
                                {value.user.name}
                              </p>
                              <p className={PendingStyles.pTag}>
                                DOB : {value.user.dob}
                              </p>
                              <p className={PendingStyles.pTag}>
                                DOC ID : {value.docId}
                              </p>
                              <Card style={{ width: "10rem" }} className="mt-4">
                                <Card.Img
                                  variant="top"
                                  width="300"
                                  height="90"
                                  src={`${url()}/${value.user.signature}`}
                                />
                                <Card.Title className="h6 mt-1 mx-auto">
                                  Signature
                                </Card.Title>
                              </Card>
                            </div>
                          </Col>
                          <Col md={4}>
                            <Card.Img
                              variant="top"
                              height="250"
                              src={`${url()}/${value.file}`}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>Details</Card.Title>
                      <Container>
                        <Row>
                          <Col md={6}>
                            <div className="mt-3">
                              <Row>
                                <Col md={6}>
                                  <span className={PendingStyles.spanTagHeader}>
                                    Fathers Name :
                                  </span>
                                </Col>
                                <Col md="auto">
                                  <span>{value.user.fathersName}</span>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <span className={PendingStyles.spanTagHeader}>
                                    Mothers Name :
                                  </span>
                                </Col>
                                <Col md="auto">
                                  <span>{value.user.mothersName}</span>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <span className={PendingStyles.spanTagHeader}>
                                    Address :
                                  </span>
                                </Col>
                                <Col md="auto">
                                  <span>{value.user.address}</span>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <span className={PendingStyles.spanTagHeader}>
                                    Phone :{" "}
                                  </span>
                                </Col>
                                <Col md="auto">
                                  <span>+91 {value.user.phone}</span>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <span className={PendingStyles.spanTagHeader}>
                                    Email :{" "}
                                  </span>
                                </Col>
                                <Col md="auto">
                                  <span>
                                    {value.user.email ? value.user.email : ""}
                                  </span>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                          <Col md={{ span: 3, offset: 3 }}>
                            <Button variant="primary" size="lg" block>
                              Verify
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Row>
              <Col sm={12} className="text-right">
                <Pagination>{this.state.items}</Pagination>
              </Col>
            </Row>
          </Container>
        )}
      </>
    )
  }
}

export default FailedPage
