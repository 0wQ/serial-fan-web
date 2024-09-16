import { useRef, useEffect, useCallback } from 'react'
import Header from './components/common/Header'
import Layout from './components/common/Layout'
import Footer from './components/common/Footer'
import toast, { Toaster } from 'react-hot-toast'
import useWebSerial from './hooks/useWebSerial'
import useDeviceStore from './stores/deviceStore'
import { throttle } from 'lodash'

let connectStatusToastId = ''

const makeToast = {
  firstLoad: () => {
    toast.dismiss(connectStatusToastId)
    console.log('toast', 'firstLoad')
    connectStatusToastId = toast('使用前请先连接设备', { icon: '⚠️', duration: 10000 })
  },
  connectStatus: (isConnected: boolean) => {
    toast.dismiss(connectStatusToastId)
    console.log('toast', 'connectStatus', isConnected)
    connectStatusToastId = isConnected ? toast.success('已连接设备') : toast.error('已断开设备')
  },
  openPortFailed: () => {
    toast.dismiss(connectStatusToastId)
    console.log('toast', 'openPortFailed')
    connectStatusToastId = toast.error(`打开端口失败，${'serial' in navigator ? '请检查端口是否已被占用' : '当前浏览器不支持'}`)
  },
}

const App = () => {
  const pwm = useDeviceStore(state => state.pwm)
  const setSpeed = useDeviceStore(state => state.setSpeed)
  const resetDeviceState = useDeviceStore(state => state.resetDeviceState)
  const setIsDeviceConnected = useDeviceStore(state => state.setIsDeviceConnected)

  const addSerialDataHistory = useDeviceStore(state => state.addSerialDataHistory)

  const connectBtnClickedRef = useRef(false)
  const serialDataBufferRef = useRef('')

  // Web Serial Hook
  const { isAvailable, isConnected, connect, disconnect, send } = useWebSerial({
    onData: (serialData) => handleSerialData(serialData),
  })

  // 处理串口数据
  const handleSerialData = (serialData: string) => {
    // 将接收到的数据追加到缓存中
    serialDataBufferRef.current += serialData
    // console.log('serial:', serialData.replace('\r\n', '\\r\\n'))

    // 处理每一行的数据
    let newlineIndex
    while ((newlineIndex = serialDataBufferRef.current.indexOf('\r\n')) !== -1) {
      const line = serialDataBufferRef.current.substring(0, newlineIndex)

      console.log('speed:', line)

      // 将字符串转换为数字
      const num = parseInt(line, 10)
      if (!isNaN(num)) {
        setSpeed(num)
        addSerialDataHistory(num.toString())
      }

      // 更新缓存，移除已经处理的数据
      serialDataBufferRef.current = serialDataBufferRef.current.substring(newlineIndex + 2)
    }
  }

  // 连接按钮点击事件
  const handleConnectBtnClick = useCallback(() => {
    connectBtnClickedRef.current = true
    if (isConnected) {
      disconnect()
    } else {
      connect({ baudRate: 115200, bufferSize: 8 * 1024 })
        .then(() => {
          // 连接成功 Toast
          makeToast.connectStatus(true)
        })
        .catch((e) => {
          console.warn(e)
          makeToast.openPortFailed()
        })
    }
  }, [isConnected])

  // pwm 更新节流
  const throttledSendPwmUpdate = useCallback(
    throttle((pwmValue: number) => send(new Uint8Array([pwmValue])), 200),
    []
  )

  // 发送 pwm 更新指令
  useEffect(() => {
    if (!isConnected) return
    throttledSendPwmUpdate(pwm)
  }, [pwm, throttledSendPwmUpdate])

  // 连接状态 Toast
  useEffect(() => {
    if (!connectBtnClickedRef.current) return
    isConnected || makeToast.connectStatus(false)
  }, [isConnected])

  // 重置设备 State
  useEffect(() => {
    isConnected || resetDeviceState()
  }, [isConnected])

  // 同步设备连接状态
  useEffect(() => {
    setIsDeviceConnected(isConnected)
  }, [isConnected])

  // 首次加载 Toast
  useEffect(() => {
    isConnected || makeToast.firstLoad()
    return () => {
      toast.remove(connectStatusToastId)
    }
  }, [])

  return (
    <>
      <div className="app bg-base-200 w-full min-h-[100vh] min-h-[100dvh] grid grid-rows-[auto,1fr,auto]">
        <Header isConnected={isConnected} onConnectBtnClick={handleConnectBtnClick} />
        <Layout isAvailable={isAvailable} />
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App
