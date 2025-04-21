import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  Spacer,
} from '@chakra-ui/react'
import toaster from 'react-hot-toast'
import { useRef, useState } from "react"
import { useAuthStore } from '../stores/auth'
import { useNavigate } from '@tanstack/react-router'

interface Props {
  header: string
  desc: string
  isOpen: boolean
  onClose: VoidFunction
}

export default function PromptDialog(props: Props) {
  const [name, setName] = useState('')
  const cancelRef = useRef(null)
  const actions = useAuthStore(store => store.actions)
  const navigate = useNavigate()

  const onFilledName = () => {
    actions.setName(name)
    toaster.success(`Bienvenido ${name}`)
    navigate({ to: '/' })
  }

  return (
    <>
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {props.header}
            </AlertDialogHeader>

            <AlertDialogBody>
              {props.desc}
              <Input value={name} onChange={(e) => setName(e.target.value)} tabIndex={0} autoFocus placeholder="Nombre" />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={props.onClose}>
                cerrar
              </Button>
              <Spacer />
              <Button colorScheme='blue' disabled={!name} onClick={onFilledName} ml={3}>
                ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
