import { FormEventHandler, useMemo, useState } from "react"
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { useIp } from "../services/ip"
import { useAuthStore } from "../stores/auth"
import { useNavigate } from "@tanstack/react-router"
import toaster from 'react-hot-toast'

export default function Login() {
  const { data } = useIp()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const actions = useAuthStore((s) => s.actions)
  const navigate = useNavigate()

  const country = data?.country || ""
  const code = useMemo(() => {
    if (!country) return ""

    const byCountry: Record<string, string> = {
      "FR": "+33",
      "GT": "+502",
      "CA": "+1",
      "US": "+1",
      "MX": "+52",
    }

    return byCountry[country]
  }, [country])

  const onSumbit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    actions.setPhone(phone.trim())
    actions.setName(name.trim())
    actions.setIp(data)
    toaster.success("Exito!")
    setPhone('')
    navigate({ to: '/' })
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
      <Flex flexDir="column" bg="white" p={4} boxShadow="md" rounded="md">
        <Text>Por favor, introduce tu número de teléfono para participar</Text>
        <form onSubmit={onSumbit}>
          <Flex flexDir="column" gap={4}>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={`${code} Telefono`} />
            <small>Introduce tu nombre completo</small>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
            <Button disabled={!name || !phone || phone.length < 8} type="submit" colorScheme="purple">Entrar</Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  )
}
