import { defineEventHandler, getHeader, createError } from 'h3'

export default defineEventHandler((event) => {
  const req = event.node.req

  const isDev =
    process.env.NODE_ENV === 'development' ||
    req.headers.host?.startsWith('localhost') ||
    req.socket?.remoteAddress === '::1' || // IPv6 localhost
    req.socket?.remoteAddress === '127.0.0.1' // IPv4 localhost

  if (isDev) {
    event.context.clientIP =
      getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '0.0.0.0'
    return
  }

  const cfIP = getHeader(event, 'cf-connecting-ip')
  const cfRay = getHeader(event, 'cf-ray')

  if (!cfIP || !cfRay) {
    console.warn('🚫 Cloudflare block', {
      event: 'cloudflare',
      ip: req.socket?.remoteAddress,
      headers: req.headers,
    })

    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Request did not come through Cloudflare',
    })
  }

  event.context.clientIP = cfIP
})
