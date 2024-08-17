import { useState, useEffect, useRef, useCallback } from 'react'

interface UseWebSerialProps {
  onData: (data: string) => void
}

// 过滤设备
const filters = [
  { usbVendorId: 0x1209, usbProductId: 0xC550 },
]

// 浏览器是否支持
const isAvailable = 'serial' in navigator

const useWebSerial = ({ onData }: UseWebSerialProps) => {
  const [isConnected, setIsConnected] = useState(false)

  const onDataRef = useRef(onData)

  const portRef = useRef<SerialPort | null>(null)
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null)
  const writerRef = useRef<WritableStreamDefaultWriter | null>(null)

  // 断开连接
  const disconnect = useCallback(async () => {
    if (!isAvailable) return

    if (readerRef.current) {
      try {
        await readerRef.current.cancel()
        readerRef.current.releaseLock()
      } catch (e) {
        console.warn(e)
      } finally {
        readerRef.current = null
      }
    }

    if (writerRef.current) {
      try {
        await writerRef.current.close().catch(console.warn)
        writerRef.current.releaseLock()
      } catch (e) {
        console.warn(e)
      } finally {
        writerRef.current = null
      }
    }

    if (portRef.current) {
      try {
        await portRef.current.close()
      } catch (e) {
        console.warn(e)
      } finally {
        portRef.current = null
      }
    }

    setIsConnected(false)
  }, [])

  // 连接
  const connect = useCallback(async (options: SerialOptions) => {
    if (!isAvailable) return Promise.reject(new Error('Web Serial is not available.'))

    const readLoop = async (reader: ReadableStreamDefaultReader) => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          reader.releaseLock()
          break
        }
        if (value) onDataRef.current(new TextDecoder().decode(value))
      }
    }

    try {
      portRef.current = await navigator.serial.requestPort({ filters })
    } catch (e) {
      console.log(e)
      return Promise.reject(new Error('No port selected.'))
    }

    const { usbProductId, usbVendorId } = portRef.current.getInfo()
    console.log('usbProductId:', usbProductId, 'usbVendorId:', usbVendorId)

    try {
      await portRef.current.open(options)
    } catch (e) {
      console.log(e)
      return Promise.reject(new Error('Failed to open port.'))
    }

    setIsConnected(true)

    if (!portRef.current.readable) {
      disconnect()
      return Promise.reject(new Error('No readable stream.'))
    }

    readerRef.current = portRef.current.readable.getReader()
    readLoop(readerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 发送
  const send = useCallback(async (data: string | Uint8Array) => {
    if (!isAvailable) return Promise.reject(new Error('Web Serial is not available.'))

    if (portRef.current && portRef.current.writable) {
      try {
        if (!writerRef.current) {
          writerRef.current = portRef.current.writable.getWriter()
        }
        // writerRef.current.write(new TextEncoder().encode(data))
        writerRef.current.write(typeof data === 'string' ? new TextEncoder().encode(data) : data)
        console.log('serial send:', data)
      } catch (e) {
        disconnect()
        console.warn(e)
      } finally {
        writerRef.current?.releaseLock()
        writerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 监听断开事件
  useEffect(() => {
    if (!isAvailable) return

    const listener = () => {
      disconnect()
    }

    navigator.serial.addEventListener('disconnect', listener)

    return () => {
      navigator.serial.removeEventListener('disconnect', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isAvailable,
    isConnected,
    connect,
    disconnect,
    send,
  }
}

export default useWebSerial
