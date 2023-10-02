interface MessageResponse<T = any> {
  message: string
  data: T
}

interface ErrorResponse {
  message: string
  errorCode: string
}
