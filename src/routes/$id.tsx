import { Text, Flex, Input, Th, Table, Tbody, Td, Tr, Thead, Button, TableContainer, TabList, Tabs, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '../stores/auth'
import { useCallback, useMemo, useState } from 'react'
import { getPredictionsByTagQuery } from '../services/predictions'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { pb } from '../services/pb'
import { BabypredictionsResponse, Collections } from '../services/pocketbase-types'
import toaster from 'react-hot-toast'
import z from 'zod'
import { DateTime } from 'luxon'

export const Route = createFileRoute('/$id')({
  component: RouteComponent,
  validateSearch: z.object({
    tag: z.string().nullish()
  })
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
      <Tabs>
        <TabList>
          <Tab>Genero</Tab>
          <Tab>Fechas</Tab>
          <Tab>Peso</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ListPrediction tag={data.tag} isAdmin={data.phone === '0767380649'} />
          </TabPanel>
          <TabPanel>
            <ListFechas tag={data.tag} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

function ListFechas(props: { tag: string }) {
  const [isExpanded, setExpanded] = useState(false)
  const { tag } = Route.useSearch()
  const { data = [] } = useQuery(getPredictionsByTagQuery({ tag: tag || props.tag }))

  const byDueDate = useMemo(() => {
    const by: Record<string, Record<string, BabypredictionsResponse[]>> = {}
    for (const item of data) {
      const duedate = item.due_date
      const [year, month] = item.due_date.split('-')
      const key = `${year}-${month}`
      if (!by[key]) {
        by[key] = {}
      }
      if (!by[key][duedate]) {
        by[key][duedate] = []
      }
      by[key][duedate].push(item)
    }
    return by
  }, [data])

  const months = useMemo(() => {
    return Object.keys(byDueDate).sort()
  }, [byDueDate])

  return (
    <Flex bg="white" boxShadow="md" flexDir="column" p="1" gap={3}>
      <Button size="sm" variant="outline" colorScheme="purple" alignSelf="center" onClick={() => setExpanded(!isExpanded)}>Ver detalle</Button>
      <Table>
        <Thead>
          <Tr>
            <Th>Fecha</Th>
            <Th>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {months.map(month => {
            const dates = Object.keys(byDueDate[month])
            const monthi18n: Record<string, string> = {
              '2025-09': 'Septiembre',
              '2025-10': 'Octubre',
              '2025-11': 'Noviembre',
              '2025-12': 'Diciembre',
              '2026-01': 'Enero',
            }
            return (<>
              <Tr>
                <Td bg={!isExpanded ? "unset" : "gray.100"}>{monthi18n[month]}</Td>
                <Td bg={!isExpanded ? "unset" : "gray.100"}>{Object.values(byDueDate[month]).map(items => items.length).reduce((sum, i) => sum + i, 0)}</Td>
              </Tr>
              {isExpanded ?
                dates.map(date => (
                  <Tr>
                    <Td fontFamily="mono">{DateTime.fromSQL(`${date} 00:00:00`).toFormat('MMM dd')}</Td>
                    <Td>{byDueDate[month][date].map(item => item.name).length}</Td>
                  </Tr>
                )) : null}
            </>
            )
          })}
        </Tbody>
      </Table>
    </Flex>
  )
}

function ListPrediction(props: { tag: string, isAdmin: boolean }) {
  const { tag } = Route.useSearch()
  const { data = [] } = useQuery(getPredictionsByTagQuery({ tag: tag || props.tag }))
  const isEnabled = useFeatureFlagEnabled("show_others_results")

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
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Td fontWeight="bold">Nombre</Td>
              <Td fontWeight="bold">Genero</Td>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(item => (
              <Tr key={item.id}>
                <Td><Flag code={item.codigo} /> {item.name}</Td>
                <Td>{isEnabled ? item.genero : '*****'}</Td>
                {props.isAdmin ? <Td><DeleteButton id={item.id} /></Td> : null}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

function DeleteButton(props: { id: string }) {
  const { mutate, isPending } = useMutation({
    mutationFn(id: string) {
      return pb.collection(Collections.Babypredictions).delete(id)
    },
    onSuccess() {
      toaster.success("Deleted")
    },
    onError() {
      toaster.error("Failed to delete")
    }
  })
  const onDelete = useCallback(() => {
    mutate(props.id)
  }, [mutate, props.id])

  return (
    <Button isLoading={isPending} onClick={onDelete} size="sm">del</Button>
  )
}

function Flag(props: { code: string }) {
  if (props.code === 'GT') return <>🇬🇹</>
  if (props.code === 'MX') return <>🇲🇽</>
  if (props.code === 'US') return <>🇺🇸</>
  if (props.code === 'FR') return <>🇫🇷</>
  if (props.code === 'ES') return <>🇪🇸</>
  if (props.code === 'CA') return <>🇨🇦</>
  return <>🏁</>
}
