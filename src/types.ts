type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type DiscordError = { error: string; errorDescription: string }

type WalletError = { code: number; message: string }

type Rest = {
  [x: string]: any
}

type Logic = "AND" | "OR" | "NOR" | "NAND"

type ThemeMode = "LIGHT" | "DARK"

type Theme = {
  color?: string
  mode?: ThemeMode
  backgroundImage?: string
  backgroundCss?: string
}

type CoingeckoToken = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type Poap = {
  id: number
  fancy_id: string
  name: string
  event_url?: string
  image_url: string
  country?: string
  city?: string
  description?: string
  year: number
  start_date: string
  end_date: string
  expiry_date: string
  from_admin: boolean
  virtual_event: boolean
  event_template_id: number
  event_host_id: number
}

type NFT = {
  name: string
  type: string
  address: string
  logoUri: string
  slug: string
}

type RequirementType =
  | "COIN"
  | "ERC20"
  | "ERC721"
  | "ERC1155"
  | "POAP"
  | "MIRROR"
  | "UNLOCK"
  | "SNAPSHOT"
  | "JUICEBOX"
  | "GALAXY"
  | "ALLOWLIST"
  | "FREE"

type SupportedChains =
  | "ETHEREUM"
  | "POLYGON"
  | "GNOSIS"
  | "BSC"
  | "AVALANCHE"
  | "FANTOM"
  | "ARBITRUM"
  | "BSC"
  | "OPTIMISM"
  | "MOONRIVER"
  | "RINKEBY"
  | "METIS"
  | "CRONOS"
  | "BOBA"

type NftRequirementType = "AMOUNT" | "ATTRIBUTE" | "CUSTOM_ID"

type PlatformName = "TELEGRAM" | "DISCORD" | ""

type PlatformAccount = {
  platformId: number
  platformName: PlatformName
}
type PlatformAccountDetails = PlatformAccount & {
  platformUserId: string
  username: string
  avatar: string
}

type GuildBase = {
  name: string
  urlName: string
  imageUrl: string
  roles: Array<string>
  platforms: Array<PlatformName>
  memberCount: number
}

type GuildAdmin = {
  id: number
  address: string
  isOwner: boolean
}

type PlatformGuildData = {
  DISCORD: {
    inviteChannel: string
    joinButton?: boolean
  }
}

type PlatformRoleData = {
  DISCORD: {
    isGuarded: boolean
  }
}

type Requirement = {
  id: number
  data?: {
    hideAllowlist?: boolean
    minAmount?: number
    maxAmount?: number
    addresses?: Array<string> // (ALLOWLIST)
    id?: string // fancy_id (POAP), edition id (MIRROR), id of the project (JUICEBOX)
    strategy?: {
      name: string
      params: Record<string, any>
    } // SNAPSHOT
    attribute?: {
      trait_type?: string
      value?: string
      interval?: {
        min: number
        max: number
      }
    }
    galaxyId?: string
  }
  name: string
  type: RequirementType
  chain: SupportedChains
  roleId: number
  symbol: string
  address: string
  decimals?: number

  // Props used inside the forms on the UI
  active?: boolean
  nftRequirementType?: string

  // These props are only used when we fetch requirements from the backend and display them on the UI
  balancyDecimals?: number
}

type RolePlatform = {
  platformRoleId?: string
  guildPlatformId: number
  platformRoleData?: PlatformRoleData[keyof PlatformRoleData]
}

type User = {
  id: number
  addresses: Array<string>
  telegramId?: string
  discordId?: string
  platformUsers: PlatformAccountDetails[]
  discord?: {
    username: string
    avatar: string
  }
  telegram?: {
    username: string
    avatar: string
  }
}

type Role = {
  id: number
  name: string
  logic: Logic
  members: string[]
  imageUrl?: string
  description?: string
  memberCount: number
  requirements: Requirement[]
  rolePlatforms: RolePlatform[]
}

type Platform = {
  id: number
  platformId: PlatformType
  platformGuildId: string
  platformGuildData?: PlatformGuildData[keyof PlatformGuildData]
  invite?: string
  platformGuildName: string
}

type GuildPoap = {
  id: number
  poapIdentifier: number
  fancyId: string
  activated: boolean
  contract: string
  chainId: number
  expiryDate: number
}

type Guild = {
  id: number
  name: string
  urlName: string
  description?: string
  imageUrl: string
  showMembers: boolean
  hideFromExplorer: boolean
  createdAt: string
  admins: GuildAdmin[]
  theme: Theme
  guildPlatforms: Platform[]
  roles: Role[]
  members: Array<string>
  poaps: Array<GuildPoap>
  onboardingComplete: boolean
}
type GuildFormType = Partial<
  Pick<Guild, "id" | "urlName" | "name" | "imageUrl" | "description" | "theme">
> & {
  guildPlatforms?: (Partial<Platform> & { platformName: string })[]
  roles?: Array<
    Partial<
      Omit<Role, "requirements" | "rolePlatforms"> & {
        requirements: Array<Partial<Requirement>>
        rolePlatforms: Array<Partial<RolePlatform> & { guildPlatformIndex: number }>
      }
    >
  >
  logic?: Logic
  requirements?: Requirement[]
}

enum RequirementTypeColors {
  ERC721 = "var(--chakra-colors-green-400)",
  ERC1155 = "var(--chakra-colors-green-400)",
  POAP = "var(--chakra-colors-blue-400)",
  MIRROR = "var(--chakra-colors-gray-300)",
  ERC20 = "var(--chakra-colors-indigo-400)",
  COIN = "var(--chakra-colors-indigo-400)",
  SNAPSHOT = "var(--chakra-colors-orange-400)",
  ALLOWLIST = "var(--chakra-colors-gray-200)",
  UNLOCK = "var(--chakra-colors-salmon-400)",
  JUICEBOX = "var(--chakra-colors-yellow-500)",
  GALAXY = "var(--chakra-colors-black)",
  FREE = "var(--chakra-colors-cyan-400)",
}

type SnapshotStrategy = {
  name: string
  params: Record<string, Record<string, string>>
}

type JuiceboxProject = {
  id: string
  uri: string
  name: string
  logoUri: string
}

type MirrorEdition = {
  editionContractAddress: string
  editionId: number
  title: string
  image: string
}

type SelectOption = {
  label: string
  value: string
  img?: string
} & Rest

// Requested with Discord OAuth token
type DiscordServerData = {
  id: string
  name: string
  icon: string
  owner: boolean
  permissions: number
  features: string[]
  permissions_new: string
}

type CreatePoapForm = {
  name: string
  description: string
  city: string
  country: string
  start_date: string
  end_date: string
  expiry_date: string
  year: number
  event_url: string
  virtual_event: boolean
  image: File
  secret_code: number
  event_template_id: number
  email: string
  requested_codes: number
  private_event: boolean
}

type CreatedPoapData = {
  id?: number
  fancy_id?: string
  name: string
  description: string
  city: string
  country: string
  start_date: string
  end_date: string
  expiry_date: string
  year: number
  event_url: string
  virtual_event: boolean
  image_url?: string
  event_template_id: number
  private_event: boolean
  event_host_id?: number
}

export enum PlatformType {
  "UNSET" = -1,
  "DISCORD" = 1,
  "TELEGRAM" = 2,
}

type WalletConnectConnectionData = {
  connected: boolean
  accounts: string[]
  chainId: number
  bridge: string
  key: string
  clientId: string
  clientMeta: {
    description: string
    url: string
    icons: string[]
    name: string
  }
  peerId: string
  peerMeta: {
    description: string
    url: string
    icons: string[]
    name: string
  }
  handshakeId: number
  handshakeTopic: string
}

enum ValidationMethod {
  STANDARD = 1,
  KEYPAIR = 2,
  EIP1271 = 3,
}

type GalaxyCampaign = {
  id: string
  numberID: number
  name: string
  thumbnail: string
  chain: SupportedChains
}

type MonetizePoapForm = {
  chainId: number
  token: string
  fee: number
  owner: string
}

export type {
  WalletConnectConnectionData,
  DiscordServerData,
  GuildAdmin,
  Token,
  DiscordError,
  WalletError,
  Rest,
  CoingeckoToken,
  Poap,
  User,
  NFT,
  Role,
  Platform,
  GuildBase,
  Guild,
  Requirement,
  RequirementType,
  SupportedChains,
  SnapshotStrategy,
  JuiceboxProject,
  MirrorEdition,
  ThemeMode,
  Logic,
  PlatformAccountDetails,
  SelectOption,
  NftRequirementType,
  GuildFormType,
  CreatePoapForm,
  CreatedPoapData,
  PlatformName,
  GalaxyCampaign,
  MonetizePoapForm,
}
export { ValidationMethod, RequirementTypeColors }
