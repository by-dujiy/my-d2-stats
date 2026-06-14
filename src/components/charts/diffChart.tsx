'use client'

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


export type diffData = {
  timeline: number,
  wins: number,
  losses: number,
  lossesNeg: number,
  total: number,
  diff: number
}

type BarLabelProps = {
  x?: unknown
  y?: unknown
  width?: unknown
  value?: unknown
}

type TooltipProps = {
  active?: boolean
  payload?: { payload: diffData }[]
  label?: number
}

const lossesBarLabel = ({ x = 0, y = 0, width = 0, value = 0 }: BarLabelProps) => {
  if (Number(value) === 0) return <g />
  return (
    <text
      x={Number(x) + Number(width) / 2}
      y={Number(y) + 14}
      fill="#ef4444"
      fontSize={10}
      textAnchor="middle"
    >
      {Math.abs(Number(value))}
    </text>
  )
}

const winsBarLabel = ({ x = 0, y = 0, width = 0, value = 0 }: BarLabelProps) => {
  if (Number(value) === 0) return <g />
  return (
    <text
      x={Number(x) + Number(width) / 2}
      y={Number(y) - 5}
      fill="#22c55e"
      fontSize={10}
      textAnchor="middle"
    >
      {Math.abs(Number(value))}
    </text>
  )
}

function DiffChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null

  const d = payload[0].payload

  const date = new Date(d.timeline * 1000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })

  return (
    <div className="rounded-lg border-none bg-card/90 p-3 text-sm text-card-foreground shadow">
      <p className="mb-1 font-medium">{date}</p>
      <p className="text-green-500">Wins: {d.wins}</p>
      <p className="text-red-500">Losses: {d.losses}</p>
      <p className="text-muted-foreground">Total: {d.wins + d.losses}</p>
      <p className="mt-1 font-semibold">
        Diff: {d.diff > 0 ? `+${d.diff}` : d.diff}
      </p>
    </div>
  )
}


export function DiffChart({ data }: { data: diffData[] }) {
  const chartWidth = Math.max(data.length * 40, 800)
  const maxTotal = Math.ceil(Math.max(...data.map(d => Math.abs(d.total))) / 10) * 10
  const maxDiff = Math.ceil(Math.max(...data.map(d => Math.abs(d.diff))) / 10) * 10
  const maxCoord = Math.max(maxTotal, maxDiff)

  const step = Math.max(Math.ceil(maxCoord / 5 / 10) * 10, 10)
  const top = Math.ceil(maxCoord / step) * step
  const ticks: number[] = []
  for (let v = -top; v <= top; v += step) ticks.push(v)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Win/Loss Week Diff</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div style={{ width: chartWidth, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart  data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey='timeline'
                  tickFormatter={(value) => new Date(value * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-45}
                  height={50}
                  textAnchor='end' 
                />
                <YAxis domain={[-top, top]} ticks={ticks} width={40} />
                <ReferenceLine y={0} stroke="#c8c9ca" strokeWidth={1.5} />
                <Line
                  dataKey='diff'
                  type='monotone'
                  stroke='#6366f1'
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#20a53a' }}
                  activeDot={{ r: 6 }}
                />
                <Bar
                  dataKey="wins"
                  fill="#22c55e"
                  fillOpacity={0.3}
                  stroke="none"
                  label={winsBarLabel}
                />
                <Bar
                  dataKey="lossesNeg"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  stroke="none"
                  label={lossesBarLabel}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(147, 197, 253, 0.65)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#1e293b',
                  }}
                  cursor={{ stroke: 'rgba(147, 197, 253, 0.1)', strokeWidth: 40 }}
                  content={<DiffChartTooltip />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}