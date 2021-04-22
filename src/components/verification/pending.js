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
import SubmitModal from "./components/submitmodal"
import axios from "../../services/api"
import { url } from "../../services/details"
import { getUser, isLoggedIn, logout, handleLogin } from "../../services/auth"
import * as PendingStyles from "./pending.module.css"

class PendingPage extends React.Component {
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
                    verifyUserDocsForm={uid => this.verifyUserDocsForm(uid)}
                    backToHome={() => {
                      this.getData()
                    }}
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
                            <td>Pending</td>
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

// (
//   <>
//     <Header />
//     {this.state.isLoading ? (
//       <Loading />
//     ) : this.state.isEmpty ? (
//       <NoDataFound />
//     ) : (
//       <Container>
//         <Row>
//           {this.state.users.map(value => {
//             const user = value.docs[0].user
//             if (user.mecId) {
//               return <div key={value._id}></div>
//             }
//             return (
//               <Col sm={12} key={value._id}>
//                 <Card className="my-4">
//                   <Card.Header>
//                     <Container>
//                       <Row>
//                         <Col md={4}>
//                           <Card.Img
//                             variant="top"
//                             height="250"
//                             src={`${url()}/${user.photo}`}
//                           />
//                         </Col>
//                         <Col md={4}>
//                           <div className="mt-2">
//                             <p className={PendingStyles.pTag}>
//                               {user.name}
//                             </p>
//                             <p className={PendingStyles.pTag}>
//                               DOB : {user.dob}
//                             </p>
//                             <Card
//                               style={{ width: "10rem" }}
//                               className="mt-4"
//                             >
//                               <Card.Img
//                                 variant="top"
//                                 width="300"
//                                 height="90"
//                                 src={`${url()}/${user.signature}`}
//                               />
//                               <Card.Title className="h6 mt-1 mx-auto">
//                                 Signature
//                               </Card.Title>
//                             </Card>
//                           </div>
//                         </Col>
//                       </Row>
//                     </Container>
//                   </Card.Header>
//                   <Card.Body>
//                     <Card.Title>Details</Card.Title>
//                     <Container>
//                       <Row>
//                         <Col md={6}>
//                           <div className="mt-3">
//                             <Row>
//                               <Col md={6}>
//                                 <span
//                                   className={PendingStyles.spanTagHeader}
//                                 >
//                                   Fathers Name :
//                                 </span>
//                               </Col>
//                               <Col md="auto">
//                                 <span>{user.fathersName}</span>
//                               </Col>
//                             </Row>
//                             <Row>
//                               <Col md={6}>
//                                 <span
//                                   className={PendingStyles.spanTagHeader}
//                                 >
//                                   Mothers Name :
//                                 </span>
//                               </Col>
//                               <Col md="auto">
//                                 <span>{user.mothersName}</span>
//                               </Col>
//                             </Row>
//                             <Row>
//                               <Col md={6}>
//                                 <span
//                                   className={PendingStyles.spanTagHeader}
//                                 >
//                                   Address :
//                                 </span>
//                               </Col>
//                               <Col md="auto">
//                                 <span>{user.address}</span>
//                               </Col>
//                             </Row>
//                             <Row>
//                               <Col md={6}>
//                                 <span
//                                   className={PendingStyles.spanTagHeader}
//                                 >
//                                   Phone :{" "}
//                                 </span>
//                               </Col>
//                               <Col md="auto">
//                                 <span>+91 {user.phone}</span>
//                               </Col>
//                             </Row>
//                             <Row>
//                               <Col md={6}>
//                                 <span
//                                   className={PendingStyles.spanTagHeader}
//                                 >
//                                   Email :{" "}
//                                 </span>
//                               </Col>
//                               <Col md="auto">
//                                 <span>{user.email ? user.email : ""}</span>
//                               </Col>
//                             </Row>
//                           </div>
//                         </Col>
//                         <Col md={{ span: 3, offset: 3 }}>
//                           <Button
//                             variant="primary"
//                             onClick={() =>
//                               this.verifyUserDocsForm(user._id)
//                             }
//                             size="lg"
//                             block
//                           >
//                             Verify
//                           </Button>
//                           <Button variant="danger" size="lg" block>
//                             Fail
//                           </Button>
//                         </Col>
//                       </Row>
//                       <Row className="mt-5">
//                         <Table striped bordered hover>
//                           <thead>
//                             <tr>
//                               <th className="text-center">Department</th>
//                               <th className="text-center">Document ID</th>
//                               <th className="text-center">Status</th>
//                               <th className="text-center">Image</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {value.docs.map(valueD => (
//                               <tr key={valueD._id}>
//                                 <td className="text-center align-middle">
//                                   {valueD.depId.name}
//                                 </td>
//                                 <td className="text-center align-middle">
//                                   {valueD.docId}
//                                 </td>
//                                 <td className="text-center align-middle">
//                                   {valueD.status}
//                                 </td>
//                                 <td>
//                                   <Card
//                                     style={{ width: "10rem" }}
//                                     className="mx-auto"
//                                   >
//                                     <Card.Img
//                                       variant="top"
//                                       src={`${url()}/${valueD.file}`}
//                                     />
//                                   </Card>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                       </Row>
//                     </Container>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             )
//           })}
//         </Row>
//         <Row>
//           <Col sm={12} className="text-right">
//             <Pagination>{this.state.items}</Pagination>
//           </Col>
//         </Row>
//       </Container>
//     )}
//   </>
// )
export default PendingPage
