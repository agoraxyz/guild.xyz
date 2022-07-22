import {
  Icon,
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
import Section from "components/common/Section"
import useUser from "components/[guild]/hooks/useUser"
import { Question } from "phosphor-react"
import { PlatformAccountDetails, PlatformName, PlatformType } from "types"
import LinkedAddress from "./LinkedAddress"
import LinkedSocialAccount from "./LinkedSocialAccount"

const AccountConnections = () => {
  const { isLoading, addresses, platformUsers } = useUser()
  const { account } = useWeb3React()

  return (
    <Stack spacing="10" w="full">
      <Section title="Linked social accounts">
        {isLoading ? (
          <Spinner />
        ) : !!platformUsers?.[0] && !("platformUserId" in platformUsers[0]) ? (
          <Text colorScheme="gray">
            {`${platformUsers
              ?.map(
                (platformUser) =>
                  /** TODO: the BE will return the displayable names for the platforms too */
                  `${platformUser.platformName[0].toUpperCase()}${platformUser.platformName
                    .slice(1)
                    .toLowerCase()}`
              )
              .join(
                " and "
              )} hidden. Verify that you're the owner of this account below to view`}
          </Text>
        ) : platformUsers?.length > 0 ? (
          platformUsers.map(
            ({
              platformId,
              platformUserId,
              username,
              avatar,
            }: PlatformAccountDetails) => (
              <LinkedSocialAccount
                key={platformUserId}
                name={username}
                image={avatar}
                type={PlatformType[platformId] as PlatformName}
              />
            )
          )
        ) : (
          <Text colorScheme={"gray"}>No social accounts</Text>
        )}
      </Section>
      <Section
        title="Linked addresses"
        titleRightElement={
          addresses?.length > 1 && (
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
        {isLoading ? (
          <Spinner />
        ) : addresses?.length === 1 && addresses?.[0] === account.toLowerCase() ? (
          <Text colorScheme={"gray"}>No linked addresses</Text>
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
    </Stack>
  )
}

export default AccountConnections
