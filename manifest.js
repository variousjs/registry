const { resolve } = require('path')
const { readdirSync, existsSync, readFileSync, writeFileSync } = require('fs')
const { load } = require('js-yaml')
const { version } = require('./package.json')

const manifests = readdirSync(resolve(__dirname, './packages'))
  .map((dir) => resolve(__dirname, './packages', dir, 'manifest.yml'))
  .filter((path) => existsSync(path))
  .map((path) => {
    const config = load(readFileSync(path, 'utf8'))
    config.versions = Object.keys(config.versions).reduce((prev, cur) => ({
      ...prev,
      [cur]: {
        ...config.versions[cur],
        dist: config.versions[cur].dist || `https://cdn.jsdelivr.net/npm/@variousjs/registry@${version}/dist/${config.name}/${cur}/index.js`,
      },
    }), {})
    return config
  })
  .reduce((prev, cur) => ({ ...prev, [cur.name]: cur }), {})

writeFileSync(resolve(__dirname, './', 'registry.json'), JSON.stringify(manifests))
