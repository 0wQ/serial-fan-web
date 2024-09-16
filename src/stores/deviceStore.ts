import { create } from 'zustand'

interface State {
  isDeviceConnected: boolean
  speed: number
  pwm: number
  pwmReceived: number
  serialDataHistory: string[]
}

interface Action {
  setIsDeviceConnected: (isConnected: boolean) => void
  setSpeed: (speed: number) => void
  setPwm: (pwm: number) => void
  setPwmReceived: (pwmReceived: number) => void
  addSerialDataHistory: (data: string) => void
  resetDeviceState: () => void
}

const useDeviceStore = create<State & Action>()((set) => ({
  isDeviceConnected: false,
  speed: 0,
  pwm: 100,
  pwmReceived: 0,
  serialDataHistory: [],
  setIsDeviceConnected: (isDeviceConnected) => set({ isDeviceConnected }),
  setSpeed: (speed) => set({ speed }),
  setPwm: (pwm) => set({ pwm }),
  setPwmReceived: (pwmReceived) => set({ pwmReceived }),
  addSerialDataHistory: (data) => set((state) => {
    if (state.serialDataHistory.length >= 300) {
      return {
        serialDataHistory: [data, ...state.serialDataHistory.slice(0, -1)],
      }
    }
    return {
      serialDataHistory: [data, ...state.serialDataHistory],
    }
  }),
  resetDeviceState: () => set((
    {
      speed: 0,
      // pwm: 0,
      pwmReceived: 0,
    }
  )),
}))

export default useDeviceStore
