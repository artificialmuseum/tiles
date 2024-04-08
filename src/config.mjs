export { world } from './regions/world.mjs'

export const zoom = {
  min: 3,
  max: 18,
}

export const getDomain = (planet, subdomainId) => {
  if (planet === 'moon') {
    return `http://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/`
  } else if (planet === 'mars') {
    return `http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/viking_mdim21_global`
  }

  const subdomains = ['a', 'b', 'c']
  const subdomain = subdomains[subdomainId]

  const local = 'http://localhost:6789/openstreetmap-carto/tile'
  const remote = `https://tiles.stadiamaps.com/tiles/stamen_toner`

  const tilemill = 'http://127.0.0.1:20008/tile/control-room'

  return remote
}

export const imageDir = 'docs'
