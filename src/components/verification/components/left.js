import React, { useState } from "react"
import { Card } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTasks,
  faFile,
  faUserCheck,
  faExclamationCircle,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons"
import { url } from "../../../services/details"
import * as LeftCss from "./left.module.css"

const LeftPage = ({ changeNavListener, currentNav, user, departmentName }) => {
  const [isDocSelected, setDocSelected] = useState(false)
  const [activeDocSubElement, setActiveDocSubElement] = useState(true)
  const gender = ["MALE", "FEMALE", "OTHERS"]

  const renderIcon = idx => {
    if (idx == 0) {
      return (
        <FontAwesomeIcon
          icon={faTasks}
          className={`${LeftCss.iconColor} mr-2`}
        />
      )
    } else if (idx == 1) {
      return (
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className={`${LeftCss.iconColor} mr-2`}
        />
      )
    } else if (idx == 2) {
      return (
        <FontAwesomeIcon
          icon={faUserCheck}
          className={`${LeftCss.iconColor} mr-2`}
        />
      )
    } else if (idx == 3) {
      return (
        <FontAwesomeIcon
          icon={faFile}
          className={`${LeftCss.iconColor} mr-2`}
        />
      )
    }
  }

  return (
    <Card>
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <img
              className={LeftCss.profileAvater}
              src={user.photo ? url() + "/" + user.photo : imgUrl}
              alt="profile"
            ></img>
          </div>
          <div>
            <p className={`${LeftCss.profileFont} mb-0`}>{user.name}</p>
          
            <p className={`${LeftCss.genderFont} mb-0 text-muted`}>
              MEC Admin
            </p>
          </div>
        </div>
        <div className="py-9">
         
          
        </div>
        {[
          "Pending",
          "Failed",
          "Verified",
        ].map(
          (value, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (idx == 3) {
                  changeNavListener(activeDocSubElement ? 3 : 4)
                  setDocSelected(true)
                } else {
                  changeNavListener(idx)
                  setDocSelected(false)
                }
              }}
              className={`${LeftCss.selectionItem} ${
                currentNav === idx
                  ? LeftCss.active
                  : currentNav === 4 && idx === 3
                  ? LeftCss.active
                  : ""
              } d-flex flex-row align-items-center navpointer`}
            >
              {renderIcon(idx)}
              {console.log(currentNav)}
              <span className={`${LeftCss.genderFont} align-middle`}>
                {value}
              </span>
            </div>
          ),
          this
        )}
        {isDocSelected ? (
          <>
            {" "}
            <div
              style={{
                backgroundColor: "#eef0f8",
                marginTop: "1px",
              }}
              onClick={() => {
                changeNavListener(3)
                setActiveDocSubElement(!activeDocSubElement)
              }}
              className={`${LeftCss.subSelectionItem} d-flex flex-row align-items-center navpointer`}
            >
              <div
                className={`${LeftCss.subSelectionItem} ${
                  activeDocSubElement ? LeftCss.active : ""
                } d-flex flex-row align-items-center navpointer`}
              >
                <FontAwesomeIcon
                  icon={faFile}
                  className={`${LeftCss.iconColor} mr-2`}
                />
                <span className={`${LeftCss.genderFont} align-middle`}>
                  Document
                </span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#eef0f8",
              }}
              onClick={() => {
                changeNavListener(4)
                setActiveDocSubElement(!activeDocSubElement)
              }}
              className={`${LeftCss.subSelectionItem} d-flex flex-row align-items-center navpointer`}
            >
              <div
                className={`${LeftCss.subSelectionItem} ${
                  LeftCss.subSelectionItem
                } ${
                  !activeDocSubElement ? LeftCss.active : ""
                } d-flex flex-row align-items-center navpointer`}
              >
                <FontAwesomeIcon
                  icon={faFileUpload}
                  className={`${LeftCss.iconColor} mr-2`}
                />
                <span className={`${LeftCss.genderFont} align-middle`}>
                  Upload
                </span>
              </div>
            </div>
          </>
        ) : (
          <> </>
        )}
      </Card.Body>
    </Card>
  )
}

const imgUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC"

export default LeftPage
