import { FormEventHandler, useCallback } from "react"
import { Button, Flex, Text } from '@chakra-ui/react'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toaster from 'react-hot-toast'
import z from 'zod'
import { pb } from "../services/pb"
import { BabypredictionResponse } from "../services/pocketbase-types"
import { useAuthStore } from "../stores/auth"
import { useNavigate } from "@tanstack/react-router"
import PhoneInput from "./PhoneInput"
import { consumeForm } from "../services/form"
import { usePostHog } from "posthog-js/react"
import { getPredictionsByTagQuery } from "../services/predictions"

const schema = z.object({
  phone: z.string().min(8),
  phoneCountry: z.string().length(2),
})

export default function Login() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const actions = useAuthStore(store => store.actions)
  const posthog = usePostHog()

  const { mutate, isPending } = useMutation({
    mutationFn({ phone, phoneCountry }: z.infer<typeof schema>) {
      const filter = `phone='${phone}' && codigo='${phoneCountry}'`

      return pb.collection('babypredictions')
        .getFirstListItem<BabypredictionResponse>(filter)
    },
    onSuccess(item) {
      actions.setMe(item)
      posthog?.capture('success-login', { phone: item.phone, name: item.name })
      toaster.success(`Bienvenido ${item.name}`)
      posthog?.identify(item.phone, { phone: item.phone, name: item.name })
      queryClient.ensureQueryData(getPredictionsByTagQuery({ tag: item.tag }))
      navigate({ to: '/$id', params: { id: item.id } })
    },
    onError() {
      const name = prompt('No hemos encontrado tu numero, ingresa tu nombre.')
      posthog?.capture('signup', { name })
      if (name) {
        actions.setName(name)
        toaster.success(`Bienvenido ${name}`)
        navigate({ to: '/' })
      } else {
        window.location.reload()
      }
    }
  })

  const onPhoneSearch: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    if (isPending) return

    const payload = consumeForm(schema, e)
    if (payload.error) {
      toaster.error("Seguro que has ingresado tu numero?")
      return
    }
    actions.setPhone(payload.data.phone)
    actions.setCountry(payload.data.phoneCountry)
    posthog?.capture('search-phone', { phone: payload.data.phone, code: payload.data.phoneCountry })
    mutate(payload.data)
  }, [actions, isPending, mutate, posthog])

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
      <form onSubmit={onPhoneSearch}>
        <Flex flexDir="column" bg="white" p={4} boxShadow="md" rounded="md" gap={2}>
          <Text>Por favor, introduce tu número de teléfono para participar</Text>
          <Flex flexDir="column" gap={4}>
            <PhoneInput isDisabled={isPending} />
            <Button isLoading={isPending} type="submit" colorScheme="purple">Entrar</Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  )
}
