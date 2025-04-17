import { Text, Flex, Input, Table, Tbody, Td, Tr, Thead } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '../stores/auth'
import { pb } from '../services/pb'
import { BabypredictionResponse } from '../services/pocketbase-types'
import { useMemo } from 'react'

export const Route = createFileRoute('/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const data = useAuthStore(store => store.me)
  if (!data) return null

  return (
    <Flex flex="1" overflow="auto" flexDir="column" p={4} pb={10} gap={4}>
      <Text
        bgGradient='linear(to-l, #7928CA, #FF0080)'
        bgClip='text'
        fontSize='3xl'
        textAlign="center"
        fontWeight='extrabold'
      >
        Predicciones del beb&eacute;
        Gonzalez-Rodas
      </Text>
      <Flex bg="white" p={4} rounded="md" boxShadow="md" gap={4} flexDir="column">
        <Text fontWeight="bold" fontSize="2xl">Hola {data.name}, esta es tu predicci&oacute;n</Text>
        <Flex alignItems="center" gap={3}>
          <Text>✅ Verificado</Text>
          <Input value={data.phone} minW="60px" flex="1" disabled />
        </Flex>
        <Table maxW="600px">
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Genero</Td>
              <Td>{data.genero === 'boy' ? "Niño" : "Niña"}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Fecha</Td>
              <Td>{data.due_date}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Peso</Td>
              <Td>{data.peso_lbs}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
      <ListPrediction tag={data.tag} />
    </Flex>
  )
}


function ListPrediction(props: { tag: string }) {
  const { data = [] } = useQuery({
    queryKey: ['babypredictions', 'get-all-by-tag', props.tag],
    queryFn() {
      const filter = props.tag === 'PARENTS' ? '' : `tag='${props.tag}' || tag='PARENTS'`
      return pb
        .collection("babypredictions")
        .getFullList<BabypredictionResponse>({ filter, sort: 'name' })
    }
  })

  const boyCount = useMemo(() => {
    return data.map(item => item.genero).filter(item => item === 'boy').length
  }, [data])

  return (
    <Flex flexDir="column" bg="white" p={4} rounded="md" gap={2} boxShadow="md">
      <Flex fontWeight="bold">
        <Flex flex="1" flexDir="column" alignItems="center" bg="blue.100" p={2}>
          <Flex>Niño</Flex>
          {boyCount}
        </Flex>
        <Flex flex="1" flexDir="column" alignItems="center" bg="pink.100" p={2}>
          <Flex>Niña</Flex>
          {data.length - boyCount}
        </Flex>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <Td fontWeight="bold">Nombre</Td>
            <Td fontWeight="bold">Genero</Td>
            <Td fontWeight="bold">Peso</Td>
            <Td fontWeight="bold">Fecha</Td>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(item => (
            <Tr>
              <Td>{item.name}</Td>
              <Td>******</Td>
              <Td>******</Td>
              <Td>******</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  )
}
