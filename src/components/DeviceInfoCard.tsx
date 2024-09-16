import clsx from 'clsx'
import Mask from './Mask'
import useDeviceStore from '../stores/deviceStore'

type Props = {
  className?: string
}

const splitNumber = (num: number) => {
  // 将数字转换为字符串
  let strNumber = num.toString()
  // 如果字符串长度为奇数，则在前面补零
  if (strNumber.length % 2 !== 0) {
    strNumber = '0' + strNumber
  }
  // 如果字符串长度小于4，则在前面补零
  while (strNumber.length < 4) {
    strNumber = '0'.repeat(4 - strNumber.length) + strNumber
  }
  // 将每两个字符输出到数组中
  const resultArray = []
  for (let i = 0; i < strNumber.length; i += 2) {
    resultArray.push(strNumber.slice(i, i + 2))
  }
  return resultArray
}

const forceHideMask = false

const Card = ({ className }: Props) => {
  const isDeviceConnected = useDeviceStore(state => state.isDeviceConnected)
  const speed = useDeviceStore(state => state.speed)
  const pwmReceived = useDeviceStore(state => state.pwmReceived)

  return (
    <section className={clsx('', className)}>
      <div className="card-body px-0 py-5 sm:py-10 select-none">
        <h2 className="card-title px-5 sm:px-10">Device Info</h2>

        <div className="w-full pt-5 px-5 sm:px-10 relative">
          <Mask hide={forceHideMask || isDeviceConnected} />

          <div className="stats stats-vertical sm:stats-horizontal w-full relative">

            <div className="stat  mx-auto">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="stat-title">Fan Speed (RPM)</div>
              <div className="stat-value text-primary countdown font-mono">
                {
                  splitNumber(speed).map((num, index) => (
                    <span key={index} style={{ '--value': num } as React.CSSProperties}></span>
                  ))
                }
              </div>
            </div>

            <div className="stat mx-auto">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="stat-title">PWM Value</div>
              <div className="stat-value text-primary countdown font-mono">
                {
                  splitNumber(pwmReceived).map((num, index) => (
                    <span key={index} style={{ '--value': num } as React.CSSProperties}></span>
                  ))
                }
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>

  )
}

export default Card