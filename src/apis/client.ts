import axios from 'axios'
import { env } from '@/utils'

const instance = axios.create({
  baseURL: env.VITE_API_ENPOINT,
  withCredentials: true, // allows sending cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
