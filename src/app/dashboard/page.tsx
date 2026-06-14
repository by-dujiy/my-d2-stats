import { db } from '@/lib/db'
import { matches } from '@/lib/schema'
import { WinLossChart, type WeekData } from '@/components/charts/win-loss-chart'

function isWin(playerSlot: number, radiantWin: boolean): boolean {
  return playerSlot < 128 ? radiantWin : !radiantWin
}

function getMondayKey(unixSeconds: number): { key: string; label: string } {
  const date = new Date(unixSeconds * 1000)
  const day = date.getDay()
  const daysToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + daysToMonday)
  monday.setHours(0, 0, 0, 0)

  const key = monday.toISOString().slice(0, 10)
  const label = monday.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
  return { key, label }
}

export default async function DashboardPage() {
  const data = await db.select().from(matches)

  const weekMap = new Map<string, { label: string; wins: number; losses: number }>()

  for (const match of data) {
    const { key, label } = getMondayKey(match.startTime)

    if (!weekMap.has(key)) {
      weekMap.set(key, { label, wins: 0, losses: 0 })
    }

    const entry = weekMap.get(key)!
    if (isWin(match.playerSlot, match.radiantWin)) {
      entry.wins++
    } else {
      entry.losses++
    }
  }

  const chartData: WeekData[] = Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, { label, wins, losses }]) => ({
      week,
      label,
      wins,
      losses,
      diff: wins - losses,
    }))

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dota 2 Stats</h1>
      <WinLossChart data={chartData} />
    </main>
  )
}
