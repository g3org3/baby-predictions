import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function App() {

  const { data, isFetching } = useQuery({
    queryKey: ['ipinfo'],
    staleTime: 10 * 60_000,
    async queryFn() {
      const headers = {
        'accept': 'application/json',
      }

      const r = await fetch('https://ipinfo.io/what-is-my-ip', { headers })
      const text = await r.json()
      return text
    }
  })

  const country = data?.country || ""
  const code = useMemo(() => {
    if (!country) return ""

    const byCountry: Record<string, string> = {
      "FR": "+33",
      "GT": "+502",
      "CA": "+1",
      "MX": "+52",
    }

    return byCountry[country]
  }, [country])

  return (
    <Flex bg="whitesmoke" h="100dvh" p={3}>
      <Flex bg="white" flex="1" p={3} rounded="md" flexDir="column" gap={4}>
        <Text
          bgGradient='linear(to-l, #7928CA, #FF0080)'
          bgClip='text'
          fontSize='3xl'
          fontWeight='extrabold'
        >
          Predicciones del beb&eacute;
          Gonzalez-Rodas
        </Text>
        <Input disabled={isFetching} placeholder={`${code} Telefono`} />
        <Button colorScheme="purple">Entrar</Button>
        <pre>
          data:
          {JSON.stringify(data, null, 2)}
        </pre>
      </Flex>
    </Flex>
  )
}
