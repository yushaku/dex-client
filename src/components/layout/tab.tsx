import { HTMLAttributes } from 'react'

type TabType = HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean
  children: React.ReactNode
}
export const Tab = ({ isOpen, children, ...props }: TabType) => {
  const className = props.className
  return (
    <div
      className={`${className} ${
        isOpen ? 'w-full opacity-100' : 'w-0 overflow-hidden opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
