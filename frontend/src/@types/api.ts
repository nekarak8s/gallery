type MessageResponse<T = unknown> = {
  message: string
  data: T
}

type ErrorResponse = {
  message: string
  errorCode: string
}
