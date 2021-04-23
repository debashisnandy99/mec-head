import * as React from "react"
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Table,
} from "react-bootstrap"
import axios from "../../../services/api"
import * as FileSaver from "file-saver"
import { getUser, logout } from "../../../services/auth"
import { url, ipfsUrl } from "../../../services/details"
import ipfsaxios from "../../../services/ipfsapi"
import * as PendingStyles from "../pending.module.css"

const UserProfile = ({ user, backToHome, verifyUserDocsForm }) => {
  const [modalShow, setModalShow] = React.useState({ show: false, url: "" })
  const [value, setValue] = React.useState(undefined)
  const [show, setShow] = React.useState(false)
  const [showVerify, setShowVerify] = React.useState(false)
  const [ipfs, setIpfs] = React.useState()
  const [imageList, setImageList] = React.useState()
  const [isVerifyAvailable, setIsVerifyAvailable] = React.useState(true)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleCloseVerify = () => setShowVerify(false)
  const handleShowVerify = () => setShowVerify(true)
  console.log(user)
  React.useEffect(() => {
    axios
      .post(
        "/admin/depOfUser",
        {
          uid: user._id,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
        }
      )
      .then(val => {
        setValue(val.data.docs)
        if (val.data.docs.length > 0) {
          val.data.docs.map(valueD => {
            if (valueD.depId.name == "adhaar") {
              if (valueD.status == "verified") {
                setIsVerifyAvailable(false)
              }
            }
          })
        }
      })
      .catch(err => {
        setValue(undefined)
      })

    if (user.mecId) {
      // console.log(user.mecId);
      axios
        .post(
          "/admin/getValidateDetails",
          {
            uid: user._id,
          },
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${getUser().token}`,
            },
          }
        )
        .then(res => {
          setIpfs(res.data.ipfsHash)
          console.log(res.data)
          return ipfsaxios.post("/api/v0/ls?arg=" + res.data.ipfsHash)
        })
        .then(res => {
          let imageList = {}
          console.log(res)
          res.data.Objects[0].Links.forEach(value => {
            const imageName = value.Name.toString()
            console.log(value)
            if (imageName.includes("adhaar")) {
              imageList["adhaar"] = imageName
            } else if (imageName.includes("pan")) {
              imageList["pan"] = imageName
            } else if (imageName.includes("birth")) {
              imageList["birth"] = imageName
            } else if (imageName.includes("profile")) {
              imageList["profile"] = imageName
            } else if (imageName.includes("signature")) {
              imageList["signature"] = imageName
            }
          })
          setImageList(imageList)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }, [])

  const executeVerify = () => {
    handleCloseVerify()
    verifyUserDocsForm(user._id)
  }

  const executeFail = () => {
    handleClose()
    failedUser()
  }

  const failedUser = () => {
    axios
      .post(
        "/admin/depFailMec",
        {
          uid: user._id,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
        }
      )
      .then(val => {
        backToHome()
      })
      .catch(err => {})
  }

  return (
    <>
      <Col sm={12} key={user._id}>
        <Card className="my-4">
          <Card.Header>
            <Container>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="top"
                    height="250"
                    src={
                      imageList
                        ? `${ipfsUrl()}/ipfs/${ipfs}/${imageList["profile"]}`
                        : `${url()}/${user.photo}`
                    }
                    onClick={() =>
                      setModalShow({
                        show: true,
                        url: imageList
                          ? `${ipfsUrl()}/ipfs/${ipfs}/${imageList["profile"]}`
                          : `${url()}/${user.photo}`,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <div className="mt-2">
                    <p className={PendingStyles.pTag}>{user.name}</p>
                    <p className={PendingStyles.pTag}>DOB : {user.dob}</p>
                    <Card style={{ width: "10rem" }} className="mt-4">
                      <Card.Img
                        variant="top"
                        width="300"
                        height="90"
                        src={
                          imageList
                            ? `${ipfsUrl()}/ipfs/${ipfs}/${
                                imageList["signature"]
                              }`
                            : `${url()}/${user.signature}`
                        }
                        onClick={() =>
                          setModalShow({
                            show: true,
                            url: imageList
                              ? `${ipfsUrl()}/ipfs/${ipfs}/${
                                  imageList["signature"]
                                }`
                              : `${url()}/${user.signature}`,
                          })
                        }
                      />
                      <Card.Title className="h6 mt-1 mx-auto">
                        Signature
                      </Card.Title>
                    </Card>
                  </div>
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
                        <span>{user.fathersName}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <span className={PendingStyles.spanTagHeader}>
                          Mothers Name :
                        </span>
                      </Col>
                      <Col md="auto">
                        <span>{user.mothersName}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <span className={PendingStyles.spanTagHeader}>
                          Address :
                        </span>
                      </Col>
                      <Col md="auto">
                        <span>{user.address}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <span className={PendingStyles.spanTagHeader}>
                          Phone :{" "}
                        </span>
                      </Col>
                      <Col md="auto">
                        <span>+91 {user.phone}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <span className={PendingStyles.spanTagHeader}>
                          Email :{" "}
                        </span>
                      </Col>
                      <Col md="auto">
                        <span>{user.email ? user.email : ""}</span>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col md={{ span: 3, offset: 3 }}>
                  {!user.mecId ? (
                    <>
                      <Button
                        variant="primary"
                        onClick={handleShowVerify}
                        disabled={isVerifyAvailable}
                        size="sm"
                        block
                      >
                        Verify
                      </Button>
                      {user.isMecVerify != "fail" ? (
                        <Button
                          variant="danger"
                          onClick={handleShow}
                          size="sm"
                          block
                        >
                          Fail
                        </Button>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
              <Row className="mt-5">
                {value ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th className="text-center">Department</th>
                        <th className="text-center">Document ID</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {value.map(valueD => {
                        return (
                          <tr key={valueD._id}>
                            <td className="text-center align-middle">
                              {valueD.depId.name}
                            </td>
                            <td className="text-center align-middle">
                              {valueD.docId}
                            </td>
                            <td className="text-center align-middle">
                              {valueD.status}
                            </td>
                            <td>
                              <Card
                                style={{ width: "10rem" }}
                                className="mx-auto"
                              >
                                <Card.Img
                                  variant="top"
                                  src={
                                    imageList
                                      ? `${ipfsUrl()}/ipfs/${ipfs}/${
                                          imageList[valueD.depId.name]
                                        }`
                                      : `${url()}/${valueD.file}`
                                  }
                                  onClick={() =>
                                    setModalShow({
                                      show: true,
                                      url: imageList
                                        ? `${ipfsUrl()}/ipfs/${ipfs}/${
                                            imageList[valueD.depId.name]
                                          }`
                                        : `${url()}/${valueD.file}`,
                                    })
                                  }
                                />
                              </Card>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                ) : (
                  <></>
                )}
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Col>
      <ModalForImageShow
        modalData={modalShow}
        onHide={() => setModalShow({ show: false, url: "" })}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want continue this action?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={executeFail}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showVerify} onHide={handleCloseVerify}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want verify this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVerify}>
            Close
          </Button>
          <Button variant="primary" onClick={executeVerify}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function ModalForImageShow({ modalData, onHide }) {
  const downloadFile = () => {
    FileSaver.saveAs(modalData.url, "image.jpg")
    onHide()
  }
  return (
    <Modal
      show={modalData.show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Row className="d-flex justify-content-center">
          {" "}
          <img
            style={{
              height: "100%",
              width: "80%",
              borderRadius: "8px",
            }}
            src={modalData.url}
            alt="profile"
          ></img>
        </Row>
        <Row className="d-flex mt-2 justify-content-center">
          <Button size="sm" variant="success" onClick={downloadFile}>
            Download
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="ml-2"
            onClick={onHide}
          >
            Close
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default UserProfile
