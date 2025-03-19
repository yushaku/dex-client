import { useNotificationsState } from '@/stores'
import { cn } from '@/utils'
import { Menu } from '@headlessui/react'
import { ArrowRightIcon, BellIcon } from '@heroicons/react/16/solid'
import { Fragment } from 'react'
import { Dropdown } from '../common'

export const NotificationDropdown = () => {
  const { itemList, remove, clearAll } = useNotificationsState()

  const Title = (
    <button className="relative flex gap-1">
      <BellIcon className="size-5" />

      {itemList.length > 0 ? (
        <span className="text-textSecondary">{itemList.length}</span>
      ) : null}
    </button>
  )

  return (
    <Dropdown isHiddenChevDown={true} title={Title} className="w-80">
      <Fragment>
        <div className="my-2 flex items-center justify-between px-4">
          <h3 className="text-lg font-bold">Notifications</h3>

          <button onClick={clearAll} className="text-sm hover:text-red-400">
            Clear all
          </button>
        </div>

        {itemList.reverse().map(({ txHash, title, description, link }) => {
          return (
            <Menu.Item key={txHash}>
              {() => (
                <div
                  className={cn(
                    'text-sm group px-4 py-2 hover:bg-focus rounded',
                  )}
                >
                  <strong className="flex items-center justify-between text-sm text-textSecondary">
                    <span>{title}</span>
                    <button
                      onClick={() => remove(txHash)}
                      className="hidden font-normal hover:text-red-400 group-hover:block"
                    >
                      remove
                    </button>
                  </strong>
                  <p className="text-textSecondary">{description}</p>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-500 "
                  >
                    View more <ArrowRightIcon className="size-4" />
                  </a>
                </div>
              )}
            </Menu.Item>
          )
        })}

        <div
          className={cn(
            'px-4 py-2 text-sm text-textSecondary',
            itemList.length > 0 && 'hidden',
          )}
        >
          <p>Notification is empty</p>
        </div>
      </Fragment>
    </Dropdown>
  )
}
