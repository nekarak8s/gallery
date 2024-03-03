import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'

export type MessageResponse<T = unknown> = {
  message: string
  data: T
}

export type ErrorResponse = {
  message: string
  errorCode: string
}

export type TUseQueryOptions<TData = unknown> =
  | (Omit<
      UseQueryOptions<MessageResponse<TData>, ErrorResponse, TData>,
      'queryKey' | 'queryFn' | 'initialData'
    > & { initialData?: () => undefined })
  | undefined

export type TUseMutationOptions<TVariables = unknown> =
  | Omit<UseMutationOptions<MessageResponse, ErrorResponse, TVariables>, 'mutationFn'>
  | undefined
