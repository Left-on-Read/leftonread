import axios from 'axios'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://leftonread.herokuapp.com/api'
    : 'http://localhost:8080/api'

export const addContact = async ({
  email,
  type,
}: {
  email: string
  type: string
}) => {
  return await axios.post(`${API_URL}/contact`, { email, type })
}
