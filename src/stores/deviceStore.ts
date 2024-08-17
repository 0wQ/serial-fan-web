import { create } from 'zustand'

interface State {
  isDeviceConnected: boolean
  speed: number
  pwm: number
  serialDataHistory: string[]
}

interface Action {
  setIsDeviceConnected: (isConnected: boolean) => void
  setSpeed: (speed: number) => void
  setPwm: (pwm: number) => void
  addSerialDataHistory: (data: string) => void
  resetDeviceState: () => void
}

const useDeviceStore = create<State & Action>()((set) => ({
  isDeviceConnected: false,
  speed: 0,
  pwm: 100,
  serialDataHistory: [],
  setIsDeviceConnected: (isDeviceConnected) => set({ isDeviceConnected }),
  setSpeed: (speed) => set({ speed }),
  setPwm: (pwm) => set({ pwm }),
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
      speed: 100,
      // pwm: 0,
    }
  )),
}))

export default useDeviceStore
