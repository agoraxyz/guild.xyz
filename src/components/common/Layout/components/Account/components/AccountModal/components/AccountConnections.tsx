import {
  Collapse,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Section from "components/common/Section"
import useUser from "components/[guild]/hooks/useUser"
import usePersonalSign from "hooks/usePersonalSign"
import { Check, Plus, Question } from "phosphor-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import LinkedAddress from "./LinkedAddress"

const AccountConnections = () => {
  const { isLoading, addresses, linkedAddressesCount } = useUser()
  const { addressSignedMessage, sign, isSigning } = usePersonalSign()
  const { account } = useWeb3React()

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "all" })

  return (
    <Stack spacing="10" w="full">
      {/* <Section title="Connected Discord account">
        {!addressSignedMessage ? (
          <Text colorScheme="gray">
            Hidden. Verify that you're the owner of this account below to view
          </Text>
        ) : (
          <Text colorScheme="gray">Account id: {discordId}</Text>
        )}
      </Section> */}
      <Section
        title="Linked addresses"
        titleRightElement={
          linkedAddressesCount && (
            <Popover placement="top" trigger="hover">
              <PopoverTrigger>
                <Icon as={Question} />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  If you join a guild with another address, but with the same Discord
                  account, your addresses will be linked together and each will be
                  used for requirement checks.
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )
        }
      >
        {isLoading && !addresses ? (
          <Spinner />
        ) : !linkedAddressesCount ? (
          <Text colorScheme="gray">
            If you join a guild with another address, but with the same Discord
            account, your addresses will be linked together and each will be used for
            requirement checks.
          </Text>
        ) : !Array.isArray(addresses) ? (
          <Text colorScheme="gray">
            {linkedAddressesCount} address{linkedAddressesCount > 1 && "es"} hidden.
            Verify that you're the owner of this account below to view{" "}
            {linkedAddressesCount > 1 ? "them" : "it"}
          </Text>
        ) : (
          <Stack spacing={4} pt="2" alignItems="start" w="full">
            {addresses
              .filter((address) => address?.toLowerCase() !== account.toLowerCase())
              .map((address) => (
                <LinkedAddress key={address} address={address} />
              ))}
          </Stack>
        )}
      </Section>
      {!addressSignedMessage && linkedAddressesCount && (
        <Button
          onClick={() => sign()}
          isLoading={isSigning}
          loadingText="Check your wallet"
        >
          Sign message to verify address
        </Button>
      )}

      <Stack justifyContent="center" width="full">
        <Collapse in={isAddAddressOpen} animateOpacity>
          <FormControl isRequired isInvalid={errors?.newAddress}>
            <Input
              {...register("newAddress", {
                required: "This field is required.",
                pattern: {
                  value: /^0x[A-F0-9]{40}$/i,
                  message: "Please enter a valid address",
                },
              })}
              placeholder="Paste address"
            />
            <FormErrorMessage>{errors?.newAddress?.message}</FormErrorMessage>
          </FormControl>
        </Collapse>

        <Button
          leftIcon={<Icon as={isAddAddressOpen ? Check : Plus} />}
          colorScheme={isAddAddressOpen ? "green" : undefined}
          size="sm"
          onClick={
            isAddAddressOpen
              ? handleSubmit(console.log, console.log)
              : () => setIsAddAddressOpen(true)
          }
        >
          Add a new address
        </Button>
      </Stack>
    </Stack>
  )
}

export default AccountConnections
