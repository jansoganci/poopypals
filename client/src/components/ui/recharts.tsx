"use client"

import * as React from "react"
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart as RechartsAreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  RadarChart as RechartsRadarChart,
  Radar,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts"

import { cn } from "@/lib/utils"

// LineChart Component
export function LineChart({
  data,
  index,
  categories,
  colors = ["amber-500", "purple-500", "emerald-500", "blue-500", "pink-500"],
  valueFormatter,
  showAnimation = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  yAxisWidth = 56,
  showGrid = true,
  className,
  ...props
}: {
  data: Record<string, any>[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  yAxisWidth?: number
  showGrid?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              minTickGap={0}
              className="text-xs"
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={valueFormatter}
              className="text-xs"
            />
          )}
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                
                return (
                  <div className="border border-border/50 bg-background p-2 shadow-md rounded-lg">
                    <div className="grid gap-2">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm font-medium">
                            {entry.name}:{" "}
                            {valueFormatter
                              ? valueFormatter(entry.value as number)
                              : entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          )}
          {showLegend && <Legend className="text-xs" />}
          {categories.map((category, index) => (
            <Line
              key={category}
              dataKey={category}
              type="monotone"
              stroke={`var(--${colors[index % colors.length]})`}
              strokeWidth={2}
              dot={{ fill: `var(--${colors[index % colors.length]})`, r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={showAnimation}
              animationDuration={500}
              animationBegin={index * 100}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

// AreaChart Component
export function AreaChart({
  data,
  index,
  categories,
  colors = ["amber-500", "purple-500", "emerald-500", "blue-500", "pink-500"],
  valueFormatter,
  showAnimation = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  yAxisWidth = 56,
  showGrid = true,
  stack = false,
  className,
  ...props
}: {
  data: Record<string, any>[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  yAxisWidth?: number
  showGrid?: boolean
  stack?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              minTickGap={0}
              className="text-xs"
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={valueFormatter}
              className="text-xs"
            />
          )}
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                
                return (
                  <div className="border border-border/50 bg-background p-2 shadow-md rounded-lg">
                    <div className="grid gap-2">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm font-medium">
                            {entry.name}:{" "}
                            {valueFormatter
                              ? valueFormatter(entry.value as number)
                              : entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          )}
          {showLegend && <Legend className="text-xs" />}
          {categories.map((category, index) => (
            <Area
              key={category}
              dataKey={category}
              stackId={stack ? "stack" : undefined}
              fill={`var(--${colors[index % colors.length]})`}
              stroke={`var(--${colors[index % colors.length]})`}
              isAnimationActive={showAnimation}
              animationDuration={500}
              animationBegin={index * 100}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// BarChart Component
export function BarChart({
  data,
  index,
  categories,
  colors = ["amber-500", "purple-500", "emerald-500", "blue-500", "pink-500"],
  valueFormatter,
  showAnimation = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  yAxisWidth = 56,
  showGrid = true,
  stack = false,
  layout = "vertical",
  className,
  ...props
}: {
  data: Record<string, any>[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  yAxisWidth?: number
  showGrid?: boolean
  stack?: boolean
  layout?: "vertical" | "horizontal"
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart 
          data={data}
          layout={layout}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={layout === "vertical" ? undefined : index}
              type={layout === "vertical" ? "number" : "category"}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              minTickGap={0}
              tickFormatter={layout === "vertical" ? valueFormatter : undefined}
              className="text-xs"
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              dataKey={layout === "vertical" ? index : undefined}
              type={layout === "vertical" ? "category" : "number"}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={layout === "vertical" ? undefined : valueFormatter}
              className="text-xs"
            />
          )}
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                
                return (
                  <div className="border border-border/50 bg-background p-2 shadow-md rounded-lg">
                    <div className="grid gap-2">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm font-medium">
                            {entry.name}:{" "}
                            {valueFormatter
                              ? valueFormatter(entry.value as number)
                              : entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          )}
          {showLegend && <Legend className="text-xs" />}
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              stackId={stack ? "stack" : undefined}
              fill={`var(--${colors[index % colors.length]})`}
              radius={[4, 4, 0, 0]}
              isAnimationActive={showAnimation}
              animationDuration={500}
              animationBegin={index * 100}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// PieChart Component
export function PieChart({
  data,
  category,
  index,
  colors = ["amber-500", "purple-500", "emerald-500", "blue-500", "pink-500", "orange-500", "teal-500", "red-500"],
  valueFormatter,
  showAnimation = true,
  showLegend = true,
  showTooltip = true,
  showLabels = true,
  className,
  ...props
}: {
  data: Record<string, any>[]
  category: string
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showLabels?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            nameKey={index}
            dataKey={category}
            cx="50%"
            cy="50%"
            outerRadius={80}
            animationDuration={500}
            isAnimationActive={showAnimation}
            label={showLabels ? ({name, percent}) => (
              valueFormatter 
                ? `${name}: ${(percent * 100).toFixed(0)}%` 
                : `${name}: ${(percent * 100).toFixed(0)}%`
            ) : false}
            labelLine={showLabels}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={`var(--${colors[i % colors.length]})`} />
            ))}
          </Pie>
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              className="text-xs"
            />
          )}
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                
                return (
                  <div className="border border-border/50 bg-background p-2 shadow-md rounded-lg">
                    <div className="grid gap-2">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm font-medium">
                            {entry.name}:{" "}
                            {valueFormatter
                              ? valueFormatter(entry.value as number)
                              : entry.value}
                            {" "}({(entry.payload.percent * 100).toFixed(0)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

// RadarChart Component
export function RadarChart({
  data,
  index,
  categories,
  colors = ["amber-500", "purple-500", "emerald-500", "blue-500", "pink-500"],
  valueFormatter,
  showAnimation = true,
  showLegend = true,
  showTooltip = true,
  className,
  ...props
}: {
  data: Record<string, any>[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={index} className="text-xs" />
          <PolarRadiusAxis 
            tickFormatter={valueFormatter}
            axisLine={false}
            className="text-xs"
          />
          
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                
                return (
                  <div className="border border-border/50 bg-background p-2 shadow-md rounded-lg">
                    <div className="grid gap-2">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm font-medium">
                            {entry.name}:{" "}
                            {valueFormatter
                              ? valueFormatter(entry.value as number)
                              : entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          )}
          {showLegend && <Legend className="text-xs" />}
          
          {categories.map((category, i) => (
            <Radar
              key={category}
              name={category}
              dataKey={category}
              stroke={`var(--${colors[i % colors.length]})`}
              fill={`var(--${colors[i % colors.length]})`}
              fillOpacity={0.2}
              isAnimationActive={showAnimation}
              animationDuration={500}
              animationBegin={i * 100}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}