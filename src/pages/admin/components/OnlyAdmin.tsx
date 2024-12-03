import { Vector } from '@/pages/Comming'

export const OnlyAdmin = () => {
  return (
    <div className="relative h-full">
      <Vector className="fixed inset-0 h-screen w-screen" />
      <h1 className="absolute left-1/2 top-[35%] -translate-x-1/2 text-[60px] font-bold">
        Only Admin
      </h1>
    </div>
  )
}
