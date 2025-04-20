import { createFileRoute } from '@tanstack/react-router'
import { Button, Flex, Input, Select, Text } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { pb } from '../services/pb'
import { BabypredictionRecord, BabypredictionResponse } from '../services/pocketbase-types'
import { useState } from 'react'
import toaster from 'react-hot-toast'
import { useAuthStore } from '../stores/auth'
import { usePostHog } from 'posthog-js/react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const name = useAuthStore(s => s.name)
  const ip = useAuthStore(s => s.ip)
  const phone = useAuthStore(store => store.phone)
  const codigo = useAuthStore(store => store.country)
  const actions = useAuthStore(store => store.actions)
  const posthog = usePostHog()
  const [genero, setGenero] = useState('')
  const [fecha, setFecha] = useState('')
  const [peso, setPeso] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Partial<BabypredictionRecord>) => {
      return pb.collection("babypredictions").create<BabypredictionResponse>(payload)
    },
    onSuccess(item) {
      actions.setMe(item)
      posthog?.capture('save-prediction')
      toaster.success("Guardado!")
      navigate({ to: '/$id', params: { id: item.id } })
    },
    onError(e) {
      posthog?.captureException(e)
      posthog?.capture('failed-to-save-prediction')
    }
  })

  const onSubmit = () => {
    if (!name || !phone || isPending) return

    posthog?.capture('save-prediction')
    mutate({
      name,
      phone,
      genero,
      due_date: fecha,
      peso_lbs: peso,
      codigo: codigo || '',
      ip: ip || {},
    })
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
