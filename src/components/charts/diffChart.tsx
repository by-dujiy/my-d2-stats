'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


export type diffData = {
  timeline: number,
  wins: number,
  losses: number,
  diff: number
}


export function DiffChart({ data }: { data: diffData[] }) {
  const chartWidth = Math.max(data.length * 40, 800)

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
                  dataKey='timeline'
                  tickFormatter={(value) => new Date(value * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })}
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-45}
                  height={50}
                  textAnchor='end' 
                />
                <YAxis domain={[-100, 100]} tickCount={11} width={40} />
                <Line
                  dataKey='diff'
                  type='monotone'
                  stroke='#6366f1'
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#20a53a' }}
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