import { Input, InputGroup, Select } from "@chakra-ui/react"
import { useIp } from "../services/ip"

export default function PhoneInput(props: { isDisabled?: boolean }) {
  return (
    <InputGroup>
      <SelectCountry isDisabled={props.isDisabled} />
      <Input name="phone" disabled={props.isDisabled} borderLeft="0" borderLeftRadius="0px" placeholder="Telefono: 403920293" />
    </InputGroup>
  )
}

function SelectCountry(props: { isDisabled?: boolean }) {
  const { country, isFetching } = useIp()

  if (isFetching) {
    return <Select
      borderRightRadius="0px"
      disabled
      fontSize="2xl"
      w="100px"
    >
    </Select>
  }

  return (
    <Select
      borderRightRadius="0px"
      defaultValue={country}
      disabled={props.isDisabled || isFetching}
      fontSize="2xl"
      name="phoneCountry"
      w="100px"
    >
      <option value="GT">🇬🇹</option>
      <option value="MX">🇲🇽</option>
      <option value="FR">🇫🇷</option>
      <option value="ES">🇪🇸</option>
      <option value="US">🇺🇸</option>
      <option value="CA">🇨🇦</option>
    </Select>
  )
}
