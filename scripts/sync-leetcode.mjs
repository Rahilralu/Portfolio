// Refreshes data/leetcode.json from the public LeetCode profile. Run hourly by .github/workflows/leetcode-sync.yml.
// Writes only when the numbers changed; on any failure it leaves the file alone and exits non-zero.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const file = join(root, 'data/leetcode.json')
const fail = (msg) => { console.error('sync-leetcode: ' + msg); process.exit(1) }

// the username is defined once, in the site content; LEETCODE_USER overrides it
const user = process.env.LEETCODE_USER
  || /leetcode\s*=\s*\{\s*user:\s*'([^']+)'/.exec(readFileSync(join(root, 'composables/useContent.ts'), 'utf8'))?.[1]
if (!user) fail('no LeetCode username found')

const query = `query ($u: String!) {
  matchedUser(username: $u) { submitStatsGlobal { acSubmissionNum { difficulty count } } }
  allQuestionsCount { difficulty count }
}`

async function fetchStats() {
  let last
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'content-type': 'application/json', referer: 'https://leetcode.com/', 'user-agent': 'Mozilla/5.0 (portfolio-stats-sync)' },
        body: JSON.stringify({ query, variables: { u: user } }),
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const json = await res.json()
      if (json.errors?.length) throw new Error(json.errors[0].message)
      return json.data
    } catch (e) { last = e; if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 3000)) }
  }
  fail('could not reach LeetCode: ' + last?.message)
}

const data = await fetchStats()
const ac = data?.matchedUser?.submitStatsGlobal?.acSubmissionNum
if (!ac) fail(`no profile data for "${user}"`)
const solvedBy = (d) => ac.find((x) => x.difficulty === d)?.count
const totalBy = (d) => data.allQuestionsCount?.find((x) => x.difficulty === d)?.count

const next = { solved: solvedBy('All'), total: totalBy('All'), levels: {} }
for (const k of ['Easy', 'Medium', 'Hard']) next.levels[k] = { n: solvedBy(k), of: totalBy(k) }

// sanity checks: never publish a half-empty or nonsensical response
const ints = [next.solved, next.total, ...Object.values(next.levels).flatMap((l) => [l.n, l.of])]
if (!ints.every((n) => Number.isInteger(n) && n >= 0) || next.total <= 0) fail('unexpected response shape: ' + JSON.stringify(next))
const sum = Object.values(next.levels).reduce((a, l) => a + l.n, 0)
if (sum !== next.solved) fail(`difficulty counts (${sum}) do not add up to solved (${next.solved})`)
if (Object.values(next.levels).some((l) => l.n > l.of) || next.solved > next.total) fail('solved is higher than the total')
let prev = null
try { prev = JSON.parse(readFileSync(file, 'utf8')) } catch {}
if (prev && next.solved < prev.solved * 0.5) fail(`solved dropped from ${prev.solved} to ${next.solved}; refusing to publish`)

const out = JSON.stringify(next, null, 2).replace(/\{\n\s+"n": (\d+),\n\s+"of": (\d+)\n\s+\}/g, '{ "n": $1, "of": $2 }') + '\n'
if (prev && readFileSync(file, 'utf8') === out) { console.log(`sync-leetcode: no change (${next.solved} solved)`); process.exit(0) }
writeFileSync(file, out)
console.log(`sync-leetcode: updated, solved ${prev?.solved ?? '?'} -> ${next.solved} (Easy ${next.levels.Easy.n}, Medium ${next.levels.Medium.n}, Hard ${next.levels.Hard.n}; LeetCode total ${next.total})`)
