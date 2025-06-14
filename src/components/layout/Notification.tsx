import { useNotificationsState } from '@/stores'
import { cn } from '@/utils'
import { ArrowRightIcon, BellIcon } from '@heroicons/react/16/solid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const NotificationDropdown = () => {
  const { itemList, remove, clearAll } = useNotificationsState()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex gap-1 rounded-xl border border-gray-700 bg-layer px-6 py-3 text-sm font-semibold hover:bg-focus outline-none">
        <BellIcon className="size-5" />
        {itemList.length > 0 ? (
          <span className="text-text-secondary">{itemList.length}</span>
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 rounded-md bg-layer py-1 shadow-lg ring-1 ring-gray-700">
        <div className="my-2 flex items-center justify-between px-4">
          <h3 className="text-lg font-bold">Notifications</h3>

          <button onClick={clearAll} className="text-sm hover:text-red-400">
            Clear all
          </button>
        </div>

        {itemList.reverse().map(({ txHash, title, description, link }) => (
          <DropdownMenuItem
            key={txHash}
            className={cn(
              'text-sm group px-4 py-2 hover:bg-focus rounded-sm cursor-default',
            )}
          >
            <div>
              <strong className="flex items-center justify-between text-sm text-text-secondary">
                <span>{title}</span>
                <button
                  onClick={() => remove(txHash)}
                  className="hidden font-normal hover:text-red-400 group-hover:block"
                >
                  remove
                </button>
              </strong>
              <p className="text-text-secondary">{description}</p>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-500"
              >
                View more <ArrowRightIcon className="size-4" />
              </a>
            </div>
          </DropdownMenuItem>
        ))}

        <div
          className={cn(
            'px-4 py-2 text-sm text-text-secondary',
            itemList.length > 0 && 'hidden',
          )}
        >
          <p>Notification is empty</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
