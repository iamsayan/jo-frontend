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
 * Where a connected relation lands in an ordered relation list.
 */
export interface RelationPosition {
  before?: StrapiID | undefined
  after?: StrapiID | undefined
  start?: true | undefined
  end?: true | undefined
}

/**
 * Object form of a relation target. Strapi v5 accepts it wherever a plain id is accepted;
 * `locale` / `status` pick the localized or draft version of the target document.
 */
export interface RelationRef {
  documentId?: string | undefined
  id?: number | undefined
  locale?: string | null | undefined
  status?: 'draft' | 'published' | undefined
  position?: RelationPosition | undefined
}

/**
 * Explicit relation operations supported by Strapi v5.
 * See: https://docs.strapi.io/cms/api/rest/relations
 */
export interface RelationOperations {
  connect?: (StrapiID | RelationRef)[] | undefined
  disconnect?: (StrapiID | RelationRef)[] | undefined
  set?: (StrapiID | RelationRef)[] | undefined
}

/**
 * Input value for a relation field in create/update payloads.
 * Accepts an id or reference, an array of them, or the explicit { connect | disconnect | set } form.
 * Passing a plain id or array is equivalent to 'set' — it overwrites existing relations.
 */
export type RelationInput =
  StrapiID | RelationRef | (StrapiID | RelationRef)[] | RelationOperations | null

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
  year: string
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
  id?: number | undefined
  category: string
  positions?: AwardsPositionCreateInput[] | undefined
}

/** Update input for AwardsCategory */
export interface AwardsCategoryUpdateInput {
  id?: number | undefined
  category?: string | undefined
  positions?: AwardsPositionUpdateInput[] | undefined
}

/** Create input for AwardsPosition */
export interface AwardsPositionCreateInput {
  id?: number | undefined
  position: string
  pujas?: RelationInput | undefined
  artist?: RelationInput | undefined
}

/** Update input for AwardsPosition */
export interface AwardsPositionUpdateInput {
  id?: number | undefined
  position?: string | undefined
  pujas?: RelationInput | undefined
  artist?: RelationInput | undefined
}

/** Create input for SharedAchievement */
export interface SharedAchievementCreateInput {
  id?: number | undefined
  year: string | number
  title: string
  details: string
}

/** Update input for SharedAchievement */
export interface SharedAchievementUpdateInput {
  id?: number | undefined
  year?: string | number | undefined
  title?: string | undefined
  details?: string | undefined
}

/** Create input for SharedAshsParticipant */
export interface SharedAshsParticipantCreateInput {
  id?: number | undefined
  title: string
  details: unknown
  /** @default 0 */
  voteCount?: number | undefined
  voteDetails: unknown
  puja?: RelationInput | undefined
}

/** Update input for SharedAshsParticipant */
export interface SharedAshsParticipantUpdateInput {
  id?: number | undefined
  title?: string | undefined
  details?: unknown | undefined
  /** @default 0 */
  voteCount?: number | undefined
  voteDetails?: unknown | undefined
  puja?: RelationInput | undefined
}

/** Create input for SharedSchedule */
export interface SharedScheduleCreateInput {
  id?: number | undefined
  date: string
  event: string
  description: string
  timings?: string | null | undefined
}

/** Update input for SharedSchedule */
export interface SharedScheduleUpdateInput {
  id?: number | undefined
  date?: string | undefined
  event?: string | undefined
  description?: string | undefined
  timings?: string | null | undefined
}

/** Create input for SharedVideo */
export interface SharedVideoCreateInput {
  id?: number | undefined
  title: string
  video?: unknown | null | undefined
  description: string
}

/** Update input for SharedVideo */
export interface SharedVideoUpdateInput {
  id?: number | undefined
  title?: string | undefined
  video?: unknown | null | undefined
  description?: string | undefined
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
  year: string
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
  year: string
}

export interface Partnership {
  readonly __typename?: 'Partnership'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  year: string
  amount: string
  email: string
  name: string
  orderId: string | null
  paymentId: string | null
  /** @minLength 10 */
  phone: string
  planName: string
  planValue: string
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
  estd: string
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
  year: string
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
  access: 'admin' | 'editor' | 'visitor'
}

/** Create input for Artist */
export interface ArtistCreateInput {
  name: string
  type: 'idol' | 'decoration' | 'light' | 'theme'
  businessName?: string | null | undefined
  /** @maxLength 10 */
  contact?: string | null | undefined
  email?: string | null | undefined
  locale?: string | null | undefined
  pujas?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Artist */
export interface ArtistUpdateInput {
  name?: string | undefined
  type?: 'idol' | 'decoration' | 'light' | 'theme' | undefined
  businessName?: string | null | undefined
  /** @maxLength 10 */
  contact?: string | null | undefined
  email?: string | null | undefined
  locale?: string | null | undefined
  pujas?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Create input for AshsEntry */
export interface AshsEntryCreateInput {
  year: number
  locale?: string | null | undefined
  entries?: SharedAshsParticipantCreateInput[] | undefined
  publishedAt?: string | null | undefined
}

/** Update input for AshsEntry */
export interface AshsEntryUpdateInput {
  year?: number | undefined
  locale?: string | null | undefined
  entries?: SharedAshsParticipantUpdateInput[] | undefined
  publishedAt?: string | null | undefined
}

/** Create input for Award */
export interface AwardCreateInput {
  year: string | number
  description: string
  locale?: string | null | undefined
  categories?: AwardsCategoryCreateInput[] | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Award */
export interface AwardUpdateInput {
  year?: string | number | undefined
  description?: string | undefined
  locale?: string | null | undefined
  categories?: AwardsCategoryUpdateInput[] | undefined
  publishedAt?: string | null | undefined
}

/** Create input for Contact */
export interface ContactCreateInput {
  name: string
  location: unknown
  contact: string
  locale?: string | null | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Contact */
export interface ContactUpdateInput {
  name?: string | undefined
  location?: unknown | undefined
  contact?: string | undefined
  locale?: string | null | undefined
  publishedAt?: string | null | undefined
}

/** Create input for Global */
export interface GlobalCreateInput {
  processionListPublished?: boolean | null | undefined
  locale?: string | null | undefined
  schedules?: SharedScheduleCreateInput[] | undefined
  videos?: SharedVideoCreateInput[] | undefined
  achievements?: SharedAchievementCreateInput[] | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Global */
export interface GlobalUpdateInput {
  processionListPublished?: boolean | null | undefined
  locale?: string | null | undefined
  schedules?: SharedScheduleUpdateInput[] | undefined
  videos?: SharedVideoUpdateInput[] | undefined
  achievements?: SharedAchievementUpdateInput[] | undefined
  publishedAt?: string | null | undefined
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
  year: string | number
  locale?: string | null | undefined
  puja?: RelationInput | undefined
  user?: RelationInput | undefined
  publishedAt?: string | null | undefined
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
    | undefined
  name?: string | undefined
  year?: string | number | undefined
  locale?: string | null | undefined
  puja?: RelationInput | undefined
  user?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Create input for Partnership */
export interface PartnershipCreateInput {
  year: string | number
  amount: string | number
  email: string
  name: string
  orderId?: string | null | undefined
  paymentId?: string | null | undefined
  /** @minLength 10 */
  phone: string
  planName: string
  planValue: string | number
  addons?: unknown | null | undefined
  note?: string | null | undefined
  /** @default true */
  fullPaid?: boolean | null | undefined
  locale?: string | null | undefined
  puja?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Partnership */
export interface PartnershipUpdateInput {
  year?: string | number | undefined
  amount?: string | number | undefined
  email?: string | undefined
  name?: string | undefined
  orderId?: string | null | undefined
  paymentId?: string | null | undefined
  /** @minLength 10 */
  phone?: string | undefined
  planName?: string | undefined
  planValue?: string | number | undefined
  addons?: unknown | null | undefined
  note?: string | null | undefined
  /** @default true */
  fullPaid?: boolean | null | undefined
  locale?: string | null | undefined
  puja?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Create input for Procession */
export interface ProcessionCreateInput {
  zone: 'A' | 'B' | 'C' | 'D'
  truckCount: number
  /** @default 0 */
  sortOrder?: number | undefined
  locale?: string | null | undefined
  puja?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Procession */
export interface ProcessionUpdateInput {
  zone?: 'A' | 'B' | 'C' | 'D' | undefined
  truckCount?: number | undefined
  /** @default 0 */
  sortOrder?: number | undefined
  locale?: string | null | undefined
  puja?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Create input for Puja */
export interface PujaCreateInput {
  name: string
  zone: 'chandannagar' | 'bhadreswar'
  estd: string | number
  /** @default "[]" */
  tags?: unknown | null | undefined
  info?: string | null | undefined
  location?: unknown | null | undefined
  theme?: string | null | undefined
  slug: string
  /** @default 0 */
  sortOrder?: number | undefined
  referenceId: string
  locale?: string | null | undefined
  media?: MultiMediaInput | undefined
  artists?: RelationInput | undefined
  images?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Puja */
export interface PujaUpdateInput {
  name?: string | undefined
  zone?: 'chandannagar' | 'bhadreswar' | undefined
  estd?: string | number | undefined
  /** @default "[]" */
  tags?: unknown | null | undefined
  info?: string | null | undefined
  location?: unknown | null | undefined
  theme?: string | null | undefined
  slug?: string | undefined
  /** @default 0 */
  sortOrder?: number | undefined
  referenceId?: string | undefined
  locale?: string | null | undefined
  media?: MultiMediaInput | undefined
  artists?: RelationInput | undefined
  images?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Create input for VirtualTour */
export interface VirtualTourCreateInput {
  year: string | number
  name?: string | null | undefined
  locale?: string | null | undefined
  puja?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Update input for VirtualTour */
export interface VirtualTourUpdateInput {
  year?: string | number | undefined
  name?: string | null | undefined
  locale?: string | null | undefined
  puja?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Create input for Permission */
export interface PermissionCreateInput {
  action: string
  locale?: string | null | undefined
  role?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Permission */
export interface PermissionUpdateInput {
  action?: string | undefined
  locale?: string | null | undefined
  role?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Create input for Role */
export interface RoleCreateInput {
  /** @minLength 3 */
  name: string
  description?: string | null | undefined
  type?: string | null | undefined
  locale?: string | null | undefined
  permissions?: RelationInput | undefined
  users?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Update input for Role */
export interface RoleUpdateInput {
  /** @minLength 3 */
  name?: string | undefined
  description?: string | null | undefined
  type?: string | null | undefined
  locale?: string | null | undefined
  permissions?: RelationInput | undefined
  users?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Create input for User */
export interface UserCreateInput {
  /** @minLength 3 */
  username: string
  /** @minLength 6 */
  email: string
  provider?: string | null | undefined
  /** @default false */
  confirmed?: boolean | null | undefined
  /** @default false */
  blocked?: boolean | null | undefined
  /** @default "visitor" */
  access?: 'admin' | 'editor' | 'visitor' | undefined
  /** @minLength 6 */
  password?: string | null | undefined
  resetPasswordToken?: string | null | undefined
  confirmationToken?: string | null | undefined
  locale?: string | null | undefined
  role?: RelationInput | undefined
  puja?: RelationInput | undefined
  publishedAt?: string | null | undefined
}

/** Update input for User */
export interface UserUpdateInput {
  /** @minLength 3 */
  username?: string | undefined
  /** @minLength 6 */
  email?: string | undefined
  provider?: string | null | undefined
  /** @default false */
  confirmed?: boolean | null | undefined
  /** @default false */
  blocked?: boolean | null | undefined
  /** @default "visitor" */
  access?: 'admin' | 'editor' | 'visitor' | undefined
  /** @minLength 6 */
  password?: string | null | undefined
  resetPasswordToken?: string | null | undefined
  confirmationToken?: string | null | undefined
  locale?: string | null | undefined
  role?: RelationInput | undefined
  puja?: RelationInput | undefined
  publishedAt?: string | null | undefined
}
export const PartnershipDefaults = {
  fullPaid: true,
} as const satisfies Partial<PartnershipCreateInput>
export const ProcessionDefaults = { sortOrder: 0 } as const satisfies Partial<ProcessionCreateInput>
export const PujaDefaults = { tags: '[]', sortOrder: 0 } as const satisfies Partial<PujaCreateInput>
export const UserDefaults = {
  confirmed: false,
  blocked: false,
  access: 'visitor',
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
        count?: never
      }
}
export type AwardsPositionPopulateParam = {
  pujas?:
    | true
    | {
        count: true
        filters?: PujaFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: ArtistFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: PujaFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: PujaFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count?: never
      }
}
export type AwardPopulateParam = {
  categories?:
    | true
    | {
        fields?: (keyof AwardsCategory & string)[]
        populate?:
          AwardsCategoryPopulateParam | (keyof AwardsCategoryPopulateParam & string)[] | '*'
        count?: never
      }
}
export type GlobalPopulateParam = {
  schedules?: true | { fields?: (keyof SharedSchedule & string)[]; count?: never }
  videos?: true | { fields?: (keyof SharedVideo & string)[]; count?: never }
  achievements?: true | { fields?: (keyof SharedAchievement & string)[]; count?: never }
}
export type ImagePopulateParam = {
  puja?:
    | true
    | {
        count: true
        filters?: PujaFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: UserFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: PujaFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: PujaFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: ArtistFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: ImageFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Image>[]
        populate?: ImagePopulateParam | (keyof ImagePopulateParam & string)[] | '*'
        filters?: ImageFilters
        sort?: _SortValue<Image> | _SortValue<Image>[]
        limit?: number
        start?: number
      }
  media?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
}
export type VirtualTourPopulateParam = {
  puja?:
    | true
    | {
        count: true
        filters?: PujaFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: RoleFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: PermissionFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: UserFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: RoleFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
        count: true
        filters?: PujaFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
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
              ? Pop['pujas'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['pujas'] extends { populate: infer NestedPop }
                      ? PujaGetPayload<{ populate: NestedPop }>
                      : Puja,
                    Puja,
                    Pop['pujas']
                  >[]
              : never
            artist?: 'artist' extends keyof Pop
              ? Pop['artist'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
                ? Pop['puja'] extends { count: true }
                  ? { count: number }
                  : _ApplyFields<
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
              ? Pop['pujas'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
              ? Pop['puja'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['puja'] extends { populate: infer NestedPop }
                      ? PujaGetPayload<{ populate: NestedPop }>
                      : Puja,
                    Puja,
                    Pop['puja']
                  > | null
              : never
            user?: 'user' extends keyof Pop
              ? Pop['user'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
              ? Pop['puja'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
              ? Pop['puja'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
              ? Pop['artists'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['artists'] extends { populate: infer NestedPop }
                      ? ArtistGetPayload<{ populate: NestedPop }>
                      : Artist,
                    Artist,
                    Pop['artists']
                  >[]
              : never
            images?: 'images' extends keyof Pop
              ? Pop['images'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
              ? Pop['puja'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
              ? Pop['role'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
              ? Pop['permissions'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['permissions'] extends { populate: infer NestedPop }
                      ? PermissionGetPayload<{ populate: NestedPop }>
                      : Permission,
                    Permission,
                    Pop['permissions']
                  >[]
              : never
            users?: 'users' extends keyof Pop
              ? Pop['users'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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
              ? Pop['role'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['role'] extends { populate: infer NestedPop }
                      ? RoleGetPayload<{ populate: NestedPop }>
                      : Role,
                    Role,
                    Pop['role']
                  > | null
              : never
            puja?: 'puja' extends keyof Pop
              ? Pop['puja'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
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

/** biginteger filter operators — Strapi reads bigintegers as strings, accepts either */
export interface BigIntFilterOperators {
  $eq?: string | number
  $ne?: string | number
  $lt?: string | number
  $lte?: string | number
  $gt?: string | number
  $gte?: string | number
  $in?: (string | number)[]
  $notIn?: (string | number)[]
  $between?: [string | number, string | number]
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
  // A related biginteger reads as string, but its filters take numbers too
  [K in keyof T]?: T[K] extends string
    ? string | number | StringFilterOperators | BigIntFilterOperators
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
  year?: string | number | BigIntFilterOperators
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
  year?: string | number | BigIntFilterOperators
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
  year?: string | number | BigIntFilterOperators
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
  year?: string | number | BigIntFilterOperators
  amount?: string | number | BigIntFilterOperators
  email?: string | StringFilterOperators
  name?: string | StringFilterOperators
  orderId?: string | StringFilterOperators
  paymentId?: string | StringFilterOperators
  phone?: string | StringFilterOperators
  planName?: string | StringFilterOperators
  planValue?: string | number | BigIntFilterOperators
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
  estd?: string | number | BigIntFilterOperators
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
  year?: string | number | BigIntFilterOperators
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
  access?: ('admin' | 'editor' | 'visitor') | StringFilterOperators
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
