/* eslint-disable */
// Auto-generated TypeScript types from Strapi schema
// Do not edit manually
// Base types

/**
 * Scalar identifier accepted by the Strapi v5 REST API for relations and media.
 * Strings are treated as documentId; numbers fall back to the legacy numeric id.
 */
export type StrapiID = string | number

/**
 * Explicit relation operations supported by Strapi v5.
 * See: https://docs.strapi.io/cms/api/rest/relations
 */
export interface RelationOperations {
  connect?:
    | StrapiID[]
    | {
        documentId: string
        position?: { before?: StrapiID; after?: StrapiID; start?: true; end?: true }
      }[]
  disconnect?: StrapiID[]
  set?: StrapiID[]
}

/**
 * Input value for a relation field in create/update payloads.
 * Accepts a single id, an array of ids, or the explicit { connect | disconnect | set } form.
 * Passing a plain id or array is equivalent to 'set' — it overwrites existing relations.
 */
export type RelationInput = StrapiID | StrapiID[] | RelationOperations | null

/**
 * Input value for a single media file field. Accepts a documentId (string) or
 * legacy numeric id.
 */
export type MediaInput = StrapiID | null

/**
 * Input value for a multi-media field. Accepts an array of ids.
 */
export type MultiMediaInput = StrapiID[] | null

export interface MediaFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string | null
  size: number
  width: number
  height: number
  sizeInBytes: number
}

export interface BaseMediaFormats {
  thumbnail?: MediaFormat
  small?: MediaFormat
  medium?: MediaFormat
  large?: MediaFormat
  [key: string]: MediaFormat | undefined
}

export interface MediaFile {
  id: number
  name: string
  alternativeText: string | null
  caption: string | null
  focalPoint: { x: number; y: number } | null
  width: number | null
  height: number | null
  formats: BaseMediaFormats | null
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  createdAt: string
  updatedAt: string
}

/**
 * A locale as returned by the i18n plugin's content API.
 * Shape follows the response validator @strapi/i18n applies to GET /i18n/locales.
 */
export interface I18nLocale {
  id: number
  documentId: string
  name: string
  code: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

/**
 * The admin user behind `createdBy` / `updatedBy`, as the content API returns it.
 * Only the four attributes admin::user leaves non-private survive sanitization —
 * email, roles and the token fields are private and never sent. The document
 * base fields come with it: Strapi's own guide lists neither documentId nor
 * publishedAt, but a live 5.44 backend returns both.
 */
export interface AdminUser {
  id: number
  documentId: string
  firstname: string | null
  lastname: string | null
  username: string | null
  preferedLanguage: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

// Strapi Blocks Editor API Types
// Based on: https://docs.strapi.io/dev-docs/api/document/blocks

/**
 * Main type for Strapi Blocks content
 */
export type BlocksContent = Block[]

/**
 * All possible block types
 */
export type Block = ParagraphBlock | HeadingBlock | QuoteBlock | CodeBlock | ListBlock | ImageBlock

/**
 * Paragraph block - default text block
 */
export interface ParagraphBlock {
  type: 'paragraph'
  children: InlineNode[]
}

/**
 * Heading block - h1 to h6
 */
export interface HeadingBlock {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: InlineNode[]
}

/**
 * Quote block - blockquote
 */
export interface QuoteBlock {
  type: 'quote'
  children: InlineNode[]
}

/**
 * Code block - preformatted code with optional language
 */
export interface CodeBlock {
  type: 'code'
  language?: string
  children: InlineNode[]
}

/**
 * List block - ordered or unordered (supports nesting)
 */
export interface ListBlock {
  type: 'list'
  format: 'ordered' | 'unordered'
  children: (ListItemBlock | ListBlock)[]
}

/**
 * List item - individual item in a list
 */
export interface ListItemBlock {
  type: 'list-item'
  children: InlineNode[]
}

/**
 * Image block - embedded image
 */
export interface ImageBlock {
  type: 'image'
  image: {
    name: string
    alternativeText?: string | null
    url: string
    caption?: string | null
    width: number
    height: number
    formats?: BaseMediaFormats
    hash: string
    ext: string
    mime: string
    size: number
    previewUrl?: string | null
    provider: string
    provider_metadata?: unknown | null
    createdAt: string
    updatedAt: string
  }
  children: [{ type: 'text'; text: '' }]
}

/**
 * Inline nodes - text formatting and inline elements
 */
export type InlineNode = TextNode | LinkInline

/**
 * Plain text node with optional formatting
 */
export interface TextNode {
  type: 'text'
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

/**
 * Inline link
 */
export interface LinkInline {
  type: 'link'
  url: string
  children: TextNode[]
}
// Helper types for field and sort options in populate
type _EntityField<T> = Exclude<keyof T & string, '__typename'>
type _SortValue<T> = _EntityField<T> | `${_EntityField<T>}:${'asc' | 'desc'}`

// Apply fields narrowing from populate entry (e.g. populate: { item: { fields: ["title"] } })
type _ApplyFields<TFull, TBase, TEntry> = TEntry extends true
  ? TFull
  : TEntry extends { fields: readonly (infer F extends string)[] }
    ? Pick<TBase, Extract<F | 'id' | 'documentId', keyof TBase>> & Omit<TFull, keyof TBase>
    : TFull

export interface AwardsCategory {
  id: number
  category: string
}

export interface AwardsPosition {
  id: number
  position: string
}

export interface SharedAchievement {
  id: number
  year: number
  title: string
  details: string
}

export interface SharedAshsParticipant {
  id: number
  title: string
  details: unknown
  /** @default 0 */
  voteCount: number
  voteDetails: unknown
}

export interface SharedSchedule {
  id: number
  date: string
  event: string
  description: string
  timings: string | null
}

export interface SharedVideo {
  id: number
  title: string
  video: unknown | null
  description: string
}

/** Create input for AwardsCategory */
export interface AwardsCategoryCreateInput {
  id?: number
  category: string
  positions?: AwardsPositionCreateInput[] | null
}

/** Update input for AwardsCategory */
export interface AwardsCategoryUpdateInput {
  id?: number
  category?: string
  positions?: AwardsPositionUpdateInput[] | null
}

/** Create input for AwardsPosition */
export interface AwardsPositionCreateInput {
  id?: number
  position: string
  pujas?: RelationInput
  artist?: RelationInput
}

/** Update input for AwardsPosition */
export interface AwardsPositionUpdateInput {
  id?: number
  position?: string
  pujas?: RelationInput
  artist?: RelationInput
}

/** Create input for SharedAchievement */
export interface SharedAchievementCreateInput {
  id?: number
  year: number
  title: string
  details: string
}

/** Update input for SharedAchievement */
export interface SharedAchievementUpdateInput {
  id?: number
  year?: number
  title?: string
  details?: string
}

/** Create input for SharedAshsParticipant */
export interface SharedAshsParticipantCreateInput {
  id?: number
  title: string
  details: unknown
  /** @default 0 */
  voteCount: number
  voteDetails: unknown
  puja?: RelationInput
}

/** Update input for SharedAshsParticipant */
export interface SharedAshsParticipantUpdateInput {
  id?: number
  title?: string
  details?: unknown
  /** @default 0 */
  voteCount?: number
  voteDetails?: unknown
  puja?: RelationInput
}

/** Create input for SharedSchedule */
export interface SharedScheduleCreateInput {
  id?: number
  date: string
  event: string
  description: string
  timings?: string | null
}

/** Update input for SharedSchedule */
export interface SharedScheduleUpdateInput {
  id?: number
  date?: string
  event?: string
  description?: string
  timings?: string | null
}

/** Create input for SharedVideo */
export interface SharedVideoCreateInput {
  id?: number
  title: string
  video?: unknown | null
  description: string
}

/** Update input for SharedVideo */
export interface SharedVideoUpdateInput {
  id?: number
  title?: string
  video?: unknown | null
  description?: string
}

export interface Artist {
  readonly __typename?: 'Artist'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  name: string
  type: 'idol' | 'decoration' | 'light' | 'theme'
  businessName: string | null
  /** @maxLength 10 */
  contact: string | null
  email: string | null
}

export interface AshsEntry {
  readonly __typename?: 'AshsEntry'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  year: number
}

export interface Award {
  readonly __typename?: 'Award'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  year: number
  description: string
}

export interface Contact {
  readonly __typename?: 'Contact'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  name: string
  location: unknown
  contact: string
}

export interface Global {
  readonly __typename?: 'Global'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  processionListPublished: boolean | null
}

export interface Image {
  readonly __typename?: 'Image'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  category:
    | 'puja'
    | 'preparation'
    | 'banner'
    | 'events'
    | 'idolmaking'
    | 'eyecreation'
    | 'procession'
    | 'immersion'
    | 'lighting'
    | 'pandal'
    | 'kathamo-puja'
  name: string
  year: number
}

export interface Partnership {
  readonly __typename?: 'Partnership'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  year: number
  amount: number
  email: string
  name: string
  orderId: string | null
  paymentId: string | null
  /** @minLength 10 */
  phone: string
  planName: string
  planValue: number
  addons: unknown | null
  note: string | null
  /** @default true */
  fullPaid: boolean | null
}

export interface Procession {
  readonly __typename?: 'Procession'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  zone: 'A' | 'B' | 'C' | 'D'
  truckCount: number
  /** @default 0 */
  sortOrder: number
}

export interface Puja {
  readonly __typename?: 'Puja'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  name: string
  zone: 'chandannagar' | 'bhadreswar'
  estd: number
  /** @default "[]" */
  tags: unknown | null
  info: string | null
  location: unknown | null
  theme: string | null
  slug: string
  /** @default 0 */
  sortOrder: number
  referenceId: string
}

export interface VirtualTour {
  readonly __typename?: 'VirtualTour'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  year: number
  name: string | null
}

export interface Permission {
  readonly __typename?: 'Permission'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  action: string
}

export interface Role {
  readonly __typename?: 'Role'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  /** @minLength 3 */
  name: string
  description: string | null
  type: string | null
}

export interface User {
  readonly __typename?: 'User'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  /** @minLength 3 */
  username: string
  /** @minLength 6 */
  email: string
  provider: string | null
  /** @default false */
  confirmed: boolean | null
  /** @default false */
  blocked: boolean | null
  /** @default "visitor" */
  pujaAccess: 'admin' | 'editor' | 'visitor'
}

/** Create input for Artist */
export interface ArtistCreateInput {
  name: string
  type: 'idol' | 'decoration' | 'light' | 'theme'
  businessName?: string | null
  /** @maxLength 10 */
  contact?: string | null
  email?: string | null
  pujas?: RelationInput
}

/** Update input for Artist */
export interface ArtistUpdateInput {
  name?: string
  type?: 'idol' | 'decoration' | 'light' | 'theme'
  businessName?: string | null
  /** @maxLength 10 */
  contact?: string | null
  email?: string | null
  pujas?: RelationInput
}

/** Create input for AshsEntry */
export interface AshsEntryCreateInput {
  year: number
  entries?: SharedAshsParticipantCreateInput[] | null
}

/** Update input for AshsEntry */
export interface AshsEntryUpdateInput {
  year?: number
  entries?: SharedAshsParticipantUpdateInput[] | null
}

/** Create input for Award */
export interface AwardCreateInput {
  year: number
  description: string
  categories?: AwardsCategoryCreateInput[] | null
}

/** Update input for Award */
export interface AwardUpdateInput {
  year?: number
  description?: string
  categories?: AwardsCategoryUpdateInput[] | null
}

/** Create input for Contact */
export interface ContactCreateInput {
  name: string
  location: unknown
  contact: string
}

/** Update input for Contact */
export interface ContactUpdateInput {
  name?: string
  location?: unknown
  contact?: string
}

/** Create input for Global */
export interface GlobalCreateInput {
  processionListPublished?: boolean | null
  schedules?: SharedScheduleCreateInput[] | null
  videos?: SharedVideoCreateInput[] | null
  achievements?: SharedAchievementCreateInput[] | null
}

/** Update input for Global */
export interface GlobalUpdateInput {
  processionListPublished?: boolean | null
  schedules?: SharedScheduleUpdateInput[] | null
  videos?: SharedVideoUpdateInput[] | null
  achievements?: SharedAchievementUpdateInput[] | null
}

/** Create input for Image */
export interface ImageCreateInput {
  category:
    | 'puja'
    | 'preparation'
    | 'banner'
    | 'events'
    | 'idolmaking'
    | 'eyecreation'
    | 'procession'
    | 'immersion'
    | 'lighting'
    | 'pandal'
    | 'kathamo-puja'
  name: string
  year: number
  puja?: RelationInput
  user?: RelationInput
}

/** Update input for Image */
export interface ImageUpdateInput {
  category?:
    | 'puja'
    | 'preparation'
    | 'banner'
    | 'events'
    | 'idolmaking'
    | 'eyecreation'
    | 'procession'
    | 'immersion'
    | 'lighting'
    | 'pandal'
    | 'kathamo-puja'
  name?: string
  year?: number
  puja?: RelationInput
  user?: RelationInput
}

/** Create input for Partnership */
export interface PartnershipCreateInput {
  year: number
  amount: number
  email: string
  name: string
  orderId?: string | null
  paymentId?: string | null
  /** @minLength 10 */
  phone: string
  planName: string
  planValue: number
  addons?: unknown | null
  note?: string | null
  /** @default true */
  fullPaid?: boolean | null
  puja?: RelationInput
}

/** Update input for Partnership */
export interface PartnershipUpdateInput {
  year?: number
  amount?: number
  email?: string
  name?: string
  orderId?: string | null
  paymentId?: string | null
  /** @minLength 10 */
  phone?: string
  planName?: string
  planValue?: number
  addons?: unknown | null
  note?: string | null
  /** @default true */
  fullPaid?: boolean | null
  puja?: RelationInput
}

/** Create input for Procession */
export interface ProcessionCreateInput {
  zone: 'A' | 'B' | 'C' | 'D'
  truckCount: number
  /** @default 0 */
  sortOrder: number
  puja?: RelationInput
}

/** Update input for Procession */
export interface ProcessionUpdateInput {
  zone?: 'A' | 'B' | 'C' | 'D'
  truckCount?: number
  /** @default 0 */
  sortOrder?: number
  puja?: RelationInput
}

/** Create input for Puja */
export interface PujaCreateInput {
  name: string
  zone: 'chandannagar' | 'bhadreswar'
  estd: number
  /** @default "[]" */
  tags?: unknown | null
  info?: string | null
  location?: unknown | null
  theme?: string | null
  slug: string
  /** @default 0 */
  sortOrder: number
  referenceId: string
  media?: MultiMediaInput
  artists?: RelationInput
  images?: RelationInput
}

/** Update input for Puja */
export interface PujaUpdateInput {
  name?: string
  zone?: 'chandannagar' | 'bhadreswar'
  estd?: number
  /** @default "[]" */
  tags?: unknown | null
  info?: string | null
  location?: unknown | null
  theme?: string | null
  slug?: string
  /** @default 0 */
  sortOrder?: number
  referenceId?: string
  media?: MultiMediaInput
  artists?: RelationInput
  images?: RelationInput
}

/** Create input for VirtualTour */
export interface VirtualTourCreateInput {
  year: number
  name?: string | null
  puja?: RelationInput
}

/** Update input for VirtualTour */
export interface VirtualTourUpdateInput {
  year?: number
  name?: string | null
  puja?: RelationInput
}

/** Create input for Permission */
export interface PermissionCreateInput {
  action: string
  role?: RelationInput
}

/** Update input for Permission */
export interface PermissionUpdateInput {
  action?: string
  role?: RelationInput
}

/** Create input for Role */
export interface RoleCreateInput {
  /** @minLength 3 */
  name: string
  description?: string | null
  type?: string | null
  permissions?: RelationInput
  users?: RelationInput
}

/** Update input for Role */
export interface RoleUpdateInput {
  /** @minLength 3 */
  name?: string
  description?: string | null
  type?: string | null
  permissions?: RelationInput
  users?: RelationInput
}

/** Create input for User */
export interface UserCreateInput {
  /** @minLength 3 */
  username: string
  /** @minLength 6 */
  email: string
  provider?: string | null
  /** @default false */
  confirmed?: boolean | null
  /** @default false */
  blocked?: boolean | null
  /** @default "visitor" */
  pujaAccess: 'admin' | 'editor' | 'visitor'
  role?: RelationInput
  puja?: RelationInput
}

/** Update input for User */
export interface UserUpdateInput {
  /** @minLength 3 */
  username?: string
  /** @minLength 6 */
  email?: string
  provider?: string | null
  /** @default false */
  confirmed?: boolean | null
  /** @default false */
  blocked?: boolean | null
  /** @default "visitor" */
  pujaAccess?: 'admin' | 'editor' | 'visitor'
  role?: RelationInput
  puja?: RelationInput
}
export const PartnershipDefaults = {
  fullPaid: true,
} as const satisfies Partial<PartnershipCreateInput>
export const ProcessionDefaults = { sortOrder: 0 } as const satisfies Partial<ProcessionCreateInput>
export const PujaDefaults = { tags: '[]', sortOrder: 0 } as const satisfies Partial<PujaCreateInput>
export const UserDefaults = {
  confirmed: false,
  blocked: false,
  pujaAccess: 'visitor',
} as const satisfies Partial<UserCreateInput>
export const SharedAshsParticipantDefaults = {
  voteCount: 0,
} as const satisfies Partial<SharedAshsParticipantCreateInput>
// ============================================
// PopulateParam types for type-safe populate
// ============================================
export type AwardsCategoryPopulateParam = {
  positions?:
    | true
    | {
        fields?: (keyof AwardsPosition & string)[]
        populate?:
          AwardsPositionPopulateParam | (keyof AwardsPositionPopulateParam & string)[] | '*'
      }
}
export type AwardsPositionPopulateParam = {
  pujas?:
    | true
    | {
        fields?: _EntityField<Puja>[]
        populate?: PujaPopulateParam | (keyof PujaPopulateParam & string)[] | '*'
        filters?: PujaFilters
        sort?: _SortValue<Puja> | _SortValue<Puja>[]
        limit?: number
        start?: number
      }
  artist?:
    | true
    | {
        fields?: _EntityField<Artist>[]
        populate?: ArtistPopulateParam | (keyof ArtistPopulateParam & string)[] | '*'
        filters?: ArtistFilters
        sort?: _SortValue<Artist> | _SortValue<Artist>[]
        limit?: number
        start?: number
      }
}
export type SharedAshsParticipantPopulateParam = {
  puja?:
    | true
    | {
        fields?: _EntityField<Puja>[]
        populate?: PujaPopulateParam | (keyof PujaPopulateParam & string)[] | '*'
        filters?: PujaFilters
        sort?: _SortValue<Puja> | _SortValue<Puja>[]
        limit?: number
        start?: number
      }
}
export type ArtistPopulateParam = {
  pujas?:
    | true
    | {
        fields?: _EntityField<Puja>[]
        populate?: PujaPopulateParam | (keyof PujaPopulateParam & string)[] | '*'
        filters?: PujaFilters
        sort?: _SortValue<Puja> | _SortValue<Puja>[]
        limit?: number
        start?: number
      }
}
export type AshsEntryPopulateParam = {
  entries?:
    | true
    | {
        fields?: (keyof SharedAshsParticipant & string)[]
        populate?:
          | SharedAshsParticipantPopulateParam
          | (keyof SharedAshsParticipantPopulateParam & string)[]
          | '*'
      }
}
export type AwardPopulateParam = {
  categories?:
    | true
    | {
        fields?: (keyof AwardsCategory & string)[]
        populate?:
          AwardsCategoryPopulateParam | (keyof AwardsCategoryPopulateParam & string)[] | '*'
      }
}
export type GlobalPopulateParam = {
  schedules?: true | { fields?: (keyof SharedSchedule & string)[] }
  videos?: true | { fields?: (keyof SharedVideo & string)[] }
  achievements?: true | { fields?: (keyof SharedAchievement & string)[] }
}
export type ImagePopulateParam = {
  puja?:
    | true
    | {
        fields?: _EntityField<Puja>[]
        populate?: PujaPopulateParam | (keyof PujaPopulateParam & string)[] | '*'
        filters?: PujaFilters
        sort?: _SortValue<Puja> | _SortValue<Puja>[]
        limit?: number
        start?: number
      }
  user?:
    | true
    | {
        fields?: _EntityField<User>[]
        populate?: UserPopulateParam | (keyof UserPopulateParam & string)[] | '*'
        filters?: UserFilters
        sort?: _SortValue<User> | _SortValue<User>[]
        limit?: number
        start?: number
      }
}
export type PartnershipPopulateParam = {
  puja?:
    | true
    | {
        fields?: _EntityField<Puja>[]
        populate?: PujaPopulateParam | (keyof PujaPopulateParam & string)[] | '*'
        filters?: PujaFilters
        sort?: _SortValue<Puja> | _SortValue<Puja>[]
        limit?: number
        start?: number
      }
}
export type ProcessionPopulateParam = {
  puja?:
    | true
    | {
        fields?: _EntityField<Puja>[]
        populate?: PujaPopulateParam | (keyof PujaPopulateParam & string)[] | '*'
        filters?: PujaFilters
        sort?: _SortValue<Puja> | _SortValue<Puja>[]
        limit?: number
        start?: number
      }
}
export type PujaPopulateParam = {
  artists?:
    | true
    | {
        fields?: _EntityField<Artist>[]
        populate?: ArtistPopulateParam | (keyof ArtistPopulateParam & string)[] | '*'
        filters?: ArtistFilters
        sort?: _SortValue<Artist> | _SortValue<Artist>[]
        limit?: number
        start?: number
      }
  images?:
    | true
    | {
        fields?: _EntityField<Image>[]
        populate?: ImagePopulateParam | (keyof ImagePopulateParam & string)[] | '*'
        filters?: ImageFilters
        sort?: _SortValue<Image> | _SortValue<Image>[]
        limit?: number
        start?: number
      }
  media?: true | { fields?: (keyof MediaFile & string)[] }
}
export type VirtualTourPopulateParam = {
  puja?:
    | true
    | {
        fields?: _EntityField<Puja>[]
        populate?: PujaPopulateParam | (keyof PujaPopulateParam & string)[] | '*'
        filters?: PujaFilters
        sort?: _SortValue<Puja> | _SortValue<Puja>[]
        limit?: number
        start?: number
      }
}
export type PermissionPopulateParam = {
  role?:
    | true
    | {
        fields?: _EntityField<Role>[]
        populate?: RolePopulateParam | (keyof RolePopulateParam & string)[] | '*'
        filters?: RoleFilters
        sort?: _SortValue<Role> | _SortValue<Role>[]
        limit?: number
        start?: number
      }
}
export type RolePopulateParam = {
  permissions?:
    | true
    | {
        fields?: _EntityField<Permission>[]
        populate?: PermissionPopulateParam | (keyof PermissionPopulateParam & string)[] | '*'
        filters?: PermissionFilters
        sort?: _SortValue<Permission> | _SortValue<Permission>[]
        limit?: number
        start?: number
      }
  users?:
    | true
    | {
        fields?: _EntityField<User>[]
        populate?: UserPopulateParam | (keyof UserPopulateParam & string)[] | '*'
        filters?: UserFilters
        sort?: _SortValue<User> | _SortValue<User>[]
        limit?: number
        start?: number
      }
}
export type UserPopulateParam = {
  role?:
    | true
    | {
        fields?: _EntityField<Role>[]
        populate?: RolePopulateParam | (keyof RolePopulateParam & string)[] | '*'
        filters?: RoleFilters
        sort?: _SortValue<Role> | _SortValue<Role>[]
        limit?: number
        start?: number
      }
  puja?:
    | true
    | {
        fields?: _EntityField<Puja>[]
        populate?: PujaPopulateParam | (keyof PujaPopulateParam & string)[] | '*'
        filters?: PujaFilters
        sort?: _SortValue<Puja> | _SortValue<Puja>[]
        limit?: number
        start?: number
      }
}
// Prisma-like Payload types for populate support
// These types allow type-safe population of relations
//
// Usage example:
// type ItemWithCategory = ItemGetPayload<{ populate: { category: true } }>
// const items = await strapi.items.find({ populate: { category: true } }) as ItemWithCategory[]
//
// This ensures that relations are only included in the type when populate is used
// Payload type for AwardsCategory with populate support
export type AwardsCategoryGetPayload<P extends { populate?: unknown } = {}> = AwardsCategory &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          positions?: AwardsPosition[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            positions?: 'positions' extends Pop[number] ? AwardsPosition[] : never
          }
        : {
            positions?: 'positions' extends keyof Pop
              ? _ApplyFields<
                  Pop['positions'] extends { populate: infer NestedPop }
                    ? AwardsPositionGetPayload<{ populate: NestedPop }>
                    : AwardsPosition,
                  AwardsPosition,
                  Pop['positions']
                >[]
              : never
          }
    : {})
// Payload type for AwardsPosition with populate support
export type AwardsPositionGetPayload<P extends { populate?: unknown } = {}> = AwardsPosition &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          pujas?: Puja[]
          artist?: Artist | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            pujas?: 'pujas' extends Pop[number] ? Puja[] : never
            artist?: 'artist' extends Pop[number] ? Artist | null : never
          }
        : {
            pujas?: 'pujas' extends keyof Pop
              ? _ApplyFields<
                  Pop['pujas'] extends { populate: infer NestedPop }
                    ? PujaGetPayload<{ populate: NestedPop }>
                    : Puja,
                  Puja,
                  Pop['pujas']
                >[]
              : never
            artist?: 'artist' extends keyof Pop
              ? _ApplyFields<
                  Pop['artist'] extends { populate: infer NestedPop }
                    ? ArtistGetPayload<{ populate: NestedPop }>
                    : Artist,
                  Artist,
                  Pop['artist']
                > | null
              : never
          }
    : {})
// Payload type for SharedAshsParticipant with populate support
export type SharedAshsParticipantGetPayload<P extends { populate?: unknown } = {}> =
  SharedAshsParticipant &
    (P extends { populate: infer Pop }
      ? Pop extends '*' | true
        ? {
            puja?: Puja | null
          }
        : Pop extends readonly (infer _)[]
          ? {
              puja?: 'puja' extends Pop[number] ? Puja | null : never
            }
          : {
              puja?: 'puja' extends keyof Pop
                ? _ApplyFields<
                    Pop['puja'] extends { populate: infer NestedPop }
                      ? PujaGetPayload<{ populate: NestedPop }>
                      : Puja,
                    Puja,
                    Pop['puja']
                  > | null
                : never
            }
      : {})
// Payload type for Artist with populate support
export type ArtistGetPayload<P extends { populate?: unknown } = {}> = Artist &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          pujas?: Puja[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            pujas?: 'pujas' extends Pop[number] ? Puja[] : never
          }
        : {
            pujas?: 'pujas' extends keyof Pop
              ? _ApplyFields<
                  Pop['pujas'] extends { populate: infer NestedPop }
                    ? PujaGetPayload<{ populate: NestedPop }>
                    : Puja,
                  Puja,
                  Pop['pujas']
                >[]
              : never
          }
    : {})
// Payload type for AshsEntry with populate support
export type AshsEntryGetPayload<P extends { populate?: unknown } = {}> = AshsEntry &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          entries?: SharedAshsParticipant[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            entries?: 'entries' extends Pop[number] ? SharedAshsParticipant[] : never
          }
        : {
            entries?: 'entries' extends keyof Pop
              ? _ApplyFields<
                  Pop['entries'] extends { populate: infer NestedPop }
                    ? SharedAshsParticipantGetPayload<{ populate: NestedPop }>
                    : SharedAshsParticipant,
                  SharedAshsParticipant,
                  Pop['entries']
                >[]
              : never
          }
    : {})
// Payload type for Award with populate support
export type AwardGetPayload<P extends { populate?: unknown } = {}> = Award &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          categories?: AwardsCategory[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            categories?: 'categories' extends Pop[number] ? AwardsCategory[] : never
          }
        : {
            categories?: 'categories' extends keyof Pop
              ? _ApplyFields<
                  Pop['categories'] extends { populate: infer NestedPop }
                    ? AwardsCategoryGetPayload<{ populate: NestedPop }>
                    : AwardsCategory,
                  AwardsCategory,
                  Pop['categories']
                >[]
              : never
          }
    : {})
// Payload type for Global with populate support
export type GlobalGetPayload<P extends { populate?: unknown } = {}> = Global &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          schedules?: SharedSchedule[]
          videos?: SharedVideo[]
          achievements?: SharedAchievement[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            schedules?: 'schedules' extends Pop[number] ? SharedSchedule[] : never
            videos?: 'videos' extends Pop[number] ? SharedVideo[] : never
            achievements?: 'achievements' extends Pop[number] ? SharedAchievement[] : never
          }
        : {
            schedules?: 'schedules' extends keyof Pop
              ? _ApplyFields<SharedSchedule, SharedSchedule, Pop['schedules']>[]
              : never
            videos?: 'videos' extends keyof Pop
              ? _ApplyFields<SharedVideo, SharedVideo, Pop['videos']>[]
              : never
            achievements?: 'achievements' extends keyof Pop
              ? _ApplyFields<SharedAchievement, SharedAchievement, Pop['achievements']>[]
              : never
          }
    : {})
// Payload type for Image with populate support
export type ImageGetPayload<P extends { populate?: unknown } = {}> = Image &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          puja?: Puja | null
          user?: User | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            puja?: 'puja' extends Pop[number] ? Puja | null : never
            user?: 'user' extends Pop[number] ? User | null : never
          }
        : {
            puja?: 'puja' extends keyof Pop
              ? _ApplyFields<
                  Pop['puja'] extends { populate: infer NestedPop }
                    ? PujaGetPayload<{ populate: NestedPop }>
                    : Puja,
                  Puja,
                  Pop['puja']
                > | null
              : never
            user?: 'user' extends keyof Pop
              ? _ApplyFields<
                  Pop['user'] extends { populate: infer NestedPop }
                    ? UserGetPayload<{ populate: NestedPop }>
                    : User,
                  User,
                  Pop['user']
                > | null
              : never
          }
    : {})
// Payload type for Partnership with populate support
export type PartnershipGetPayload<P extends { populate?: unknown } = {}> = Partnership &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          puja?: Puja | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            puja?: 'puja' extends Pop[number] ? Puja | null : never
          }
        : {
            puja?: 'puja' extends keyof Pop
              ? _ApplyFields<
                  Pop['puja'] extends { populate: infer NestedPop }
                    ? PujaGetPayload<{ populate: NestedPop }>
                    : Puja,
                  Puja,
                  Pop['puja']
                > | null
              : never
          }
    : {})
// Payload type for Procession with populate support
export type ProcessionGetPayload<P extends { populate?: unknown } = {}> = Procession &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          puja?: Puja | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            puja?: 'puja' extends Pop[number] ? Puja | null : never
          }
        : {
            puja?: 'puja' extends keyof Pop
              ? _ApplyFields<
                  Pop['puja'] extends { populate: infer NestedPop }
                    ? PujaGetPayload<{ populate: NestedPop }>
                    : Puja,
                  Puja,
                  Pop['puja']
                > | null
              : never
          }
    : {})
// Payload type for Puja with populate support
export type PujaGetPayload<P extends { populate?: unknown } = {}> = Puja &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          artists?: Artist[]
          images?: Image[]
          media?: MediaFile[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            artists?: 'artists' extends Pop[number] ? Artist[] : never
            images?: 'images' extends Pop[number] ? Image[] : never
            media?: 'media' extends Pop[number] ? MediaFile[] : never
          }
        : {
            artists?: 'artists' extends keyof Pop
              ? _ApplyFields<
                  Pop['artists'] extends { populate: infer NestedPop }
                    ? ArtistGetPayload<{ populate: NestedPop }>
                    : Artist,
                  Artist,
                  Pop['artists']
                >[]
              : never
            images?: 'images' extends keyof Pop
              ? _ApplyFields<
                  Pop['images'] extends { populate: infer NestedPop }
                    ? ImageGetPayload<{ populate: NestedPop }>
                    : Image,
                  Image,
                  Pop['images']
                >[]
              : never
            media?: 'media' extends keyof Pop
              ? _ApplyFields<MediaFile, MediaFile, Pop['media']>[]
              : never
          }
    : {})
// Payload type for VirtualTour with populate support
export type VirtualTourGetPayload<P extends { populate?: unknown } = {}> = VirtualTour &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          puja?: Puja | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            puja?: 'puja' extends Pop[number] ? Puja | null : never
          }
        : {
            puja?: 'puja' extends keyof Pop
              ? _ApplyFields<
                  Pop['puja'] extends { populate: infer NestedPop }
                    ? PujaGetPayload<{ populate: NestedPop }>
                    : Puja,
                  Puja,
                  Pop['puja']
                > | null
              : never
          }
    : {})
// Payload type for Permission with populate support
export type PermissionGetPayload<P extends { populate?: unknown } = {}> = Permission &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          role?: Role | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            role?: 'role' extends Pop[number] ? Role | null : never
          }
        : {
            role?: 'role' extends keyof Pop
              ? _ApplyFields<
                  Pop['role'] extends { populate: infer NestedPop }
                    ? RoleGetPayload<{ populate: NestedPop }>
                    : Role,
                  Role,
                  Pop['role']
                > | null
              : never
          }
    : {})
// Payload type for Role with populate support
export type RoleGetPayload<P extends { populate?: unknown } = {}> = Role &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          permissions?: Permission[]
          users?: User[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            permissions?: 'permissions' extends Pop[number] ? Permission[] : never
            users?: 'users' extends Pop[number] ? User[] : never
          }
        : {
            permissions?: 'permissions' extends keyof Pop
              ? _ApplyFields<
                  Pop['permissions'] extends { populate: infer NestedPop }
                    ? PermissionGetPayload<{ populate: NestedPop }>
                    : Permission,
                  Permission,
                  Pop['permissions']
                >[]
              : never
            users?: 'users' extends keyof Pop
              ? _ApplyFields<
                  Pop['users'] extends { populate: infer NestedPop }
                    ? UserGetPayload<{ populate: NestedPop }>
                    : User,
                  User,
                  Pop['users']
                >[]
              : never
          }
    : {})
// Payload type for User with populate support
export type UserGetPayload<P extends { populate?: unknown } = {}> = User &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          role?: Role | null
          puja?: Puja | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            role?: 'role' extends Pop[number] ? Role | null : never
            puja?: 'puja' extends Pop[number] ? Puja | null : never
          }
        : {
            role?: 'role' extends keyof Pop
              ? _ApplyFields<
                  Pop['role'] extends { populate: infer NestedPop }
                    ? RoleGetPayload<{ populate: NestedPop }>
                    : Role,
                  Role,
                  Pop['role']
                > | null
              : never
            puja?: 'puja' extends keyof Pop
              ? _ApplyFields<
                  Pop['puja'] extends { populate: infer NestedPop }
                    ? PujaGetPayload<{ populate: NestedPop }>
                    : Puja,
                  Puja,
                  Pop['puja']
                > | null
              : never
          }
    : {})
// ============================================
// Filter Utility Types
// ============================================

/** String filter operators */
export interface StringFilterOperators {
  $eq?: string
  $eqi?: string
  $ne?: string
  $nei?: string
  $in?: string[]
  $notIn?: string[]
  $contains?: string
  $notContains?: string
  $containsi?: string
  $notContainsi?: string
  $startsWith?: string
  $startsWithi?: string
  $endsWith?: string
  $endsWithi?: string
  $null?: boolean
  $notNull?: boolean
}

/** Number filter operators */
export interface NumberFilterOperators {
  $eq?: number
  $ne?: number
  $lt?: number
  $lte?: number
  $gt?: number
  $gte?: number
  $in?: number[]
  $notIn?: number[]
  $between?: [number, number]
  $null?: boolean
  $notNull?: boolean
}

/** Boolean filter operators */
export interface BooleanFilterOperators {
  $eq?: boolean
  $ne?: boolean
  $null?: boolean
  $notNull?: boolean
}

/** Date filter operators (dates are strings in Strapi) */
export interface DateFilterOperators {
  $eq?: string
  $ne?: string
  $lt?: string
  $lte?: string
  $gt?: string
  $gte?: string
  $in?: string[]
  $notIn?: string[]
  $between?: [string, string]
  $null?: boolean
  $notNull?: boolean
}

/** ID filter operators (for relations) */
export interface IdFilterOperators {
  $eq?: number | string
  $ne?: number | string
  $in?: (number | string)[]
  $notIn?: (number | string)[]
  $null?: boolean
  $notNull?: boolean
}

/** Relation filter - filter by nested fields */
export type RelationFilter<T> = {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
} & {
  [K in keyof T]?: T[K] extends string
    ? string | StringFilterOperators
    : T[K] extends number
      ? number | NumberFilterOperators
      : T[K] extends boolean
        ? boolean | BooleanFilterOperators
        : any
}

/** Logical operators for combining filters */
export interface LogicalOperators<T> {
  $and?: T[]
  $or?: T[]
  $not?: T
}

/** Filters for the admin user behind createdBy / updatedBy */
export interface AdminUserFilters {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  firstname?: string | StringFilterOperators
  lastname?: string | StringFilterOperators
  username?: string | StringFilterOperators
  preferedLanguage?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  $and?: AdminUserFilters[]
  $or?: AdminUserFilters[]
  $not?: AdminUserFilters
}
// ============================================
// Typed Query Parameters
// ============================================

/** Sort direction */
export type SortDirection = 'asc' | 'desc'

/** Sort option - can be a field name or field:direction */
export type SortOption<T> = (keyof T & string) | `${keyof T & string}:${SortDirection}`

/** Typed query parameters */
export interface TypedQueryParams<TEntity, TFilters = Record<string, any>, TPopulate = any> {
  /** Type-safe filters */
  filters?: TFilters
  /** Sort by field(s) */
  sort?: SortOption<TEntity> | SortOption<TEntity>[]
  /** Pagination options */
  pagination?: {
    page?: number
    pageSize?: number
    limit?: number
    start?: number
  }
  /** Populate relations */
  populate?: TPopulate
  /** Select specific fields */
  fields?: (keyof TEntity)[]
}
/** Type-safe filters for the AwardsCategory component */
export interface AwardsCategoryFilters extends LogicalOperators<AwardsCategoryFilters> {
  id?: number | IdFilterOperators
  category?: string | StringFilterOperators
  positions?: AwardsPositionFilters
}
/** Type-safe filters for the AwardsPosition component */
export interface AwardsPositionFilters extends LogicalOperators<AwardsPositionFilters> {
  id?: number | IdFilterOperators
  position?: string | StringFilterOperators
  pujas?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  artist?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for the SharedAchievement component */
export interface SharedAchievementFilters extends LogicalOperators<SharedAchievementFilters> {
  id?: number | IdFilterOperators
  year?: number | NumberFilterOperators
  title?: string | StringFilterOperators
  details?: string | StringFilterOperators
}
/** Type-safe filters for the SharedAshsParticipant component */
export interface SharedAshsParticipantFilters extends LogicalOperators<SharedAshsParticipantFilters> {
  id?: number | IdFilterOperators
  title?: string | StringFilterOperators
  details?: any
  voteCount?: number | NumberFilterOperators
  voteDetails?: any
  puja?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for the SharedSchedule component */
export interface SharedScheduleFilters extends LogicalOperators<SharedScheduleFilters> {
  id?: number | IdFilterOperators
  date?: string | DateFilterOperators
  event?: string | StringFilterOperators
  description?: string | StringFilterOperators
  timings?: string | StringFilterOperators
}
/** Type-safe filters for the SharedVideo component */
export interface SharedVideoFilters extends LogicalOperators<SharedVideoFilters> {
  id?: number | IdFilterOperators
  title?: string | StringFilterOperators
  video?: any
  description?: string | StringFilterOperators
}
/** Type-safe filters for Artist */
export interface ArtistFilters extends LogicalOperators<ArtistFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  name?: string | StringFilterOperators
  type?: ('idol' | 'decoration' | 'light' | 'theme') | StringFilterOperators
  businessName?: string | StringFilterOperators
  contact?: string | StringFilterOperators
  email?: string | StringFilterOperators
  pujas?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for AshsEntry */
export interface AshsEntryFilters extends LogicalOperators<AshsEntryFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  year?: number | NumberFilterOperators
  entries?: SharedAshsParticipantFilters
}
/** Type-safe filters for Award */
export interface AwardFilters extends LogicalOperators<AwardFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  year?: number | NumberFilterOperators
  description?: string | StringFilterOperators
  categories?: AwardsCategoryFilters
}
/** Type-safe filters for Contact */
export interface ContactFilters extends LogicalOperators<ContactFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  name?: string | StringFilterOperators
  location?: any
  contact?: string | StringFilterOperators
}
/** Type-safe filters for Global */
export interface GlobalFilters extends LogicalOperators<GlobalFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  processionListPublished?: boolean | BooleanFilterOperators
  schedules?: SharedScheduleFilters
  videos?: SharedVideoFilters
  achievements?: SharedAchievementFilters
}
/** Type-safe filters for Image */
export interface ImageFilters extends LogicalOperators<ImageFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  category?:
    | (
        | 'puja'
        | 'preparation'
        | 'banner'
        | 'events'
        | 'idolmaking'
        | 'eyecreation'
        | 'procession'
        | 'immersion'
        | 'lighting'
        | 'pandal'
        | 'kathamo-puja'
      )
    | StringFilterOperators
  name?: string | StringFilterOperators
  year?: number | NumberFilterOperators
  puja?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  user?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for Partnership */
export interface PartnershipFilters extends LogicalOperators<PartnershipFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  year?: number | NumberFilterOperators
  amount?: number | NumberFilterOperators
  email?: string | StringFilterOperators
  name?: string | StringFilterOperators
  orderId?: string | StringFilterOperators
  paymentId?: string | StringFilterOperators
  phone?: string | StringFilterOperators
  planName?: string | StringFilterOperators
  planValue?: number | NumberFilterOperators
  addons?: any
  note?: string | StringFilterOperators
  fullPaid?: boolean | BooleanFilterOperators
  puja?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for Procession */
export interface ProcessionFilters extends LogicalOperators<ProcessionFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  zone?: ('A' | 'B' | 'C' | 'D') | StringFilterOperators
  truckCount?: number | NumberFilterOperators
  sortOrder?: number | NumberFilterOperators
  puja?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for Puja */
export interface PujaFilters extends LogicalOperators<PujaFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  name?: string | StringFilterOperators
  zone?: ('chandannagar' | 'bhadreswar') | StringFilterOperators
  estd?: number | NumberFilterOperators
  tags?: any
  info?: string | StringFilterOperators
  location?: any
  theme?: string | StringFilterOperators
  slug?: string | StringFilterOperators
  sortOrder?: number | NumberFilterOperators
  referenceId?: string | StringFilterOperators
  artists?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  images?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  media?: { id?: number | IdFilterOperators; [key: string]: any }
}
/** Type-safe filters for VirtualTour */
export interface VirtualTourFilters extends LogicalOperators<VirtualTourFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  year?: number | NumberFilterOperators
  name?: string | StringFilterOperators
  puja?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for Permission */
export interface PermissionFilters extends LogicalOperators<PermissionFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  action?: string | StringFilterOperators
  role?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for Role */
export interface RoleFilters extends LogicalOperators<RoleFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  name?: string | StringFilterOperators
  description?: string | StringFilterOperators
  type?: string | StringFilterOperators
  permissions?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  users?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for User */
export interface UserFilters extends LogicalOperators<UserFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  username?: string | StringFilterOperators
  email?: string | StringFilterOperators
  provider?: string | StringFilterOperators
  confirmed?: boolean | BooleanFilterOperators
  blocked?: boolean | BooleanFilterOperators
  pujaAccess?: ('admin' | 'editor' | 'visitor') | StringFilterOperators
  role?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  puja?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
