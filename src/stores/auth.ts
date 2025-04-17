import { create } from 'zustand'
import z from 'zod'
import { ipschema } from '../services/ip'
import { BabypredictionResponse } from '../services/pocketbase-types'

interface State {
  phone: string | null
  country: string | null
  name: string | null
  ip: z.infer<typeof ipschema> | null
  me: BabypredictionResponse | null
}

interface Actions {
  setPhone: (phone: string | null) => void
  setCountry: (country: string | null) => void
  setName: (name: string | null) => void
  setIp: (ip: z.infer<typeof ipschema> | undefined) => void
  setMe: (me: BabypredictionResponse) => void
}

interface Store extends State {
  actions: Actions
}

export const useAuthStore = create<Store>((set) => ({
  phone: null,
  name: null,
  ip: null,
  me: null,
  country: null,
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
    setMe(me) {
      set({ me })
    },
    setCountry(country) {
      set({ country })
    },
  }
}))
