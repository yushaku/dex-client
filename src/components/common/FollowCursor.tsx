import { useMouse } from '@/hooks'

export function FollowCursor() {
  const [mouse, parentRef] = useMouse()

  const translate3d = `translate3d(${mouse.elementX}px, ${mouse.elementY}px, 0)`

  return (
    <div
      className="relative size-full cursor-none overflow-hidden"
      ref={parentRef}
    >
      <div
        className="pointer-events-none absolute -left-3 -top-3 size-6 rounded-full border border-neutral-500/20 bg-neutral-500/15"
        style={{
          transform: translate3d,
        }}
      />
    </div>
  )
}
