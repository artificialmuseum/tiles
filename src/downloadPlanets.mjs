#!/usr/bin/env node

import path from 'path'

import fs from '@magic/fs'
import log from '@magic/log'

import { httpRequest } from './lib/httpRequest.mjs'

import { getDomain } from './config.mjs'

const downloadLayer = async ({ planet, num, zoom }) => {
  const images = []

  const hostname = `${getDomain(planet)}`

  for (let i = 0; i <= num; i++) {
    for (let j = 0; j <= num; j++) {
      const image = `${zoom}/${i}/${j}.jpg`

      const filePath = path.join(process.cwd(), 'docs', planet, image)
      const exists = await fs.exists(filePath)
      if (!exists) {
        images.push(image)
      }
    }
  }

  for (let i = 0; i < images.length; i += 4) {
    const imgs = [images[i], images[i + 1], images[i + 2], images[i + 3]]

    await Promise.all(
      imgs.map(async image => {
        if (!image) {
          return
        }

        const filePath = path.join(process.cwd(), 'docs', planet, image)
        log.info('downloading', image)

        const url = `${hostname}/${image}`

        try {
          const data = await httpRequest(url)

          const dir = path.dirname(filePath)

          await fs.mkdirp(dir)

          await fs.writeFile(filePath, data.body, 'binary')
          log.success('wrote file', filePath)
        } catch (e) {
          log.error('E_DOWNLOAD_IMAGE', e, filePath)
        }
      }),
    )
  }
}

const run = async () => {
  const layers = [
    // {
    //   num: 15,
    //   zoom: 3,
    //   planet: 'moon',
    // },
    {
      num: 15,
      zoom: 4,
      planet: 'moon',
    },
    {
      num: 26,
      zoom: 5,
      planet: 'moon',
    },
    {
      num: 63,
      zoom: 6,
      planet: 'moon',
    },
    {
      num: 127,
      zoom: 7,
      planet: 'moon',
    },

    {
      num: 15,
      zoom: 4,
      planet: 'mars',
    },
    {
      num: 26,
      zoom: 5,
      planet: 'mars',
    },
    {
      num: 63,
      zoom: 6,
      planet: 'mars',
    },
    {
      num: 127,
      zoom: 7,
      planet: 'mars',
    },
  ]

  layers.forEach(downloadLayer)
}

run()
