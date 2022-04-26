import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainPicker from "./ChainPicker"
import MinMaxAmount from "./MinMaxAmount"

type Props = {
  index: number
  field: Requirement
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value.toLowerCase() === input?.toLowerCase()

const TokenFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    resetField,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const type = useWatch({ name: `requirements.${index}.type` })
  const address = useWatch({ name: `requirements.${index}.address` })

  const { isLoading, tokens } = useTokens(chain)
  const mappedTokens = useMemo(
    () =>
      tokens?.map((token) => ({
        img: token.logoURI,
        label: token.name,
        value: token.address === null ? null : token.address?.toLowerCase(),
        decimals: token.decimals,
      })),
    [tokens]
  )

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    resetField(`requirements.${index}.address`)
    resetField(`requirements.${index}.data.minAmount`)
    resetField(`requirements.${index}.data.maxAmount`)
  }

  // Change type to "COIN" when address changes to "COIN"
  useEffect(() => {
    setValue(`requirements.${index}.type`, address === null ? "COIN" : "ERC20")
  }, [address])

  // Fetching token name and symbol
  const {
    data: { name: tokenName, symbol: tokenSymbol, decimals: tokenDecimals },
    isValidating: isTokenSymbolValidating,
  } = useTokenData(chain, address)

  useEffect(() => {
    try {
      setValue(
        `requirements.${index}.decimals`,
        BigNumber.from(tokenDecimals).toNumber()
      )
    } catch {
      setValue(`requirements.${index}.decimals`, undefined)
    }
  }, [tokenDecimals])

  // Saving this in a useMemo, because we're using it for form validation
  const tokenDataFetched = useMemo(
    () =>
      typeof tokenName === "string" &&
      tokenName !== "-" &&
      typeof tokenSymbol === "string" &&
      tokenSymbol !== "-",
    [tokenName, tokenSymbol]
  )

  const tokenImage = useMemo(
    () =>
      mappedTokens?.find((token) =>
        address === null
          ? token.value === null
          : token.value === address?.toLowerCase()
      )?.img,
    [address, chain]
  )

  useEffect(() => clearErrors(`requirements.${index}.address`), [type])

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
        onChange={resetForm}
      />

      <FormControl
        isRequired
        isInvalid={
          isTokenSymbolValidating
            ? errors?.requirements?.[index]?.address?.type !== "validate" &&
              !!errors?.requirements?.[index]?.address
            : !tokenDataFetched && !!errors?.requirements?.[index]?.address
        }
      >
        <FormLabel>Token:</FormLabel>

        <InputGroup>
          {typeof address !== "undefined" &&
            (tokenImage ? (
              <InputLeftElement>
                <OptionImage img={tokenImage} alt={tokenName} />
              </InputLeftElement>
            ) : (
              <InputLeftAddon px={2} maxW={14}>
                {isTokenSymbolValidating ? (
                  <Spinner size="sm" />
                ) : (
                  <Text as="span" fontSize="xs" fontWeight="bold" isTruncated>
                    {tokenSymbol}
                  </Text>
                )}
              </InputLeftAddon>
            ))}
          <Controller
            name={`requirements.${index}.address` as const}
            control={control}
            defaultValue={field.address}
            rules={{
              required: type === "ERC20" && "This field is required.",
              pattern: type === "ERC20" && {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
              validate: () =>
                // Using `getValues` instead of `useWatch` here, so the validation is triggered when the input value changes
                type === "COIN" ||
                !getValues(`requirements.${index}.address`) ||
                isTokenSymbolValidating ||
                tokenDataFetched ||
                "Failed to fetch token data",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedTokens}
                filterOption={customFilterOption}
                placeholder="Search or paste address"
                value={
                  mappedTokens?.find((token) => token.value === value) ||
                  (value
                    ? {
                        value,
                        label: tokenName && tokenName !== "-" ? tokenName : address,
                      }
                    : "")
                }
                defaultValue={mappedTokens?.find(
                  (token) => token.value === field.address
                )}
                onChange={(selectedOption: SelectOption & { decimals: number }) => {
                  onChange(selectedOption?.value)
                }}
                onBlur={onBlur}
                onInputChange={(text, _) => {
                  if (!ADDRESS_REGEX.test(text)) return
                  onChange(text)
                }}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {isTokenSymbolValidating
            ? errors?.requirements?.[index]?.address?.type !== "validate" &&
              errors?.requirements?.[index]?.address?.message
            : !tokenDataFetched && errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <MinMaxAmount field={field} index={index} format="FLOAT" />
    </>
  )
}

export default TokenFormCard
