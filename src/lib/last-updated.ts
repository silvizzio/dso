import { execSync } from 'child_process'

type LastUpdated = { full: string; monthYear: string }

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function format(d: Date): LastUpdated {
  const day = d.getUTCDate()
  const month = MONTHS[d.getUTCMonth()]
  const year = d.getUTCFullYear()
  return {
    full: `${day} ${month} ${year}`,
    monthYear: `${month} ${year}`,
  }
}

let cached: LastUpdated | null = null

// Newest commit date across content/docs, formatted for footer (full) and
// sidebar (monthYear). Computed once per build. Falls back to build date when
// git history is unavailable (e.g. certain shallow-clone or non-git builds).
export function getLastUpdated(): LastUpdated {
  if (cached) return cached
  try {
    const iso = execSync('git log -1 --format=%cI -- content/docs', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    const d = iso ? new Date(iso) : new Date()
    cached = format(isNaN(d.getTime()) ? new Date() : d)
  } catch {
    cached = format(new Date())
  }
  return cached
}
