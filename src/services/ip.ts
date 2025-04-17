import { useQuery } from '@tanstack/react-query'
import z from 'zod'
import { useAuthStore } from '../stores/auth'
import { useEffect } from 'react'

export const ipschema = z.object({
  ip: z.string().ip(),
  hostname: z.string(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  loc: z.string(),
  org: z.string(),
  postal: z.string(),
  timezone: z.string(),
})

export const useIp = () => {
  const actions = useAuthStore(store => store.actions)
  const { data, isFetching } = useQuery({
    queryKey: ['ipinfo'],
    async queryFn() {
      const headers = {
        'accept': 'application/json',
      }

      const res = await fetch('https://ipinfo.io/what-is-my-ip', { headers })

      return res.json() as Promise<z.infer<typeof ipschema>>
    }
  })

  useEffect(() => {
    actions.setIp(data)
  }, [actions, data])

  return { data, isFetching, country: data?.country || "GT" }
}
