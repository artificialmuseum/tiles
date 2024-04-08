import { degreesToRadians } from './degreesToRadians.mjs'

export const degreesToTileXY = (lat, lng, zoom) => {
  const latRadian = degreesToRadians(lat)
  const n = 2 ** zoom
  const x = Math.round(((lng + 180) / 360) * n)

  const y = Math.round(((1.0 - Math.asinh(Math.tan(latRadian)) / Math.PI) / 2.0) * n)

  return { x, y }
}
