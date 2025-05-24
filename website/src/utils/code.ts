import fs from 'node:fs'

export const getCodeFromFile = (path: string) => {
  return fs.readFileSync(path, 'utf-8')
}
