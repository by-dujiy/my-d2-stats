import { asc } from 'drizzle-orm';
import { db } from '@/lib/db'
import { matches } from '@/lib/schema'
import { DiffChart, type diffData } from '@/components/charts/diffChart'

const DAY = 86400
const WEEK = 7 * DAY

const CUTOFF = Math.floor(new Date('2025-01-01T00:00:00Z').getTime() / 1000)

function isWin(playerSlot: number, radiantWin: boolean): boolean {
  return playerSlot < 128 ? radiantWin : !radiantWin
}

function getSundayFrom(ts: number, { includeSameDay = true } = {}) {
  const days = Math.floor(ts / DAY)
  const dow = (days + 4) % 7
  if (dow === 0) return (days + (includeSameDay ? 0 : 7)) * DAY + 86399;
  return (days + (7 - dow)) * DAY + 86399
}

function getCurrentSunday(nowTs = Math.floor(Date.now() / 1000)) {
  const days = Math.floor(nowTs / DAY)
  const dow = (days + 4) % 7
  return (days + (7 - dow) % 7) * DAY + 86399
}

function sundaysUntilNow(ts: number) {
  const start = getSundayFrom(ts)
  const end = getCurrentSunday()
  const result = []
  for (let t = start; t <= end; t += WEEK) result.push({
    timeline: t,
    wins: 0,
    losses: 0,
    lossesNeg: 0,
    total: 0,
    diff: 0
  })
  return result
}

export default async function WinLossChart() {
  const matchesData = await db
    .select()
    .from(matches)
    .orderBy(asc(matches.startTime))
  
  const chartData : diffData[] = sundaysUntilNow(CUTOFF)

  // матчи до рубежа не разбиваем по неделям — копим их чистую разницу в baseline
  let baseline = 0

  matchesData.forEach(match => {
    if (match.startTime < CUTOFF) {
      baseline += isWin(match.playerSlot, match.radiantWin) ? 1 : -1
      return
    }
    for (const data of chartData) {
      if (match.startTime < data.timeline) {
        if (isWin(match.playerSlot, match.radiantWin)) {
          data.wins++
        } else {
          data.losses++
        }
        break
      }
    }
  })

  let cumulative = baseline
  chartData.forEach(data => {
    const weekDiff = data.wins - data.losses
    cumulative += weekDiff
    data.diff = cumulative
    data.lossesNeg = -data.losses
  })

  return (
    <main className="p-6 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-6">Dota 2 Stats</h1>
      <DiffChart data={chartData} />
    </main>
  )
  }