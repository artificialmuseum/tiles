import path from 'path'
import fs from '@magic/fs'

const scanDirs = async dir => {
  const dirs = await fs.getDirectories(dir, { noRoot: true })
  if (dirs.length) {
    // console.log(dirs)
    return await Promise.all(
      dirs.map(async dir => {
        await scanDirs(dir)
      }),
    )
  }

  const files = await fs.getFiles(dir)
  console.log('searching', dir, `found ${files.length} files`)

  await Promise.all(
    files.map(async file => {
      const stat = await fs.stat(file)
      if (stat.size === 19) {
        console.log('removed', file, stat.size)
        await fs.unlink(file)
      }
    }),
  )
}

const run = async () => {
  const dir = path.join(process.cwd(), 'docs') //, 'eu', 'it', 'schlanders', '18')

  await scanDirs(dir)
}

run()
