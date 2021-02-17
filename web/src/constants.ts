// TODO(teddy): Not a fan of this
export const API_BASE = (process.env.ENV = 'development'
  ? 'http://localhost:9000/api'
  : 'TBD')
