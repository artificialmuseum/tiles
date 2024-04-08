import path from 'path'

import fs from '@magic/fs'

import { imageDir, getDomain } from '../config.mjs'
import { httpRequest } from './httpRequest.mjs'

import { calcTileBounds } from './calcTileBounds.mjs'

export const downloadTiles = async ({
  planet = 'earth',
  lat,
  lng,
  zoom,
  name,
  country,
  slug,
  region,
}) => {
  const { min, max } = calcTileBounds({ lat, lng, zoom })

  let subdomainId = 0

  let newFiles = 0
  let existingFiles = 0

  for (let x = min.x; x <= max.x; x++) {
    for (let y = min.y; y <= max.y; y++) {
      const filePath = path.join(imageDir, region, country, slug, `${zoom}`, `${x}`, `${y}.png`)

      let exists = await fs.exists(filePath)

      if (exists) {
        const stat = await fs.stat(filePath)
        if (stat.size < 100) {
          exists = false
        }
      }

      if (!exists) {
        const url = `${getDomain(planet, subdomainId)}/${zoom}/${x}/${y}.png`

        const dirsLeft = max.x - x
        const imagesInDirLeft = max.y - y + 1

        console.log(
          `${name}: downloading ${filePath}, dirs left: ${dirsLeft}, images in dir: ${imagesInDirLeft}`,
        )

        try {
          const data = await httpRequest(url)
          const basename = path.dirname(filePath)

          await fs.mkdirp(basename)

          await fs.writeFile(filePath, data.body, 'binary')

          await new Promise(r => {
            const ran = Math.random() * 50 + 100

            setTimeout(() => {
              r()
            }, ran)
          })
        } catch (e) {
          console.log(e, filePath)
        }

        subdomainId += 1
        if (subdomainId > 2) {
          subdomainId = 0
        }

        newFiles++
      } else {
        existingFiles++
      }
    }
  }

  console.log(
    `${name}, zoom: ${zoom}: Downloaded ${newFiles} new tiles. Ignored ${existingFiles} existing files`,
  )
}
