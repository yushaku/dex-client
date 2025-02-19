import { Spinner } from '../common/Loading'

export const LoadingPage = () => {
  return (
    <div className="flex-center size-full">
      <div className="flex-center">
        <Spinner />
      </div>
    </div>
  )
}
