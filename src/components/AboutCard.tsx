import { memo } from 'react'
import clsx from 'clsx'

type Props = {
  className?: string
}

const Card = memo(({ className }: Props) => (
  <section className={clsx('', className)}>
    <div className="card-body p-5 sm:p-10">
      <h2 className="card-title pb-5">About</h2>
      <p>This project is an open-source web-based fan controller that enables control of a fan via a USB serial connection. The hardware is based on the CH552G chip.</p>
      <p>For more information, please visit <a href="https://github.com/0wQ/serial-fan-web" className="link link-secondary">https://github.com/0wQ/serial-fan-web</a>.</p>
    </div>
  </section>
))

export default Card