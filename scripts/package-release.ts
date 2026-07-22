import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const version = JSON.parse(readFileSync('package.json', 'utf8')).version as string
const name = `regex-coliseum-v${version}-web`
if (!existsSync('dist')) throw new Error('Missing dist/. Run npm run build first.')
rmSync('dist-release', { recursive: true, force: true })
mkdirSync('dist-release', { recursive: true })
cpSync('dist', `dist-release/${name}`, { recursive: true })
execFileSync('tar', ['-a', '-c', '-f', `dist-release/${name}.zip`, '-C', 'dist-release', name], { stdio: 'inherit' })
const archive = `dist-release/${name}.zip`
const sum = createHash('sha256').update(readFileSync(archive)).digest('hex')
writeFileSync('dist-release/SHA256SUMS.txt', `${sum}  ${name}.zip\n`)
console.log(`Packaged ${readdirSync('dist-release').join(', ')}`)
