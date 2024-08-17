import Mask from './Mask'
import useDeviceStore from '../stores/deviceStore'
import clsx from 'clsx'

type Props = {
  className?: string
}

const Card = ({ className }: Props) => {
  const pwm = useDeviceStore(state => state.pwm)
  const setPwm = useDeviceStore(state => state.setPwm)
  const isDeviceConnected = useDeviceStore(state => state.isDeviceConnected)

  return (
    <section className={clsx('', className)}>
      <div className="card-body px-0 py-5 sm:py-10">
        <h2 className="card-title px-5 sm:px-10 select-none">PWM</h2>

        <div className="pt-5 px-5 sm:px-10 relative">
          <Mask hide={isDeviceConnected} />

          <div className="py-5">
            <label className="label cursor-pointer gap-2">
              <span className="label-text w-12">PWM</span>
              <input type="range" min={0} max={255} step={1} value={pwm} className="my-3 range range-accent range-xs" onChange={e => setPwm(Number(e.target.value))} />
              <span className="label-text w-16 text-right">{pwm}</span>
            </label>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Card