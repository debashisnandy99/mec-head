import axios from "./api"

import { navigate } from "gatsby"

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("bearer")
    ? JSON.parse(window.localStorage.getItem("bearer"))
    : {}

const setUser = user =>
  window.localStorage.setItem("bearer", JSON.stringify(user))

export const handleLogin = async (uname, password) => {

  console.log(uname)
  try {
    let data = await axios.post("/admin/login", {
      "username":uname,
      "password":password
    }, {
      headers: {
        "content-type": "application/json",
      },
    })
    console.log(data.data)
    setUser({
      token: data.data.token,
      uid: data.data.userId,
    })
    return data.data
  } catch (error) {
    console.log(error.response.data)
    return error.response.data
  }
}

export const isLoggedIn = () => {
  const user = getUser()

  return !!user.uid
}

export const logout = () => {
  navigate("", {
    replace: true,
  })
  setUser({})
}
