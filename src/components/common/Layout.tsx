import { memo } from 'react'

import PWMCard from '../PWMCard'
import AboutCard from '../AboutCard'
import SerialDataCard from '../SerialDataCard'
import DeviceInfoCard from '../DeviceInfoCard'

interface Props {
  isAvailable: boolean
}

const Layout = memo(({ isAvailable }: Props) => {

  return (
    <main className="px-2">

      {
        isAvailable || (
          <div role="alert" className="max-w-5xl mx-auto mb-5 alert alert-warning py-5 flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>当前浏览器不支持 Web Serial API, 请使用 <span className='font-bold underline'>桌面版</span> Chrome / Edge 89 及以上版本</p>
          </div>
        )
      }

      <DeviceInfoCard className='max-w-5xl mx-auto card mb-5 sm:mb-10 bg-base-100' />
      <PWMCard className='max-w-5xl mx-auto card mb-5 sm:mb-10 bg-base-100' />
      <SerialDataCard className='max-w-5xl mx-auto card mb-5 sm:mb-10 bg-base-100' />
      <AboutCard className='max-w-5xl mx-auto card mb-5 sm:mb-10 bg-base-100' />
    </main >
  )
})

export default Layout