#!/usr/bin/env node

import fs from '@magic/fs'
import mmmagic from 'mmmagic'

import * as config from './config.mjs'

const magic = new mmmagic.Magic()

const main = async () => {
  const brokenFiles = []

  for (let i = config.zoom.min; i <= config.zoom.max; i++) {
    const dirs = await fs.getDirectories(`./docs/${i}`)

    await Promise.all(
      dirs.map(async dir => {
        const files = await fs.getFiles(dir)

        await Promise.all(
          files.map(
            file =>
              new Promise(res =>
                magic.detectFile(file, (err, result) => {
                  if (
                    err ||
                    (!result.includes('PNG') && !result.includes('JPG') && !result.includes('WEBP'))
                  ) {
                    brokenFiles.push(file)
                  }
                  res()
                }),
              ),
          ),
        )
      }),
    )

    console.log(`checked layer ${i}.`)
  }

  // await Promise.all(brokenFiles.map(async file => await fs.rmrf(file)))

  if (brokenFiles.length) {
    console.log(`deleted ${brokenFiles.length} files`)
  } else {
    console.log('no files deleted, files seem to be correct.')
  }
}

main()
