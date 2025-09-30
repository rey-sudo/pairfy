import { createError } from 'h3'

export function throwRemoteError(err: any): never {
  const originalError =
    err?.graphQLErrors?.[0]?.message || 
    err?.data ||                       
    err?.response?._data ||           
    err?.response?.statusMessage ||   
    err?.message ||                 
    'Unknown server error'        

  throw createError({
    statusCode: err?.response?.status || err?.statusCode || 500,
    statusMessage: 'Remote Service Error',
    data: originalError,
  })
}
