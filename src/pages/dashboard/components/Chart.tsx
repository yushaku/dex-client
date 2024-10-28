import { Card } from '@/components/warper'
import { AreaChart } from '@tremor/react'

const dataFormatter = (number: number) =>
  `$${Intl.NumberFormat('us').format(number).toString()}`

export const StakedValueLockChart = () => {
  return (
    <Card className="mt-10">
      <h3 className="my-5 p-4 text-lg font-bold text-lighterAccent">
        Staked Value
      </h3>
      <AreaChart
        className="h-80"
        data={chartdata}
        index="date"
        categories={['SYK', 'USDT']}
        colors={['indigo', 'green']}
        valueFormatter={dataFormatter}
        yAxisWidth={100}
        onValueChange={(v) => console.log(v)}
      />
    </Card>
  )
}

const chartdata = [
  {
    date: 'Jan 22',
    SYK: 2890,
    USDT: 2338
  },
  {
    date: 'Feb 22',
    SYK: 2756,
    USDT: 2103
  },
  {
    date: 'Mar 22',
    SYK: 3322,
    USDT: 2194
  },
  {
    date: 'Apr 22',
    SYK: 3470,
    USDT: 2108
  },
  {
    date: 'May 22',
    SYK: 3475,
    USDT: 1812
  },
  {
    date: 'Jun 22',
    SYK: 3129,
    USDT: 1726
  },
  {
    date: 'Jul 22',
    SYK: 3490,
    USDT: 1982
  },
  {
    date: 'Aug 22',
    SYK: 2903,
    USDT: 2012
  },
  {
    date: 'Sep 22',
    SYK: 2643,
    USDT: 2342
  },
  {
    date: 'Oct 22',
    SYK: 2837,
    USDT: 2473
  },
  {
    date: 'Nov 22',
    SYK: 2954,
    USDT: 3848
  },
  {
    date: 'Dec 22',
    SYK: 3239,
    USDT: 3736
  }
]
