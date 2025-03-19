import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatNumber } from '@/utils'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  OnChangeFn,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAccount } from 'wagmi'

import { IconGroup } from '@/components/common/IconGroup'
import { Spinner } from '@/components/common/Loading'
import { LoadingPage } from '@/components/ui/LoadingPage'
import { AssetsContext } from '@/hooks/useAssets'
import { useNavigate } from 'react-router-dom'
import { getAddress } from 'viem'
import { UniPools, fetchPools } from '../api'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const fetchSize = 20

export function TablePool() {
  const { chainId = 1 } = useAccount()
  const navigate = useNavigate()

  const { mappedToken } = useContext(AssetsContext)

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<UniPools>[]>(
    () => [
      {
        id: 'Pools',
        cell: (info) => info.getValue(),
        header: () => <span>Pools</span>,
        accessorFn: (row) => {
          const token0 = mappedToken[getAddress(row.token0.id)]
          const token1 = mappedToken[getAddress(row.token1.id)]
          return (
            <h3 className="flex items-center gap-2">
              <IconGroup logo1={token0?.logoURI} logo2={token1?.logoURI} />
              {row.token0.symbol}/{row.token1.symbol}
            </h3>
          )
        },
      },
      {
        accessorKey: 'Fees USD',
        header: () => <span>Fees USD</span>,
        cell: (info) => info.getValue(),
        accessorFn: (row) => {
          return <h3>{formatNumber(row.feesUSD)}</h3>
        },
      },
      {
        accessorKey: 'Volume USD',
        cell: (info) => info.getValue(),
        header: () => <span>Volume USD</span>,
        size: 50,
        accessorFn: (row) => <span>{formatNumber(row.volumeUSD)}</span>,
      },
      {
        accessorKey: 'TVL',
        cell: (info) => info.getValue(),
        header: () => <span>TVL</span>,
        accessorFn: (row) => <h3>{formatNumber(row.totalValueLockedUSD)}</h3>,
      },
      {
        accessorKey: 'button',
        cell: (info) => info.getValue(),
        header: () => '',
        accessorFn: (row) => (
          <Button
            onClick={() =>
              navigate(
                `/pools/add-liquidity?token0=${row.token0.id}&token1=${row.token1.id}`,
              )
            }
            variant="outline"
            className="text-lighterAccent group-hover:bg-accent group-hover:text-primary"
          >
            Add Liquidity
            <ArrowRight className="hidden size-5 group-hover:block" />
          </Button>
        ),
      },
    ],
    [mappedToken, navigate],
  )

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ['uniswapPools', chainId], //refetch when sorting changes
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) + 1 * fetchSize
      const fetchedData = await fetchPools({
        version: 3,
        chainId,
        first: start,
        sorting,
      })
      return fetchedData
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.pools) ?? [],
    [data],
  )
  const totalDBRowCount = 150
  const totalFetched = flatData.length

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  )

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    debugTable: true,
  })

  //scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater)
    if (table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0)
    }
  }

  //since this table option is derived from table row model state, we're using the table.setOptions utility
  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }))

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div>
      <div
        className="mt-5 h-[55dvh] overflow-auto"
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        ref={tableContainerRef}
      >
        <Table>
          <TableCaption>Pool list</TableCaption>
          <TableHeader className="sticky">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={cn('cursor-pointer w-full select-none')}
                      onClick={header.column.getToggleSortingHandler}
                      key={header.id}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  )
                })}
              </tr>
            ))}
          </TableHeader>

          <TableBody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<UniPools>

              return (
                <TableRow
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  className="group absolute flex w-full cursor-pointer py-2 hover:bg-focus"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className="w-full text-left">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5 flex justify-center">
        {isFetching && <Spinner />}
      </div>
    </div>
  )
}
