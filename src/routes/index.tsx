import { createFileRoute } from '@tanstack/react-router'
import { Button, CircularProgress, Flex, Input, Select, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { pb } from '../services/pb'
import { BabypredictionRecord } from '../services/pocketbase-types'
import { useState } from 'react'
import toaster from 'react-hot-toast'
import { useAuthStore } from '../stores/auth'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const name = useAuthStore(s => s.name)
  const ip = useAuthStore(s => s.ip)
  const phone = useAuthStore(s => s.phone)
  const [genero, setGenero] = useState('')
  const [fecha, setFecha] = useState('')
  const [peso, setPeso] = useState('')

  const { data, isFetching } = useQuery({
    queryKey: ['get-prediction', phone, name],
    queryFn() {
      return pb.collection("babypredictions").getFirstListItem<BabypredictionRecord>(`phone='${phone}'`)
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Partial<BabypredictionRecord>) => {
      return pb.collection("babypredictions").create(payload)
    },
    onSuccess() {
      toaster.success("Guardado!")
    }
  })

  const onSubmit = () => {
    if (!name || !phone) return

    mutate({
      name,
      phone,
      genero,
      due_date: fecha,
      peso_lbs: peso,
      ip: ip || {},
    })
  }

  if (isFetching) {
    return <Flex flex="1" p={2} rounded="md" flexDir="column" gap={4}>
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
      <Flex h="200px" bg="white" p={4} rounded="md" boxShadow="md" gap={4} flexDir="column" justifyContent="center" alignItems="center">
        <CircularProgress isIndeterminate />
      </Flex>
    </Flex>
  }

  if (data) {
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
          <Text fontWeight="bold" fontSize="2xl">Hola {name}, esta es tu predicci&oacute;n</Text>
          <Flex alignItems="center" gap={3}>
            <Text>✅ Verificado</Text>
            <Input value={phone || ""} minW="60px" flex="1" disabled />
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
        <Text fontWeight="bold" fontSize="2xl">Hola {name}, haz tu predicci&oacute;n</Text>
        <Flex alignItems="center" gap={3}>
          <Text>✅ Verificado</Text>
          <Input value={phone || ""} minW="60px" flex="1" disabled />
        </Flex>
        <Text>Genero</Text>
        <Select disabled={isPending} defaultValue={genero} onChange={(e) => setGenero(e.target.value)}>
          <option value="">-</option>
          <option value="boy">Niño</option>
          <option value="girl">Niña</option>
        </Select>
        <Text>Fecha</Text>
        <Input disabled={isPending} value={fecha} onChange={(e) => setFecha(e.target.value)} type="date" />
        <Text>Peso en libras</Text>
        <Input disabled={isPending} value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Peso en libras" type="number" />
        <Button isLoading={isPending} onClick={onSubmit} colorScheme="purple">Guardar</Button>
      </Flex>
    </Flex>
  )
}
