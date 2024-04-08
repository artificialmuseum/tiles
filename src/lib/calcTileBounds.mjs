import { degreesToTileXY } from './degreesToTileXY.mjs'

export const calcTileBounds = ({ lat, lng, zoom }) => {
  let zoomMod = 0

  if (zoom === 11) {
    zoomMod = 0.3
  } else if (zoom === 12) {
    zoomMod = 0.2
  } else if (zoom === 13) {
    zoomMod = 0.1
  } else if (zoom === 14) {
    zoomMod = 0.05
  } else if (zoom === 15) {
    zoomMod = 0.01
  }

  const latMax = Math.max(lat.max, lat.min) + zoomMod
  const latMin = Math.min(lat.max, lat.min) - zoomMod
  const lngMax = Math.max(lng.max, lng.min) + zoomMod
  const lngMin = Math.min(lng.max, lng.min) - zoomMod

  const min = degreesToTileXY(latMax + zoomMod, lngMin - zoomMod, zoom)
  const max = degreesToTileXY(latMin - zoomMod, lngMax + zoomMod, zoom)

  return {
    min: {
      x: min.x - 1,
      y: min.y - 1,
    },
    max: {
      x: max.x + 1,
      y: max.y + 1,
    },
  }
}
