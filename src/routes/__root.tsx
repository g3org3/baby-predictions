import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Flex } from '@chakra-ui/react'
import { useAuthStore } from '../stores/auth'
import { Toaster } from 'react-hot-toast'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const phone = useAuthStore(s => s.phone)
  const navigate = Route.useNavigate()

  React.useEffect(() => {
    if (phone === null) {
      navigate({ to: '/login' })
    }
  }, [navigate, phone])


  return (
    <React.Fragment>
      <Flex w="100dvw" h="100dvh" bg="whitesmoke" overflow="auto">
        <Outlet />
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </Flex>
    </React.Fragment>
  )
}
