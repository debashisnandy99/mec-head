import axios from "axios"
import { ipfsUrl } from "./details"

export default axios.create({
  baseURL: ipfsUrl(),
  timeout: 100000,
})
