import { CardContent } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card } from '@/components/warper'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export const StakedValueLockChart = () => {
  return (
    <Card className="mt-10">
      <h3 className="my-5 p-4 text-lg font-bold text-lighterAccent">
        Staked Value
      </h3>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid className="opacity-10" vertical={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={1}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const chartdata = [
  {
    date: 'Jan 22',
    SYK: 2890,
    USDT: 2338,
  },
  {
    date: 'Feb 22',
    SYK: 2756,
    USDT: 2103,
  },
  {
    date: 'Mar 22',
    SYK: 3322,
    USDT: 2194,
  },
  {
    date: 'Apr 22',
    SYK: 3470,
    USDT: 2108,
  },
  {
    date: 'May 22',
    SYK: 3475,
    USDT: 1812,
  },
  {
    date: 'Jun 22',
    SYK: 3129,
    USDT: 1726,
  },
  {
    date: 'Jul 22',
    SYK: 3490,
    USDT: 1982,
  },
  {
    date: 'Aug 22',
    SYK: 2903,
    USDT: 2012,
  },
  {
    date: 'Sep 22',
    SYK: 2643,
    USDT: 2342,
  },
  {
    date: 'Oct 22',
    SYK: 2837,
    USDT: 2473,
  },
  {
    date: 'Nov 22',
    SYK: 2954,
    USDT: 3848,
  },
  {
    date: 'Dec 22',
    SYK: 3239,
    USDT: 3736,
  },
]
