import { useQuery } from '@tanstack/react-query'
import z from 'zod'

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
  const { data, isFetching } = useQuery({
    queryKey: ['ipinfo2'],
    async queryFn() {
      const headers = {
        'accept': 'application/json',
      }

      const r = await fetch('https://ipinfo.io/what-is-my-ip', { headers })
      const text = await r.text()
      return ipschema.parse(text)
    }
  })

  return { data, isFetching }
}
