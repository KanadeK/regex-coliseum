import type { Challenge } from './types'

type Seed = Omit<Challenge, 'id' | 'visible' | 'hidden' | 'performance'> & { yes: string[]; no: string[] }
const seeds: Seed[] = [
  { title: 'Email Extractor', category: 'extract', prompt: 'Match a simple email address, without surrounding punctuation.', hints: ['Use a literal @.', 'Do not accept whitespace.'], yes: ['ada@example.com', 'dev.team+ops@sample.org'], no: ['ada@', '@example.com', 'ada @example.com'] },
  { title: 'Hex Color', category: 'validate', prompt: 'Validate #RGB or #RRGGBB CSS hex colors.', hints: ['Anchor the whole value.', 'Use a quantifier.'], yes: ['#fff', '#0A12ef'], no: ['fff', '#ffff', '#01234g'] },
  { title: 'ISO Date', category: 'validate', prompt: 'Validate the shape YYYY-MM-DD.', hints: ['This is shape validation, not calendar math.'], yes: ['2026-07-22', '1999-12-31'], no: ['22-07-2026', '2026-7-2', '2026/07/22'] },
  { title: 'Log Level', category: 'log', prompt: 'Extract one of INFO, WARN, ERROR from a log line.', hints: ['Prefer a word boundary.'], yes: ['2026 INFO service started', '[WARN] disk space'], no: ['INFORM service', 'error lower case'] },
  { title: 'IPv4 Shape', category: 'validate', prompt: 'Validate an IPv4-shaped dotted quad (0–255 is not required).', hints: ['Escape literal dots.', 'Use four segments.'], yes: ['127.0.0.1', '192.168.10.200'], no: ['127.0.0', '127.0.0.1.4', '127-0-0-1'] },
  { title: 'Ticket ID', category: 'extract', prompt: 'Match tickets like PROJ-123.', hints: ['Project keys are upper-case.', 'Use a digit quantifier.'], yes: ['PROJ-123', 'API-9'], no: ['proj-123', 'PROJ-', 'PROJ-abc'] },
  { title: 'Username', category: 'validate', prompt: 'Validate 3–16 lowercase letters, digits, or underscores.', hints: ['Anchor the complete input.'], yes: ['ada_42', 'neo'], no: ['ABCD', 'ab', 'this_name_is_way_too_long'] },
  { title: 'HTTP Method', category: 'log', prompt: 'Extract GET, POST, PUT, PATCH, or DELETE.', hints: ['An alternation is appropriate.'], yes: ['GET /health', 'PATCH /users/3'], no: ['OPTIONS /', 'get /health'] },
  { title: 'Version Tag', category: 'validate', prompt: 'Validate vMAJOR.MINOR.PATCH.', hints: ['Escape dots.', 'Require the v prefix.'], yes: ['v1.0.0', 'v12.34.567'], no: ['1.0.0', 'v1.0', 'v1.2.x'] },
  { title: 'Quoted Word', category: 'extract', prompt: 'Match one double-quoted word with no embedded quote.', hints: ['Use a negated character class.'], yes: ['say "hello" now', '"regex"'], no: ['"two words"', 'unquoted', '"broken'] },
  { title: 'Slug', category: 'validate', prompt: 'Validate lowercase kebab-case words.', hints: ['No leading or trailing hyphen.'], yes: ['regex-coliseum', 'one'], no: ['Regex-Coliseum', '-start', 'end-'] },
  { title: 'Whitespace Trim', category: 'refactor', prompt: 'Match a string containing no leading or trailing whitespace.', hints: ['Think about the first and last character.'], yes: ['clean', 'two words'], no: [' leading', 'trailing ', ' both '] },
  { title: 'Phone Digits', category: 'extract', prompt: 'Match a 10-digit phone number written 555-123-4567.', hints: ['Hyphens are literals.'], yes: ['Call 555-123-4567', '555-000-9999'], no: ['5551234567', '55-123-4567'] },
  { title: 'Markdown Heading', category: 'log', prompt: 'Match an H1 or H2 Markdown heading line.', hints: ['The marker is at the start.'], yes: ['# Title', '## Subtitle'], no: ['### Too deep', 'text # heading'] },
  { title: 'Currency Amount', category: 'extract', prompt: 'Match USD amounts like $12 or $12.50.', hints: ['The dollar sign must be escaped.'], yes: ['$12', '$12.50'], no: ['12.50', '$12.5', '$12.500'] },
  { title: 'CSV Cell', category: 'refactor', prompt: 'Match an unquoted CSV cell with no comma or newline.', hints: ['Negated classes make intent clear.'], yes: ['apple', 'two words'], no: ['a,b', 'line\nbreak'] },
  { title: 'Time 24h', category: 'validate', prompt: 'Validate the shape HH:MM with two digits each.', hints: ['This is shape validation, not range validation.'], yes: ['09:30', '23:59'], no: ['9:30', '09-30', '0930'] },
  { title: 'File Extension', category: 'extract', prompt: 'Match .ts, .tsx, .js, or .jsx extensions.', hints: ['Dots are special.'], yes: ['app.ts', 'view.tsx'], no: ['app.css', 'typescript'] },
  { title: 'Semicolon Line', category: 'log', prompt: 'Match log lines that end in a semicolon.', hints: ['Anchor the end.'], yes: ['event=login;', 'x;'], no: ['event=login', '; trailing '] },
  { title: 'HTML ID', category: 'validate', prompt: 'Validate an id beginning with a letter, then letters, digits, hyphens, or underscores.', hints: ['Anchor it.'], yes: ['hero-title', 'a_1'], no: ['1hero', 'has space'] },
  { title: 'URL Path', category: 'extract', prompt: 'Match a slash-prefixed path with word or hyphen segments.', hints: ['Slash is literal in the pattern string.'], yes: ['/docs/regex', '/api/v1-users'], no: ['docs/regex', 'https://example.com'] },
  { title: 'Boolean Flag', category: 'validate', prompt: 'Validate exactly true or false.', hints: ['Full-string anchors matter.'], yes: ['true', 'false'], no: ['True', 'falsey'] },
  { title: 'Order Number', category: 'log', prompt: 'Extract ORD followed by exactly six digits.', hints: ['A word boundary avoids prefixes.'], yes: ['created ORD123456', 'ORD000001'], no: ['ORD12345', 'XORD123456'] },
  { title: 'Repeated Word', category: 'refactor', prompt: 'Find a word repeated twice with one space, such as go go.', hints: ['Capture and backreference.'], yes: ['go go', 'echo echo'], no: ['go stop', 'gogo'] },
  { title: 'JSON Key', category: 'extract', prompt: 'Match a simple quoted JSON key before a colon.', hints: ['Do not consume the colon.'], yes: ['{"name": "Ada"}', '"ok":true'], no: ['name: Ada', '"bad key":'] },
  { title: 'Postal Code', category: 'validate', prompt: 'Validate five digits or five digits plus a hyphen and four digits.', hints: ['Use an optional non-capturing group.'], yes: ['02139', '02139-1234'], no: ['0213', '021391234'] },
  { title: 'CSS Class', category: 'extract', prompt: 'Match dot-prefixed lowercase CSS class names.', hints: ['The dot is literal.'], yes: ['.button-primary', '.x'], no: ['button-primary', '.Button'] },
  { title: 'Signed Integer', category: 'validate', prompt: 'Validate an optional minus followed by one or more digits.', hints: ['Only the sign is optional.'], yes: ['42', '-42', '0'], no: ['+42', '-', '4.2'] },
  { title: 'Pair Separator', category: 'refactor', prompt: 'Match a key=value pair without whitespace around the equals sign.', hints: ['Use word-like keys and values.'], yes: ['mode=fast', 'x=1'], no: ['mode =fast', 'mode= fast'] },
  { title: 'SHA Prefix', category: 'log', prompt: 'Extract a 7-character lowercase hexadecimal commit prefix.', hints: ['Use a hexadecimal character class.'], yes: ['commit a1b2c3d', 'deadbee'], no: ['a1b2c3', 'A1B2C3D'] }
]

export const challenges: Challenge[] = seeds.map((seed, index) => ({
  id: `arena-${String(index + 1).padStart(2, '0')}`,
  title: seed.title,
  category: seed.category,
  prompt: seed.prompt,
  hints: seed.hints,
  visible: [...seed.yes.map((input) => ({ input, matches: true })), ...seed.no.map((input) => ({ input, matches: false }))],
  hidden: [{ input: seed.yes[seed.yes.length - 1], matches: true }, { input: `invalid-${seed.no[0]}`, matches: false }],
  performance: ['a'.repeat(8000) + '!', 'x'.repeat(10000), `${seed.yes[0]} ${seed.yes[0]}`],
  recommendedFlags: ''
}))

export const getChallenge = (id: string) => challenges.find((challenge) => challenge.id === id)
