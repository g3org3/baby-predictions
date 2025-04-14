import { create } from 'zustand'
import z from 'zod'
import { ipschema } from '../services/ip'

interface State {
  phone: string | null
  name: string | null
  ip: z.infer<typeof ipschema> | null
}

interface Actions {
  setPhone: (phone: string | null) => void
  setName: (name: string | null) => void
  setIp: (ip: z.infer<typeof ipschema> | undefined) => void
}

interface Store extends State {
  actions: Actions
}

export const useAuthStore = create<Store>((set) => ({
  phone: null,
  name: null,
  ip: null,
  actions: {
    setPhone(phone) {
      set({ phone })
    },
    setName(name) {
      set({ name })
    },
    setIp(ip) {
      set({ ip })
    },
  }
}))
