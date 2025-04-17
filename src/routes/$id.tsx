import { Text, Flex, Input, Table, Tbody, Td, Tr } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '../stores/auth'

export const Route = createFileRoute('/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const data = useAuthStore(store => store.me)
  if (!data) return null

  return (
    <Flex flex="1" p={2} rounded="md" flexDir="column" gap={4}>
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
    </Flex>
  )
}
