"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

interface EmissionsByFundProps {
  data: Record<string, number>
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-4 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <p className="font-semibold text-foreground dark:text-black">{label}</p>
        <p className="text-primary dark:text-blue-400">
          Emissions: {payload[0].value?.toLocaleString()} tons CO2e
        </p>
      </div>
    )
  }
  return null
}

export default function EmissionsByFund({ data }: EmissionsByFundProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, emissions: value }))
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="emissions" 
          fill="hsl(var(--primary))" 
          radius={[4, 4, 0, 0]}
          className="hover:opacity-80 transition-opacity duration-300"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

