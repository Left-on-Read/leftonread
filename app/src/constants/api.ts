export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://leftonread.herokuapp.com/api'
    : 'http://localhost:8080/api';
