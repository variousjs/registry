const { resolve } = require('path')
const { readdirSync, existsSync, readFileSync, writeFileSync } = require('fs')
const { load } = require('js-yaml')

const manifests = readdirSync(resolve(__dirname, '../packages'))
  .map((dir) => resolve(__dirname, '../packages', dir, 'manifest.yml'))
  .filter((path) => existsSync(path))
  .map((path) => load(readFileSync(path, 'utf8')))
  .reduce((prev, cur) => ({ ...prev, [cur.name]: cur }), {})

writeFileSync(resolve(__dirname, '../', 'registry.json'), JSON.stringify(manifests))
