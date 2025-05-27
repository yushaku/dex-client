import { cn } from '@/utils'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/16/solid'
import { navlinks } from './sidebar'
import { useState } from 'react'

export const MobileSidebar = () => {
  const location = useLocation().pathname
  const [open, setOpen] = useState(false)

  return (
    <>
      <span className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? (
          <XMarkIcon className="size-8" />
        ) : (
          <Bars3Icon className="size-8" />
        )}
      </span>

      <nav
        className={cn(
          'absolute left-0 top-24 z-50 w-screen h-[calc(100vh-96px)] bg-layer transition-all duration-300 md:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <ul className="mt-4 space-y-4">
          {navlinks.map(({ href, title, icon: Icon, childrens }) => {
            const pickedStyle =
              location === href ? 'border-l-accent border-l-4 bg-focus' : ''
            const isOpen = location.includes(href)

            return (
              <li key={href}>
                <NavLink
                  to={href}
                  className={`${pickedStyle} group flex gap-3 px-8 py-5 hover:border-l-4 hover:border-l-accent hover:bg-focus`}
                >
                  <Icon className="size-6 fill-text-primary group-hover:fill-accent" />
                  <span
                    className={`text-text-secondary group-hover:text-accent`}
                  >
                    {title}
                  </span>

                  {childrens && <ChevronRightIcon className="ml-auto size-6" />}
                </NavLink>

                {childrens && isOpen && (
                  <ol>
                    {childrens.map(({ title, href, icon: SecondIcon }) => {
                      const pickedStyle = location.includes(href)
                        ? 'border-l-accent border-l-4 bg-focus'
                        : ''

                      return (
                        <li key={href} className="group w-full">
                          <NavLink
                            className={`${pickedStyle} flex gap-3 px-16 py-4 group-hover:text-accent`}
                            to={href}
                          >
                            <SecondIcon className="size-6 group-hover:fill-accent" />
                            <span>{title}</span>
                          </NavLink>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
