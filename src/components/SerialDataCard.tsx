import Mask from './Mask'
import useDeviceStore from '../stores/deviceStore'
import clsx from 'clsx'

type Props = {
  className?: string
}

const Card = ({ className }: Props) => {
  const isDeviceConnected = useDeviceStore(state => state.isDeviceConnected)
  const serialDataHistory = useDeviceStore(state => state.serialDataHistory)

  return (
    <section className={clsx('', className)}>
      <div className="card-body px-0 py-5 sm:py-10">
        <h2 className="card-title px-5 sm:px-10 select-none">History</h2>

        <div className="pt-5 px-5 sm:px-10 relative">
          <Mask hide={isDeviceConnected} />

          <div className="min-h-24 max-h-64 p-5 rounded-md bg-base-200 overflow-y-auto text-sm font-mono text-wrap">{serialDataHistory.join(', ')}</div>
        </div>
      </div>
    </section>
  )
}

export default Card