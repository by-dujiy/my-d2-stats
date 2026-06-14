'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type WeekData = {
  week: string
  label: string
  wins: number
  losses: number
  diff: number
}

type TooltipProps = {
  active?: boolean
  payload?: { payload: WeekData }[]
  label?: string
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-3 shadow text-sm">
      <p className="font-medium mb-1">{d.label}</p>
      <p className="text-green-600">Wins: {d.wins}</p>
      <p className="text-red-500">Losses: {d.losses}</p>
      <p className="font-semibold mt-1">Diff: {d.diff > 0 ? `+${d.diff}` : d.diff}</p>
    </div>
  )
}

export function WinLossChart({ data }: { data: WeekData[] }) {
  const chartWidth = Math.max(data.length * 80, 800)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Win/Loss Week Diff</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div style={{ width: chartWidth, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis domain={[-100, 100]} tickCount={11} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
                <Line
                  type="monotone"
                  dataKey="diff"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#6366f1' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
