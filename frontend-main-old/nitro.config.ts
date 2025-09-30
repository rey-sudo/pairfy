export default defineNitroConfig({
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src 'self';",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
            "font-src 'self' https://fonts.gstatic.com;",
            "img-src 'self' data: https:;",
            "connect-src 'self';",
            "object-src 'none';",
            "frame-ancestors 'none';",
            "base-uri 'self';",
            "form-action 'self';",
            "media-src 'self';",
            "worker-src 'self';",
            "script-src-attr 'none';"
          ].join(' '),
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer',
          'Permissions-Policy': 'camera=(), geolocation=()'
        }
      }
    }
  })
  