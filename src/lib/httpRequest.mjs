import http from 'http'
import https from 'https'

export const httpRequest = url =>
  new Promise((resolve, reject) => {
    const handler = url.startsWith('https') ? https : http

    const req = handler.request(url, res => {
      res.setEncoding('binary')
      let body = ''

      res.on('data', chunk => {
        body += chunk.toString()
      })

      res.on('end', () => resolve({ ...res, body }))
    })

    req.on('socket', function (socket) {
      socket.setTimeout(2000)
      socket.on('timeout', function () {
        req.destroy()
        console.warn('timeout occured')
      })
    })

    req.on('error', reject)
    req.end()
  })
