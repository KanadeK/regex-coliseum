import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const run = (command: string, args: string[]): string => execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
const grep = (args: string[]): string => {
  try { return run('git', args) }
  catch (cause) {
    if ((cause as { status?: number }).status === 1) return ''
    throw cause
  }
}
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const version = JSON.parse(readFileSync('package.json', 'utf8')).version as string
const archive = `dist-release/regex-coliseum-v${version}-web.zip`
const required = [archive, 'dist-release/SHA256SUMS.txt']
for (const file of required) if (!existsSync(file)) throw new Error(`Required release asset missing: ${file}`)
if (!readFileSync('CHANGELOG.md', 'utf8').includes(`## [${version}]`)) throw new Error(`CHANGELOG has no ${version} section`)
const status = run('git', ['status', '--porcelain'])
if (status) throw new Error('Working tree must be clean for release-check.')
const unfinishedTerms = ['TODO', 'FIXME', 'NotImplemented', 'place' + 'holder', 'coming soon', 'lorem ipsum'].join('|')
const banned = grep(['grep', '-nE', unfinishedTerms, '--', ':!docs/ROADMAP.md'])
if (banned) throw new Error(`Banned unfinished marker found:\n${banned}`)
const secret = grep(['grep', '-nE', 'BEGIN( [A-Z]+)? PRIVATE KEY|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}', '--', '.'])
if (secret) throw new Error(`Potential secret found:\n${secret}`)
const shaLine = readFileSync('dist-release/SHA256SUMS.txt', 'utf8').trim()
const actualSha = createHash('sha256').update(readFileSync(archive)).digest('hex')
if (shaLine !== `${actualSha}  regex-coliseum-v${version}-web.zip`) throw new Error('SHA256SUMS.txt does not match the release archive.')
run(npm, ['run', 'lint'])
run(npm, ['run', 'typecheck'])
run(npm, ['run', 'test:coverage'])
run(npm, ['run', 'test:e2e'])
run(npm, ['run', 'build'])
const login = run('gh', ['api', 'user', '--jq', '.login'])
const id = run('gh', ['api', 'user', '--jq', '.id'])
const apiEmail = run('gh', ['api', 'user', '--jq', '.email // empty'])
const email = apiEmail || `${id}+${login}@users.noreply.github.com`
const identities = run('git', ['log', '--format=%an <%ae> | %cn <%ce>']).split('\n').filter(Boolean)
if (!identities.length) throw new Error('Release-check requires at least one commit.')
const expected = `${login} <${email}> | ${login} <${email}>`
if (identities.some((identity) => identity !== expected)) throw new Error(`Unexpected commit identity. Expected only ${expected}.`)
console.log('Release check passed.')
