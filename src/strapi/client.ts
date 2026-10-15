/* eslint-disable */
// Auto-generated Strapi API client
// Do not edit manually
export const SCHEMA_HASH = '247e17d0f5229f01be93d91348469e6a24809e8344dd9da189e2e99f99ab79cf'
export const GENERATOR_VERSION = '2.2.1'
export const AUTH_MODE: 'legacy' | 'refresh' = 'refresh'
import type {
  Artist,
  ArtistGetPayload,
  ArtistPopulateParam,
  ArtistCreateInput,
  ArtistUpdateInput,
  AshsEntry,
  AshsEntryGetPayload,
  AshsEntryPopulateParam,
  AshsEntryCreateInput,
  AshsEntryUpdateInput,
  Award,
  AwardGetPayload,
  AwardPopulateParam,
  AwardCreateInput,
  AwardUpdateInput,
  Contact,
  ContactCreateInput,
  ContactUpdateInput,
  Global,
  GlobalGetPayload,
  GlobalPopulateParam,
  GlobalCreateInput,
  GlobalUpdateInput,
  Image,
  ImageGetPayload,
  ImagePopulateParam,
  ImageCreateInput,
  ImageUpdateInput,
  Partnership,
  PartnershipGetPayload,
  PartnershipPopulateParam,
  PartnershipCreateInput,
  PartnershipUpdateInput,
  Procession,
  ProcessionGetPayload,
  ProcessionPopulateParam,
  ProcessionCreateInput,
  ProcessionUpdateInput,
  Puja,
  PujaGetPayload,
  PujaPopulateParam,
  PujaCreateInput,
  PujaUpdateInput,
  VirtualTour,
  VirtualTourGetPayload,
  VirtualTourPopulateParam,
  VirtualTourCreateInput,
  VirtualTourUpdateInput,
  Permission,
  PermissionGetPayload,
  PermissionPopulateParam,
  PermissionCreateInput,
  PermissionUpdateInput,
  Role,
  RoleGetPayload,
  RolePopulateParam,
  RoleCreateInput,
  RoleUpdateInput,
  User,
  UserGetPayload,
  UserPopulateParam,
  UserCreateInput,
  UserUpdateInput,
  MediaFile,
  I18nLocale,
} from './types'
import type {
  ArtistFilters,
  AshsEntryFilters,
  AwardFilters,
  ContactFilters,
  GlobalFilters,
  ImageFilters,
  PartnershipFilters,
  ProcessionFilters,
  PujaFilters,
  VirtualTourFilters,
  PermissionFilters,
  RoleFilters,
  UserFilters,
  StringFilterOperators,
  NumberFilterOperators,
  BooleanFilterOperators,
  DateFilterOperators,
  IdFilterOperators,
  LogicalOperators,
} from './types'

export interface StrapiResponse<T> {
  data: T
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } }
}

/**
 * A single validation issue inside a `ValidationError`.
 * Mirrors the Yup-style errors Strapi propagates from schema validation.
 */
export interface StrapiValidationIssue {
  /** Field path to the offending value (e.g. ["author", "email"]). */
  path: string[]
  message: string
  /** The Yup validator name (e.g. "required"). */
  name: string
}

/**
 * Known Strapi v5 error names. Other strings are still accepted at
 * runtime via the `(string & {})` fallback so plugin or future-version
 * errors are not lost.
 */
export type StrapiErrorName =
  | 'ValidationError'
  | 'BadRequestError'
  | 'PaginationError'
  | 'UnauthorizedError'
  | 'ForbiddenError'
  | 'PolicyError'
  | 'NotFoundError'
  | 'ConflictError'
  | 'PayloadTooLargeError'
  | 'RateLimitError'
  | 'ApplicationError'
  | (string & {})
/**
 * Maps each known `StrapiErrorName` to the shape of its `details`
 * payload. Used by `isStrapiErrorOf` to narrow `details` after the
 * discriminator check. Wrapped in `Partial` because Strapi may
 * omit `details` even when the error name is known.
 */
export type StrapiErrorDetailsMap = Partial<{
  ValidationError: { errors: StrapiValidationIssue[] }
  BadRequestError: Record<string, unknown>
  PaginationError: Record<string, unknown>
  UnauthorizedError: undefined
  ForbiddenError: undefined
  PolicyError: { policy?: string; message?: string }
  NotFoundError: undefined
  ConflictError: Record<string, unknown>
  PayloadTooLargeError: undefined
  RateLimitError: Record<string, unknown>
  ApplicationError: Record<string, unknown>
}>

/**
 * Fallback shape when `errorName` is not in `StrapiErrorDetailsMap`
 * (e.g. 3rd-party plugin errors or Strapi versions newer than this client).
 */
export interface UnknownStrapiErrorDetails {
  errorName: string
  details?: Record<string, unknown>
}

/**
 * Error thrown for non-2xx responses from Strapi.
 *
 * Use `isStrapiErrorOf(err, "ValidationError")` (or any other
 * name) to narrow `details` to its typed shape.
 *
 * @example
 * ```ts
 * try { await strapi.articles.create({ title: '' }) }
 * catch (e) {
 *   if (isStrapiErrorOf(e, 'ValidationError')) {
 *     for (const issue of e.details?.errors ?? []) {
 *       console.log(issue.path.join('.'), issue.message)
 *     }
 *   }
 * }
 * ```
 */
export class StrapiError extends Error {
  /** Clean user-friendly message from Strapi backend */
  userMessage: string
  /** HTTP status code */
  status: number
  /** HTTP status text */
  statusText: string
  /**
   * Strapi-side error name (e.g. "ValidationError", "PolicyError").
   * Use as discriminator with `isStrapiErrorOf`. `Error.name` itself
   * remains "StrapiError" so Sentry/sourcemap contracts are unchanged.
   */
  errorName: StrapiErrorName
  /**
   * Additional error details from Strapi. Typed as `unknown` —
   * narrow via `isStrapiErrorOf` for typed access.
   */
  details?: unknown

  constructor(
    message: string,
    userMessage: string,
    status: number,
    statusText: string,
    details?: unknown,
    errorName: StrapiErrorName = 'UnknownError'
  ) {
    super(message)
    this.name = 'StrapiError'
    this.userMessage = userMessage
    this.status = status
    this.statusText = statusText
    this.errorName = errorName
    this.details = details
  }
}

/** Error thrown when the client cannot connect to Strapi (network failures, DNS, timeouts) */
export class StrapiConnectionError extends Error {
  /** The URL that was being requested */
  url: string
  /** The original error that caused the connection failure */
  cause?: Error

  constructor(message: string, url: string, cause?: Error) {
    super(message)
    this.name = 'StrapiConnectionError'
    this.url = url
    this.cause = cause
  }
}

/**
 * Type guard: is the value a StrapiError instance?
 */
export function isStrapiError(err: unknown): err is StrapiError {
  return err instanceof StrapiError
}

/**
 * Type guard that narrows both `errorName` and `details` for a specific
 * Strapi error type.
 *
 * @example
 * if (isStrapiErrorOf(err, 'ValidationError')) {
 *   err.details?.errors?.[0]?.path // string[] | undefined
 * }
 */
export function isStrapiErrorOf<N extends keyof StrapiErrorDetailsMap>(
  err: unknown,
  name: N
): err is StrapiError & { errorName: N; details: StrapiErrorDetailsMap[N] } {
  return isStrapiError(err) && err.errorName === name
}
// Session state for the users-permissions refresh flow. Keyed by the
// config object — every API class of one StrapiClient shares the same config
// reference, so the session (and its single-flight refresh) is client-wide
// without widening the public config shape. The leading underscore keeps the
// name from colliding with a user content type imported from './types'.
interface _AuthSessionState {
  accessToken?: string
  refreshToken?: string
  refreshPromise?: Promise<boolean>
  // Set when the server definitively rejected a refresh (or after an
  // explicit clearToken/logout): the automatic refresh stays quiet until the
  // next login or explicit auth.refresh(), instead of re-hitting the backend
  // on every 401. Transient failures (5xx, network) never set this.
  dead?: boolean
  // Bumped by login (_captureSession) and clearToken/logout. An in-flight
  // refresh snapshots it and discards its own outcome when it changed:
  // whoever bumped the epoch is authoritative — a late refresh success must
  // not resurrect a logged-out session, and a late 4xx must not wipe a
  // fresh login.
  epoch: number
}

const authSessionStore = new WeakMap<StrapiClientConfig, _AuthSessionState>()

function getAuthSession(config: StrapiClientConfig): _AuthSessionState {
  let session = authSessionStore.get(config)
  if (!session) {
    session = { epoch: 0 }
    authSessionStore.set(config, session)
  }
  return session
}

// All header keys spelling 'authorization', in any casing. Header objects are
// case-sensitive plain records here, but HTTP semantics (and fetch's wire
// merging) are case-insensitive — auth ownership decisions must be too.
function authHeaderValues(headers: Record<string, string>): string[] {
  return Object.keys(headers)
    .filter((k) => k.toLowerCase() === 'authorization')
    .map((k) => headers[k])
    .filter((value): value is string => value !== undefined)
}

// Base API class with shared logic
class BaseAPI {
  constructor(protected config: StrapiClientConfig) {}

  protected _authMode(): 'legacy' | 'refresh' {
    return this.config.authMode ?? AUTH_MODE
  }

  /**
   * The automatic session flow (token capture, Bearer injection, refresh on
   * 401) is active only in refresh mode AND in a browser. In Node the whole
   * mechanism is inert: there is no cookie jar for a cookie-based refresh,
   * and silently storing tokens on a client instance that may be shared
   * across requests (e.g. a Next.js module singleton) would leak one user's
   * session into another user's requests. Server-side code should use API
   * tokens (`token`) or explicit `setToken`.
   */
  protected _sessionEnabled(): boolean {
    return (
      this._authMode() === 'refresh' &&
      typeof (globalThis as { window?: unknown }).window !== 'undefined'
    )
  }

  /**
   * Store the session tokens from an auth response ({ jwt, refreshToken? }).
   * No-op in legacy mode and outside the browser (see _sessionEnabled).
   */
  protected _captureSession<T>(res: T): T {
    if (!this._sessionEnabled()) return res
    const auth = res as { jwt?: unknown; refreshToken?: unknown } | null | undefined
    if (auth && typeof auth.jwt === 'string') {
      const session = getAuthSession(this.config)
      session.accessToken = auth.jwt
      if (typeof auth.refreshToken === 'string') {
        session.refreshToken = auth.refreshToken
      }
      // A fresh login revives the session — lift the dead-session latch and
      // invalidate any refresh still in flight (its outcome is stale now).
      session.dead = undefined
      session.epoch++
    }
    return res
  }

  /**
   * Rotate the refresh token via POST /api/auth/refresh. Single-flight: all
   * concurrent 401s share one in-flight refresh (token rotation is idempotent
   * on the backend, this just avoids redundant requests).
   */
  protected _refreshSession(): Promise<boolean> {
    const session = getAuthSession(this.config)
    if (!session.refreshPromise) {
      session.refreshPromise = this._performTokenRefresh(session).finally(() => {
        session.refreshPromise = undefined
      })
    }
    return session.refreshPromise
  }

  private async _performTokenRefresh(session: _AuthSessionState): Promise<boolean> {
    const fetchFn = this.config.fetch || globalThis.fetch
    // Snapshot the epoch: if login()/clearToken() mutate the session while
    // this request is on the wire, their state is authoritative and this
    // refresh's outcome is discarded (see _AuthSessionState.epoch).
    const epoch = session.epoch
    // Outside the browser nothing is persisted — an explicit auth.refresh()
    // still reports whether a live session exists, but a shared server-side
    // client must never store one caller's rotated token for the next caller.
    const persist = this._sessionEnabled()
    try {
      // Raw fetch, not this.request() — a 401 here must not recurse into
      // another refresh, and no Authorization is attached (Strapi rejects
      // requests carrying an invalid Bearer even on public routes). The
      // token travels in the httpOnly cookie (credentials) or, for
      // non-httpOnly setups, in the body.
      let url = `${this.config.baseURL}/api/auth/refresh`
      const init: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        ...(session.refreshToken && {
          body: JSON.stringify({ refreshToken: session.refreshToken }),
        }),
        ...(this.config.credentials && { credentials: this.config.credentials }),
      }

      // The refresh request honours onRequest like any other request, so
      // infrastructure headers (tenant ids, proxy keys) reach it too.
      if (this.config.onRequest) {
        const reqConfig: RequestConfig = {
          url,
          method: 'POST',
          headers: init.headers as Record<string, string>,
          body: init.body ?? undefined,
        }
        const result = await this.config.onRequest(reqConfig)
        const eff = result ? { ...reqConfig, ...result } : reqConfig
        url = eff.url
        init.method = eff.method
        init.headers = eff.headers
        init.body = eff.body
        if (eff.signal) init.signal = eff.signal
      }

      const response = await fetchFn(url, init)
      if (session.epoch !== epoch) return !!session.accessToken
      if (!response.ok) {
        // 4xx = the session is gone for good (401 dead, 403 rejected,
        // 404 legacy backend) — drop it and latch. 5xx is transient:
        // keep everything and let the original 401 propagate.
        if (response.status < 500 && persist) {
          session.accessToken = undefined
          session.refreshToken = undefined
          session.dead = true
        }
        return false
      }
      const data = (await response.json().catch(() => null)) as {
        jwt?: string
        refreshToken?: string
      } | null
      if (session.epoch !== epoch) return !!session.accessToken
      if (!data?.jwt) {
        // 2xx without a jwt — broken contract, retrying won't help.
        if (persist) {
          session.accessToken = undefined
          session.dead = true
        }
        return false
      }
      if (persist) {
        session.accessToken = data.jwt
        if (data.refreshToken) {
          session.refreshToken = data.refreshToken
        }
        session.dead = undefined
      }
      return true
    } catch {
      // Network failure — keep the tokens (the session may still be alive)
      // and let the original 401 propagate.
      return false
    }
  }

  private getErrorHint(status: number): string {
    switch (status) {
      case 401:
        return ' Hint: check that your API token is valid and passed to StrapiClient config.'
      case 403:
        return ' Hint: your token may lack permissions for this endpoint. Check Strapi roles & permissions.'
      case 404:
        return ' Hint: this endpoint may not exist. Verify the content type is created in Strapi and the API is enabled.'
      case 500:
        return ' Hint: internal Strapi error. Check Strapi server logs for details.'
      default:
        return ''
    }
  }

  protected async request<R>(
    url: string,
    options: RequestInit = {},
    nextOptions?: NextOptions,
    errorPrefix = 'Strapi API',
    _isRetry = false
  ): Promise<R> {
    const fetchFn = this.config.fetch || globalThis.fetch
    // Kept for the post-refresh retry — `url` may be mutated by onRequest.
    const originalUrl = url

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }

    // Only add Content-Type for JSON, let browser set it for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    // With the session flow active the in-memory token wins over the static
    // one. Skip both when the caller's own options already carry an
    // authorization header (any casing) — that request is not ours to auth.
    const sessionToken = this._sessionEnabled()
      ? getAuthSession(this.config).accessToken
      : undefined
    if (authHeaderValues(headers).length === 0) {
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`
      } else if (this.config.token) {
        headers['Authorization'] = `Bearer ${this.config.token}`
      }
    }

    // Merge custom headers from nextOptions. An authorization key replaces
    // any existing spelling — plain records are case-sensitive but the wire
    // is not, and two surviving spellings would be merged by fetch into one
    // malformed comma-joined header.
    if (nextOptions?.headers) {
      for (const [key, value] of Object.entries(nextOptions.headers)) {
        if (value !== undefined) {
          if (key.toLowerCase() === 'authorization') {
            for (const existing of Object.keys(headers)) {
              if (existing.toLowerCase() === 'authorization') delete headers[existing]
            }
          }
          headers[key] = value
        }
      }
    }

    const fetchOptions: RequestInit & { next?: unknown } = {
      ...options,
      headers,
      ...(this.config.credentials && { credentials: this.config.credentials }),
    }

    // Add Next.js cache options if provided
    if (nextOptions) {
      if (nextOptions.revalidate !== undefined || nextOptions.tags) {
        fetchOptions.next = {
          ...(nextOptions.revalidate !== undefined && { revalidate: nextOptions.revalidate }),
          ...(nextOptions.tags && { tags: nextOptions.tags }),
        }
      }
      if (nextOptions.cache) {
        fetchOptions.cache = nextOptions.cache
      }
    }

    // Timeout support via AbortController
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    if (this.config.timeout) {
      const controller = new AbortController()
      fetchOptions.signal = controller.signal
      timeoutId = setTimeout(() => controller.abort(), this.config.timeout)
    }

    // onRequest interceptor — mutate/replace the outgoing request before fetch
    if (this.config.onRequest) {
      const reqConfig: RequestConfig = {
        url,
        method: fetchOptions.method ?? 'GET',
        headers: fetchOptions.headers as Record<string, string>,
        body: fetchOptions.body ?? undefined,
        signal: fetchOptions.signal as AbortSignal | undefined,
      }
      const result = await this.config.onRequest(reqConfig)
      // Merge over the assembled config so a partial return can't drop method/body.
      const eff = result ? { ...reqConfig, ...result } : reqConfig
      url = eff.url
      fetchOptions.method = eff.method
      fetchOptions.headers = eff.headers
      fetchOptions.body = eff.body
      // Keep the timeout signal unless the hook set its own.
      if (eff.signal) fetchOptions.signal = eff.signal

      // If the hook added its own authorization under a different casing,
      // drop our session entry so fetch doesn't merge both spellings into
      // one malformed comma-joined wire header. The hook's credential wins.
      const hookHeaders = fetchOptions.headers as Record<string, string>
      if (sessionToken && authHeaderValues(hookHeaders).length > 1) {
        for (const key of Object.keys(hookHeaders)) {
          if (
            key.toLowerCase() === 'authorization' &&
            hookHeaders[key] === `Bearer ${sessionToken}`
          ) {
            delete hookHeaders[key]
          }
        }
      }
    }

    if (this.config.debug) {
      console.log(`[${errorPrefix}] ${fetchOptions.method || 'GET'} ${url}`)
    }

    let response: Response
    try {
      response = await fetchFn(url, fetchOptions)
    } catch (error: any) {
      if (timeoutId) clearTimeout(timeoutId)

      const baseURL = this.config.baseURL
      const msg = error?.message || String(error)

      let connErr: StrapiConnectionError
      if (error?.name === 'AbortError') {
        // Timeout (AbortController abort)
        connErr = new StrapiConnectionError(
          `Request timed out after ${this.config.timeout}ms. URL: ${url}`,
          url,
          error
        )
      } else if (msg.includes('ECONNREFUSED')) {
        // Connection refused
        connErr = new StrapiConnectionError(
          `Could not connect to Strapi at ${baseURL}. Is the server running?`,
          url,
          error
        )
      } else if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo')) {
        // DNS resolution failure
        connErr = new StrapiConnectionError(
          `Could not resolve host. Check your baseURL: ${baseURL}`,
          url,
          error
        )
      } else {
        // Generic network error
        connErr = new StrapiConnectionError(
          `Network error: ${msg}. Check your baseURL: ${baseURL}`,
          url,
          error
        )
      }

      if (this.config.onError) await this.config.onError(connErr)
      throw connErr
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }

    if (!response.ok) {
      // Session flow: refresh once (single-flight across concurrent
      // requests) and retry the original request one time. Only for
      // requests the session flow itself authorized: sent with OUR session
      // Bearer, or anonymously. If someone else set Authorization — a
      // static config.token, an onRequest hook, per-request headers — the
      // flow steps aside and the error propagates untouched. onError is
      // NOT invoked for an error that a successful refresh absorbs.
      //
      // Two trigger statuses, matching Strapi's semantics: 401 means
      // "credentials were provided and are invalid" (expired session
      // Bearer); 403 on a FULLY anonymous request is the page-load
      // bootstrap case — an anonymous caller authenticates as the public
      // role and a protected route answers ForbiddenError, never 401. A
      // 403 under any Bearer is an honest permission error and passes.
      const sentAuthValues = authHeaderValues(fetchOptions.headers as Record<string, string>)
      const sessionOwnsRequest =
        sentAuthValues.length === 0 ||
        (sentAuthValues.length === 1 &&
          sessionToken !== undefined &&
          sentAuthValues[0] === `Bearer ${sessionToken}`)
      const refreshTrigger =
        response.status === 401
          ? sessionOwnsRequest
          : response.status === 403 && sentAuthValues.length === 0
      if (
        refreshTrigger &&
        !_isRetry &&
        this._sessionEnabled() &&
        // dead-session latch: don't re-hit the backend on every 401/403 once
        // a refresh was definitively rejected; login or auth.refresh() lifts it
        !getAuthSession(this.config).dead
      ) {
        const refreshed = await this._refreshSession()
        if (refreshed) {
          return this.request<R>(originalUrl, options, nextOptions, errorPrefix, true)
        }
      }

      // Detect HTML response (wrong server / reverse proxy error page)
      const contentType = response.headers.get('content-type') || ''
      let httpErr: StrapiError
      if (contentType.includes('text/html')) {
        httpErr = new StrapiError(
          `Strapi returned HTML instead of JSON. Your baseURL may point to the wrong server. URL: ${url}`,
          'Unexpected HTML response from server',
          response.status,
          response.statusText,
          undefined,
          'UnknownError'
        )
      } else {
        const errorData = await response.json().catch(() => ({}))
        const userMessage = errorData.error?.message || response.statusText
        const hint = this.getErrorHint(response.status)
        const technicalMessage = `${errorPrefix} error: ${response.status} ${response.statusText}${errorData.error?.message ? ' - ' + errorData.error.message : ''}${hint}`
        httpErr = new StrapiError(
          technicalMessage,
          userMessage,
          response.status,
          response.statusText,
          errorData.error?.details,
          errorData.error?.name ?? 'UnknownError'
        )
      }

      if (this.config.onError) await this.config.onError(httpErr)
      throw httpErr
    }

    // onResponse interceptor — observe a successful response before parsing.
    // The body is single-use; a hook that reads it must use response.clone().
    if (this.config.onResponse) {
      await this.config.onResponse(response)
    }

    // Handle 204 No Content (e.g., from DELETE operations)
    if (response.status === 204) {
      return null as R
    }

    return response.json()
  }

  protected buildQueryString(params?: QueryParams): string {
    if (!params) return ''
    const query = stringifyQuery(params as Record<string, unknown>)
    return query ? `?${query}` : ''
  }
}

function stringifyQuery(obj: Record<string, unknown>): string {
  const pairs: string[] = []
  for (const key of Object.keys(obj)) {
    appendEntry(obj[key], key, pairs)
  }
  return pairs.join('&')
}

function appendEntry(value: unknown, prefix: string, pairs: string[]): void {
  if (value === null || value === undefined) return
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      appendEntry(value[i], `${prefix}[${i}]`, pairs)
    }
    return
  }
  if (value instanceof Date) {
    pairs.push(`${prefix}=${encodeURIComponent(value.toISOString())}`)
    return
  }
  if (typeof value === 'object') {
    for (const key of Object.keys(value as Record<string, unknown>)) {
      appendEntry((value as Record<string, unknown>)[key], `${prefix}[${key}]`, pairs)
    }
    return
  }
  pairs.push(`${prefix}=${encodeURIComponent(String(value))}`)
}

type StrapiSortOption<T> =
  | Exclude<keyof T & string, '__typename'>
  | `${Exclude<keyof T & string, '__typename'>}:${'asc' | 'desc'}`

export interface QueryParams<
  TEntity = any,
  TFilters = Record<string, any>,
  TPopulate = any,
  TFields extends string = Exclude<keyof TEntity & string, '__typename'>,
> {
  filters?: TFilters
  sort?: StrapiSortOption<TEntity> | StrapiSortOption<TEntity>[]
  pagination?: { page?: number; pageSize?: number; limit?: number; start?: number }
  populate?: TPopulate
  fields?: TFields[]
  locale?: string
  status?: 'draft' | 'published'
}

/**
 * Query params for the upload plugin's content-API.
 *
 * NOTE: Strapi v5 upload plugin uses flat `start`/`limit` for
 * pagination — `pagination[page]`/`pagination[pageSize]` are
 * silently ignored. `filters` and `sort` follow the standard
 * Strapi v5 syntax.
 */
export interface UploadQueryParams {
  filters?: Record<string, any>
  sort?: StrapiSortOption<MediaFile> | StrapiSortOption<MediaFile>[]
  fields?: Exclude<keyof MediaFile & string, '__typename'>[]
  /** Offset (0-based). Upload plugin uses flat `start`, not `pagination[start]`. */
  start?: number
  /** Page size. Upload plugin uses flat `limit`, not `pagination[pageSize]`. */
  limit?: number
}

export interface NextOptions {
  revalidate?: number | false
  tags?: string[]
  cache?: RequestCache
  headers?: Record<string, string | undefined>
}

/** The outgoing request, passed to `onRequest`. Mutate it in place, or return a partial object whose fields override the assembled request; omitted fields keep their assembled value. */
export interface RequestConfig {
  url: string
  method?: string
  headers: Record<string, string>
  body?: BodyInit | null
  signal?: AbortSignal
}

export interface StrapiClientConfig {
  baseURL: string
  /** @deprecated For user sessions prefer the built-in session flow (refresh mode); for other dynamic tokens use `onRequest` to attach the Authorization header. Still read by `request()` for now. */
  token?: string
  fetch?: typeof fetch
  debug?: boolean
  credentials?: RequestCredentials
  /** Override the users-permissions JWT mode baked in at generation time (see the exported AUTH_MODE const). 'refresh' enables the session flow: in-memory access token, `Authorization: Bearer` on every request, and an automatic single-flight refresh + retry on 401 (expired token) or an anonymous 403 (Strapi answers ForbiddenError, not 401, when a protected route is hit with no credentials — the page-reload bootstrap case). Browser-only — in Node the session flow is inert (use API tokens server-side). Set `credentials: 'include'` alongside it when the refresh token lives in an httpOnly cookie. */
  authMode?: 'legacy' | 'refresh'
  /** Request timeout in milliseconds. When set, requests that take longer will be aborted. */
  timeout?: number
  /** Enable schema validation on init (dev mode). Logs warning if types are outdated. */
  validateSchema?: boolean
  /** Called before each request, after headers/timeout are assembled. Mutate `req` in place, or return a partial object to override individual fields (omitted fields keep their assembled value). Use it to attach a token from any async source (replaces `setToken`). If you swap the body to/from FormData you must set the Content-Type header yourself. Setting the Authorization header here takes ownership of auth for that request: the built-in session flow will not refresh/retry it. Also runs for the session flow’s own POST /api/auth/refresh. */
  onRequest?: (
    req: RequestConfig
  ) => Partial<RequestConfig> | void | Promise<Partial<RequestConfig> | void>
  /** Called after a successful (2xx) response, before its body is parsed. The body stream is single-use — call `res.clone()` if you need to read it. Error responses go through `onError`, not `onResponse`. */
  onResponse?: (res: Response) => void | Promise<void>
  /** Called on every connection/HTTP error before it is thrown (e.g. clear a stored token or redirect on 401). The error is always re-thrown afterward. */
  onError?: (err: StrapiError | StrapiConnectionError) => void | Promise<void>
}

/** Utility type for exact type equality check */
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
/**
 * Utility type to automatically infer populated type based on base type
 * Uses exact equality instead of extends to avoid structural typing issues
 */
type GetPopulated<TBase, TPopulate> =
  Equal<TBase, Artist> extends true
    ? ArtistGetPayload<{ populate: TPopulate }>
    : Equal<TBase, AshsEntry> extends true
      ? AshsEntryGetPayload<{ populate: TPopulate }>
      : Equal<TBase, Award> extends true
        ? AwardGetPayload<{ populate: TPopulate }>
        : Equal<TBase, Global> extends true
          ? GlobalGetPayload<{ populate: TPopulate }>
          : Equal<TBase, Image> extends true
            ? ImageGetPayload<{ populate: TPopulate }>
            : Equal<TBase, Partnership> extends true
              ? PartnershipGetPayload<{ populate: TPopulate }>
              : Equal<TBase, Procession> extends true
                ? ProcessionGetPayload<{ populate: TPopulate }>
                : Equal<TBase, Puja> extends true
                  ? PujaGetPayload<{ populate: TPopulate }>
                  : Equal<TBase, VirtualTour> extends true
                    ? VirtualTourGetPayload<{ populate: TPopulate }>
                    : Equal<TBase, Permission> extends true
                      ? PermissionGetPayload<{ populate: TPopulate }>
                      : Equal<TBase, Role> extends true
                        ? RoleGetPayload<{ populate: TPopulate }>
                        : Equal<TBase, User> extends true
                          ? UserGetPayload<{ populate: TPopulate }>
                          : TBase
/** Utility type for narrowing return type based on fields parameter */
type SelectFields<TFull, TBase, TFields extends string> = [TFields] extends [never]
  ? TFull
  : Pick<TBase, Extract<TFields | 'id' | 'documentId', keyof TBase>> & Omit<TFull, keyof TBase>
// Auth API types for users-permissions plugin
export interface LoginCredentials {
  identifier: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  referralCode?: string
  referralSource?: 'code' | 'link' | 'share'
}

export interface AuthResponse {
  jwt: string
  user: User
  refreshToken?: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  code: string
  password: string
  passwordConfirmation: string
}

export interface ChangePasswordData {
  currentPassword: string
  password: string
  passwordConfirmation: string
}

export interface EmailConfirmationResponse {
  jwt: string
  user: User
  refreshToken?: string
}

export interface ForgotPasswordResponse {
  ok: true
}

export interface SendEmailConfirmationResponse {
  email: string
  sent: boolean
}

export interface AuthSessionEntry {
  /** The sessionId — pass to revokeSession(). */
  id: string
  deviceId?: string
  /** e.g. "Chrome on macOS". */
  deviceName?: string
  /** Whether this is the session making the request. */
  current: boolean
  /** ISO date. */
  loginAt?: string
  /** ISO date, updated on token rotation. */
  lastActiveAt?: string
}

export interface AuthSessionsResponse {
  data: AuthSessionEntry[]
}

export interface RevokeSessionResponse {
  data: Record<string, never>
}
// Collection API wrapper with type-safe populate support
class CollectionAPI<
  TBase,
  TCreateInput = Partial<TBase>,
  TUpdateInput = Partial<TBase>,
  TFilters = Record<string, any>,
  TPopulateKeys extends Record<string, any> = Record<string, any>,
> extends BaseAPI {
  constructor(
    protected endpoint: string,
    config: StrapiClientConfig
  ) {
    super(config)
  }

  // Envelope hooks — standard content types use Strapi's { data } wrapper.
  // Subclasses (e.g. the users-permissions endpoint) override these to send
  // and receive a flat payload instead.
  protected wrapBody(data: any): any {
    return { data }
  }

  protected unwrap(response: any): any {
    return response?.data
  }

  // Overload: with populate object → populated return type
  find<
    const TPopulate extends TPopulateKeys,
    const TFields extends Exclude<keyof TBase & string, '__typename'> = never,
  >(
    params: { populate: TPopulate } & QueryParams<TBase, TFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>[]>
  // Overload: with populate '*' or true → all fields populated
  find<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(
    params: { populate: '*' | true } & QueryParams<TBase, TFilters, '*' | true, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, '*'>, TBase, TFields>[]>
  // Overload: with populate array → populated return type
  find<
    const TPopulate extends readonly (keyof TPopulateKeys & string)[],
    const TFields extends Exclude<keyof TBase & string, '__typename'> = never,
  >(
    params: { populate: TPopulate } & QueryParams<TBase, TFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>[]>
  // Overload: general case → base return type
  find<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(
    params?: QueryParams<
      TBase,
      TFilters,
      TPopulateKeys | (keyof TPopulateKeys & string)[] | '*' | boolean,
      TFields
    >,
    nextOptions?: NextOptions
  ): Promise<SelectFields<TBase, TBase, TFields>[]>

  async find(params?: any, nextOptions?: any): Promise<any> {
    const query = this.buildQueryString(params)
    const url = `${this.config.baseURL}/api/${this.endpoint}${query}`
    const response = await this.request<StrapiResponse<any[]>>(url, {}, nextOptions)
    return this.unwrap(response)
  }

  // Overload: with populate object → populated return type
  findWithMeta<
    const TPopulate extends TPopulateKeys,
    const TFields extends Exclude<keyof TBase & string, '__typename'> = never,
  >(
    params: { populate: TPopulate } & QueryParams<TBase, TFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<StrapiResponse<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>[]>>
  // Overload: with populate '*' or true → all fields populated
  findWithMeta<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(
    params: { populate: '*' | true } & QueryParams<TBase, TFilters, '*' | true, TFields>,
    nextOptions?: NextOptions
  ): Promise<StrapiResponse<SelectFields<GetPopulated<TBase, '*'>, TBase, TFields>[]>>
  // Overload: with populate array → populated return type
  findWithMeta<
    const TPopulate extends readonly (keyof TPopulateKeys & string)[],
    const TFields extends Exclude<keyof TBase & string, '__typename'> = never,
  >(
    params: { populate: TPopulate } & QueryParams<TBase, TFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<StrapiResponse<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>[]>>
  // Overload: general case → base return type
  findWithMeta<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(
    params?: QueryParams<
      TBase,
      TFilters,
      TPopulateKeys | (keyof TPopulateKeys & string)[] | '*' | boolean,
      TFields
    >,
    nextOptions?: NextOptions
  ): Promise<StrapiResponse<SelectFields<TBase, TBase, TFields>[]>>

  async findWithMeta(params?: any, nextOptions?: any): Promise<any> {
    const query = this.buildQueryString(params)
    const url = `${this.config.baseURL}/api/${this.endpoint}${query}`
    return this.request<StrapiResponse<any[]>>(url, {}, nextOptions)
  }

  // Overload: with populate object → populated return type
  findOne<
    const TPopulate extends TPopulateKeys,
    const TFields extends Exclude<keyof TBase & string, '__typename'> = never,
  >(
    documentId: string,
    params: { populate: TPopulate } & QueryParams<TBase, TFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields> | null>
  // Overload: with populate '*' or true → all fields populated
  findOne<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(
    documentId: string,
    params: { populate: '*' | true } & QueryParams<TBase, TFilters, '*' | true, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, '*'>, TBase, TFields> | null>
  // Overload: with populate array → populated return type
  findOne<
    const TPopulate extends readonly (keyof TPopulateKeys & string)[],
    const TFields extends Exclude<keyof TBase & string, '__typename'> = never,
  >(
    documentId: string,
    params: { populate: TPopulate } & QueryParams<TBase, TFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields> | null>
  // Overload: general case → base return type
  findOne<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(
    documentId: string,
    params?: QueryParams<
      TBase,
      TFilters,
      TPopulateKeys | (keyof TPopulateKeys & string)[] | '*' | boolean,
      TFields
    >,
    nextOptions?: NextOptions
  ): Promise<SelectFields<TBase, TBase, TFields> | null>

  async findOne(documentId: string, params?: any, nextOptions?: any): Promise<any> {
    const query = this.buildQueryString(params)
    const url = `${this.config.baseURL}/api/${this.endpoint}/${documentId}${query}`
    const response = await this.request<StrapiResponse<any>>(url, {}, nextOptions)
    return this.unwrap(response)
  }

  async create(data: TCreateInput | FormData, nextOptions?: NextOptions): Promise<TBase> {
    // FormData is sent as-is; everything else goes through the envelope hook
    const body = data instanceof FormData ? data : JSON.stringify(this.wrapBody(data))

    const url = `${this.config.baseURL}/api/${this.endpoint}`
    const response = await this.request<StrapiResponse<TBase>>(
      url,
      {
        method: 'POST',
        body,
      },
      nextOptions
    )
    return this.unwrap(response)
  }

  async update(
    documentId: string,
    data: TUpdateInput | FormData,
    nextOptions?: NextOptions
  ): Promise<TBase> {
    // FormData is sent as-is; everything else goes through the envelope hook
    const body = data instanceof FormData ? data : JSON.stringify(this.wrapBody(data))

    const url = `${this.config.baseURL}/api/${this.endpoint}/${documentId}`
    const response = await this.request<StrapiResponse<TBase>>(
      url,
      {
        method: 'PUT',
        body,
      },
      nextOptions
    )
    return this.unwrap(response)
  }

  async delete(documentId: string, nextOptions?: NextOptions): Promise<TBase | null> {
    const url = `${this.config.baseURL}/api/${this.endpoint}/${documentId}`
    const response = await this.request<StrapiResponse<TBase> | null>(
      url,
      {
        method: 'DELETE',
      },
      nextOptions
    )
    return this.unwrap(response) ?? null
  }
}
// Single Type API wrapper with type-safe populate support
class SingleTypeAPI<
  TBase,
  TCreateInput = Partial<TBase>,
  TUpdateInput = Partial<TBase>,
  TFilters = Record<string, any>,
  TPopulateKeys extends Record<string, any> = Record<string, any>,
> extends BaseAPI {
  constructor(
    protected endpoint: string,
    config: StrapiClientConfig
  ) {
    super(config)
  }

  // Overload: with populate object → populated return type
  find<
    const TPopulate extends TPopulateKeys,
    const TFields extends Exclude<keyof TBase & string, '__typename'> = never,
  >(
    params: { populate: TPopulate } & QueryParams<TBase, TFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>>
  // Overload: with populate '*' or true → all fields populated
  find<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(
    params: { populate: '*' | true } & QueryParams<TBase, TFilters, '*' | true, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, '*'>, TBase, TFields>>
  // Overload: with populate array → populated return type
  find<
    const TPopulate extends readonly (keyof TPopulateKeys & string)[],
    const TFields extends Exclude<keyof TBase & string, '__typename'> = never,
  >(
    params: { populate: TPopulate } & QueryParams<TBase, TFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>>
  // Overload: general case → base return type
  find<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(
    params?: QueryParams<
      TBase,
      TFilters,
      TPopulateKeys | (keyof TPopulateKeys & string)[] | '*' | boolean,
      TFields
    >,
    nextOptions?: NextOptions
  ): Promise<SelectFields<TBase, TBase, TFields>>

  async find(params?: any, nextOptions?: any): Promise<any> {
    const query = this.buildQueryString(params)
    const url = `${this.config.baseURL}/api/${this.endpoint}${query}`
    const response = await this.request<StrapiResponse<any>>(url, {}, nextOptions)
    return response.data
  }

  async update(data: TUpdateInput | FormData, nextOptions?: NextOptions): Promise<TBase> {
    // If data is FormData, use it directly; otherwise wrap in { data } and JSON stringify
    const body = data instanceof FormData ? data : JSON.stringify({ data })

    const url = `${this.config.baseURL}/api/${this.endpoint}`
    const response = await this.request<StrapiResponse<TBase>>(
      url,
      {
        method: 'PUT',
        body,
      },
      nextOptions
    )
    return response.data
  }
}
// Users & Permissions endpoint (/api/users) — sends and receives a flat
// payload, unlike standard content types which use the { data } envelope
class UsersPermissionsUserAPI<
  TBase,
  TCreateInput = Partial<TBase>,
  TUpdateInput = Partial<TBase>,
  TFilters = Record<string, any>,
  TPopulateKeys extends Record<string, any> = Record<string, any>,
> extends CollectionAPI<TBase, TCreateInput, TUpdateInput, TFilters, TPopulateKeys> {
  protected wrapBody(data: any): any {
    return data
  }

  protected unwrap(response: any): any {
    return response
  }
}
// Custom API class for Role (collection type) with custom routes
class RoleAPI extends CollectionAPI<
  Role,
  RoleCreateInput,
  RoleUpdateInput,
  RoleFilters,
  RolePopulateParam
> {
  /**
   * GET /roles/:id
   * Handler: plugin::users-permissions.role.findOne
   */
  async findOneRole(id: string, nextOptions?: NextOptions): Promise<any> {
    const url = `${this.config.baseURL}/api/${this.endpoint}/${id}`
    const response = await this.request<StrapiResponse<any>>(url, {}, nextOptions)
    return response.data
  }

  /**
   * GET /roles
   * Handler: plugin::users-permissions.role.find
   */
  async findRole(nextOptions?: NextOptions): Promise<any> {
    const url = `${this.config.baseURL}/api/${this.endpoint}`
    const response = await this.request<StrapiResponse<any>>(url, {}, nextOptions)
    return response.data
  }

  /**
   * POST /roles
   * Handler: plugin::users-permissions.role.createRole
   */
  async createRole(data?: any | FormData, nextOptions?: NextOptions): Promise<any> {
    const url = `${this.config.baseURL}/api/${this.endpoint}`
    // If data is FormData, use it directly; otherwise JSON stringify
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined

    const response = await this.request<StrapiResponse<any>>(
      url,
      { method: 'POST', body },
      nextOptions
    )
    return response.data
  }

  /**
   * PUT /roles/:role
   * Handler: plugin::users-permissions.role.updateRole
   */
  async updateRole(role: string, data?: any | FormData, nextOptions?: NextOptions): Promise<any> {
    const url = `${this.config.baseURL}/api/${this.endpoint}/${role}`
    // If data is FormData, use it directly; otherwise JSON stringify
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined

    const response = await this.request<StrapiResponse<any>>(
      url,
      { method: 'PUT', body },
      nextOptions
    )
    return response.data
  }

  /**
   * DELETE /roles/:role
   * Handler: plugin::users-permissions.role.deleteRole
   */
  async deleteRole(role: string, nextOptions?: NextOptions): Promise<any> {
    const url = `${this.config.baseURL}/api/${this.endpoint}/${role}`
    const response = await this.request<StrapiResponse<any>>(url, { method: 'DELETE' }, nextOptions)
    return response.data
  }
}

// Standalone API class for permissions controller
class UsersPermissionsPermissionsAPI extends BaseAPI {
  constructor(config: StrapiClientConfig) {
    super(config)
  }

  /**
   * GET /permissions
   * Handler: plugin::users-permissions.permissions.getPermissions
   */
  async getPermissions(nextOptions?: NextOptions): Promise<any> {
    const url = `${this.config.baseURL}/api/users-permissions/permissions`
    const response = await this.request<StrapiResponse<any>>(url, {}, nextOptions)
    return response.data
  }
}
// Auth API wrapper for users-permissions plugin (generated from actual routes)
class AuthAPI extends BaseAPI {
  constructor(config: StrapiClientConfig) {
    super(config)
  }

  /**
   * GET /connect/(.*)
   * Handler: plugin::users-permissions.auth.connect
   */
  async connect(nextOptions?: NextOptions): Promise<any> {
    const url = `${this.config.baseURL}/api/connect/(.*)`
    return this.request<any>(url, {}, nextOptions, 'Strapi Auth')
  }

  /**
   * POST /auth/local
   * Handler: plugin::users-permissions.auth.callback
   */
  async login(data: LoginCredentials, nextOptions?: NextOptions): Promise<AuthResponse> {
    const url = `${this.config.baseURL}/api/auth/local`
    return this._captureSession(
      await this.request<AuthResponse>(
        url,
        {
          method: 'POST',
          body: data ? JSON.stringify(data) : undefined,
        },
        nextOptions,
        'Strapi Auth'
      )
    )
  }

  /**
   * POST /auth/local/register
   * Handler: plugin::users-permissions.auth.register
   */
  async register(data: RegisterData, nextOptions?: NextOptions): Promise<AuthResponse> {
    const url = `${this.config.baseURL}/api/auth/local/register`
    return this._captureSession(
      await this.request<AuthResponse>(
        url,
        {
          method: 'POST',
          body: data ? JSON.stringify(data) : undefined,
        },
        nextOptions,
        'Strapi Auth'
      )
    )
  }

  /**
   * GET /auth/:provider/callback
   * Handler: plugin::users-permissions.auth.callback
   * OAuth callback with query string support
   * @param provider - OAuth provider name (google, github, etc.)
   * @param search - Query string (e.g., "access_token=xxx&code=yyy" or "?access_token=xxx")
   */
  async callback(
    provider: string,
    search?: string,
    nextOptions?: NextOptions
  ): Promise<AuthResponse> {
    let path = `/api/auth/${provider}/callback`
    if (search) {
      // Add search string, handling both "?key=val" and "key=val" formats
      path += search.startsWith('?') ? search : `?${search}`
    }
    const url = `${this.config.baseURL}${path}`
    return this._captureSession(
      await this.request<AuthResponse>(url, {}, nextOptions, 'Strapi Auth')
    )
  }

  /**
   * POST /auth/forgot-password
   * Handler: plugin::users-permissions.auth.forgotPassword
   */
  async forgotPassword(
    data: ForgotPasswordData,
    nextOptions?: NextOptions
  ): Promise<ForgotPasswordResponse> {
    const url = `${this.config.baseURL}/api/auth/forgot-password`
    return this.request<ForgotPasswordResponse>(
      url,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      nextOptions,
      'Strapi Auth'
    )
  }

  /**
   * POST /auth/reset-password
   * Handler: plugin::users-permissions.auth.resetPassword
   */
  async resetPassword(data: ResetPasswordData, nextOptions?: NextOptions): Promise<AuthResponse> {
    const url = `${this.config.baseURL}/api/auth/reset-password`
    return this._captureSession(
      await this.request<AuthResponse>(
        url,
        {
          method: 'POST',
          body: data ? JSON.stringify(data) : undefined,
        },
        nextOptions,
        'Strapi Auth'
      )
    )
  }

  /**
   * GET /auth/email-confirmation
   * Handler: plugin::users-permissions.auth.emailConfirmation
   * Confirm a user's email address with the token from the confirmation email.
   */
  async confirmEmail(
    confirmationToken: string,
    nextOptions?: NextOptions
  ): Promise<EmailConfirmationResponse> {
    const url = `${this.config.baseURL}/api/auth/email-confirmation?confirmation=${confirmationToken}`
    return this._captureSession(
      await this.request<EmailConfirmationResponse>(url, {}, nextOptions, 'Strapi Auth')
    )
  }

  /**
   * POST /auth/send-email-confirmation
   * Handler: plugin::users-permissions.auth.sendEmailConfirmation
   * Resend the confirmation email to a user who hasn't confirmed yet.
   */
  async sendEmailConfirmation(
    email: string,
    nextOptions?: NextOptions
  ): Promise<SendEmailConfirmationResponse> {
    const url = `${this.config.baseURL}/api/auth/send-email-confirmation`
    return this.request<SendEmailConfirmationResponse>(
      url,
      { method: 'POST', body: JSON.stringify({ email }) },
      nextOptions,
      'Strapi Auth'
    )
  }

  /**
   * POST /auth/change-password
   * Handler: plugin::users-permissions.auth.changePassword
   */
  async changePassword(data: ChangePasswordData, nextOptions?: NextOptions): Promise<AuthResponse> {
    const url = `${this.config.baseURL}/api/auth/change-password`
    return this._captureSession(
      await this.request<AuthResponse>(
        url,
        {
          method: 'POST',
          body: data ? JSON.stringify(data) : undefined,
        },
        nextOptions,
        'Strapi Auth'
      )
    )
  }

  /**
   * GET /auth/sessions
   * Handler: plugin::users-permissions.auth.getSessions
   */
  async getSessions(nextOptions?: NextOptions): Promise<AuthSessionsResponse> {
    const url = `${this.config.baseURL}/api/auth/sessions`
    return this.request<AuthSessionsResponse>(url, {}, nextOptions, 'Strapi Auth')
  }

  /**
   * DELETE /auth/sessions/:sessionId
   * Handler: plugin::users-permissions.auth.revokeSession
   */
  async revokeSession(
    sessionId: string,
    nextOptions?: NextOptions
  ): Promise<RevokeSessionResponse> {
    const url = `${this.config.baseURL}/api/auth/sessions/${sessionId}`
    return this.request<RevokeSessionResponse>(
      url,
      { method: 'DELETE' },
      nextOptions,
      'Strapi Auth'
    )
  }

  /**
   * GET /users/count
   * Handler: plugin::users-permissions.user.count
   */
  async count(nextOptions?: NextOptions): Promise<any> {
    const url = `${this.config.baseURL}/api/users/count`
    return this.request<any>(url, {}, nextOptions, 'Strapi Auth')
  }

  /**
   * GET /users/me
   * Handler: plugin::users-permissions.user.me
   * Supports populate with automatic type inference
   */

  // Overload: with populate object → populated return type
  me<
    const TPopulate extends UserPopulateParam,
    const TFields extends Exclude<keyof User & string, '__typename'> = never,
  >(
    params: { populate: TPopulate } & QueryParams<User, UserFilters, TPopulate, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<User, TPopulate>, User, TFields>>
  // Overload: with populate '*' or true → all fields populated
  me<const TFields extends Exclude<keyof User & string, '__typename'> = never>(
    params: { populate: '*' | true } & QueryParams<User, UserFilters, '*' | true, TFields>,
    nextOptions?: NextOptions
  ): Promise<SelectFields<GetPopulated<User, '*'>, User, TFields>>
  // Overload: general case → base return type
  me<const TFields extends Exclude<keyof User & string, '__typename'> = never>(
    params?: QueryParams<
      User,
      UserFilters,
      UserPopulateParam | (keyof UserPopulateParam & string)[] | '*' | boolean,
      TFields
    >,
    nextOptions?: NextOptions
  ): Promise<SelectFields<User, User, TFields>>

  async me(params?: any, nextOptions?: any): Promise<any> {
    const queryString = params ? this.buildQueryString(params) : ''
    const url = queryString
      ? `${this.config.baseURL}/api/users/me${queryString}`
      : `${this.config.baseURL}/api/users/me`
    const response = await this.request<any>(url, {}, nextOptions, 'Strapi Auth')
    return response
  }

  /**
   * Rotate the refresh token and obtain a new access token — call once on
   * app startup to bootstrap the session (e.g. after a page reload).
   * Concurrent calls share a single in-flight request.
   * Always attempts the request: unlike the automatic 401 handling it goes
   * through the dead-session latch (and lifts it on success), so use it to
   * resume a session started elsewhere, e.g. a login in another tab.
   * Browser-only persistence: in Node the request is still made and the
   * result reported, but no tokens are stored — a shared server-side client
   * must never keep one caller's session for the next caller.
   * @returns false when there is no live session to resume.
   */
  async refresh(): Promise<boolean> {
    return this._refreshSession()
  }

  /**
   * POST /api/auth/logout — revoke the server-side session, then clear the
   * in-memory tokens. Best-effort: local state is cleared even when the
   * server call fails (e.g. the session is already dead).
   */
  async logout(nextOptions?: NextOptions): Promise<void> {
    const session = getAuthSession(this.config)
    try {
      await this.request<unknown>(
        `${this.config.baseURL}/api/auth/logout`,
        {
          method: 'POST',
          ...(session.refreshToken && {
            body: JSON.stringify({ refreshToken: session.refreshToken }),
          }),
        },
        nextOptions,
        'Strapi Auth'
      )
    } catch {
      // Best-effort — local cleanup below is what matters.
    } finally {
      await this.clearToken()
    }
  }

  /**
   * Clear the stored auth token and the in-memory session. Client-side only — does not call the server.
   * Also parks the automatic refresh (a signed-out client must not
   * silently resurrect the session from the cookie) until the next
   * login or explicit refresh().
   */
  async clearToken(): Promise<void> {
    this.config.token = undefined
    const session = getAuthSession(this.config)
    session.accessToken = undefined
    session.refreshToken = undefined
    session.dead = true
    // Invalidate any in-flight refresh: signing out must win the race — a
    // late refresh success must not resurrect this cleared session.
    session.epoch++
  }
}
// API for "upload" plugin
class UploadAPI extends BaseAPI {
  constructor(config: StrapiClientConfig) {
    super(config)
  }

  /**
   * Upload one or more files. Pass FormData with field "files".
   *
   * POST /api/upload
   */
  async upload(body: FormData, nextOptions?: NextOptions): Promise<MediaFile[]> {
    const url = `${this.config.baseURL}/api/upload`
    return this.request<MediaFile[]>(url, { method: 'POST', body }, nextOptions, 'Strapi Upload')
  }

  /**
   * List uploaded files. Supports filters/sort and flat start/limit pagination.
   *
   * GET /api/upload/files
   */
  async find(params?: UploadQueryParams, nextOptions?: NextOptions): Promise<MediaFile[]> {
    const query = this.buildQueryString(params)
    const url = `${this.config.baseURL}/api/upload/files${query}`
    return this.request<MediaFile[]>(url, {}, nextOptions, 'Strapi Upload')
  }

  /**
   * Get a single uploaded file by numeric id.
   *
   * GET /api/upload/files/:id
   */
  async findOne(id: number, nextOptions?: NextOptions): Promise<MediaFile> {
    const url = `${this.config.baseURL}/api/upload/files/${id}`
    return this.request<MediaFile>(url, {}, nextOptions, 'Strapi Upload')
  }

  /**
   * Delete an uploaded file by numeric id. Returns the deleted file.
   *
   * DELETE /api/upload/files/:id
   */
  async delete(id: number, nextOptions?: NextOptions): Promise<MediaFile> {
    const url = `${this.config.baseURL}/api/upload/files/${id}`
    return this.request<MediaFile>(url, { method: 'DELETE' }, nextOptions, 'Strapi Upload')
  }

  /**
   * @deprecated Use `delete()` instead. Will be removed in a future major.
   */
  async destroy(id: number, nextOptions?: NextOptions): Promise<MediaFile> {
    return this.delete(id, nextOptions)
  }
}

// API for "i18n" plugin
class I18nAPI extends BaseAPI {
  constructor(config: StrapiClientConfig) {
    super(config)
  }

  /**
   * List the configured locales. Returns a bare array — this route answers outside the { data, meta } envelope.
   *
   * GET /api/i18n/locales
   */
  async locales(nextOptions?: NextOptions): Promise<I18nLocale[]> {
    const url = `${this.config.baseURL}/api/i18n/locales`
    return this.request<I18nLocale[]>(url, {}, nextOptions, 'Strapi i18n')
  }
}
// Main Strapi client
export class StrapiClient {
  private config: StrapiClientConfig

  // Auth API for users-permissions plugin
  auth: AuthAPI
  /** @deprecated Use `auth` instead. Will be removed in a future major. */
  get authentication(): AuthAPI {
    return this.auth
  }

  // Plugin APIs (registry-driven)
  upload: UploadAPI
  i18n: I18nAPI

  artists: CollectionAPI<
    Artist,
    ArtistCreateInput,
    ArtistUpdateInput,
    ArtistFilters,
    ArtistPopulateParam
  >
  ashsEntries: CollectionAPI<
    AshsEntry,
    AshsEntryCreateInput,
    AshsEntryUpdateInput,
    AshsEntryFilters,
    AshsEntryPopulateParam
  >
  awards: CollectionAPI<Award, AwardCreateInput, AwardUpdateInput, AwardFilters, AwardPopulateParam>
  contacts: CollectionAPI<Contact, ContactCreateInput, ContactUpdateInput, ContactFilters>
  global: SingleTypeAPI<
    Global,
    GlobalCreateInput,
    GlobalUpdateInput,
    GlobalFilters,
    GlobalPopulateParam
  >
  images: CollectionAPI<Image, ImageCreateInput, ImageUpdateInput, ImageFilters, ImagePopulateParam>
  partnerships: CollectionAPI<
    Partnership,
    PartnershipCreateInput,
    PartnershipUpdateInput,
    PartnershipFilters,
    PartnershipPopulateParam
  >
  processions: CollectionAPI<
    Procession,
    ProcessionCreateInput,
    ProcessionUpdateInput,
    ProcessionFilters,
    ProcessionPopulateParam
  >
  pujas: CollectionAPI<Puja, PujaCreateInput, PujaUpdateInput, PujaFilters, PujaPopulateParam>
  virtualTours: CollectionAPI<
    VirtualTour,
    VirtualTourCreateInput,
    VirtualTourUpdateInput,
    VirtualTourFilters,
    VirtualTourPopulateParam
  >
  permissions: CollectionAPI<
    Permission,
    PermissionCreateInput,
    PermissionUpdateInput,
    PermissionFilters,
    PermissionPopulateParam
  >
  roles: RoleAPI
  users: UsersPermissionsUserAPI<
    User,
    UserCreateInput,
    UserUpdateInput,
    UserFilters,
    UserPopulateParam
  >
  usersPermissionsPermissions: UsersPermissionsPermissionsAPI
  constructor(config: StrapiClientConfig) {
    this.config = config

    // Initialize Auth API
    this.auth = new AuthAPI(this.config)

    // Initialize plugin APIs
    this.upload = new UploadAPI(this.config)
    this.i18n = new I18nAPI(this.config)

    this.artists = new CollectionAPI('artists', this.config)
    this.ashsEntries = new CollectionAPI('ashs-entries', this.config)
    this.awards = new CollectionAPI('awards', this.config)
    this.contacts = new CollectionAPI('contacts', this.config)
    this.global = new SingleTypeAPI('global', this.config)
    this.images = new CollectionAPI('images', this.config)
    this.partnerships = new CollectionAPI('partnerships', this.config)
    this.processions = new CollectionAPI('processions', this.config)
    this.pujas = new CollectionAPI('pujas', this.config)
    this.virtualTours = new CollectionAPI('virtual-tours', this.config)
    this.permissions = new CollectionAPI('users-permissions/permissions', this.config)
    this.roles = new RoleAPI('users-permissions/roles', this.config)
    this.users = new UsersPermissionsUserAPI('users', this.config)
    this.usersPermissionsPermissions = new UsersPermissionsPermissionsAPI(this.config)
    // Auto-validate schema in development mode
    if (config.validateSchema) {
      this.validateSchema()
        .then((result) => {
          if (!result.valid && result.remoteHash) {
            console.warn(`[Strapi Types] Schema mismatch detected!`)
            console.warn(`  Local:  ${result.localHash.slice(0, 8)}...`)
            console.warn(`  Remote: ${result.remoteHash.slice(0, 8)}...`)
            console.warn('  Run "npx strapi-types generate" to update types.')
          }
        })
        .catch(() => {
          // Silently ignore validation errors (e.g., plugin not installed)
        })
    }
  }

  /** @deprecated For user sessions prefer the built-in session flow (refresh mode); for other dynamic tokens use `config.onRequest`. `setToken` still works for now. */
  setToken(token: string) {
    this.config.token = token
  }

  /**
   * Validate that local types match the remote Strapi schema.
   * Useful for detecting schema drift in development.
   * @returns Promise<{ valid: boolean; localHash: string; remoteHash?: string; error?: string }>
   */
  async validateSchema(): Promise<{
    valid: boolean
    localHash: string
    remoteHash?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.config.baseURL}/api/strapi-typed-client/schema-hash`)
      if (!response.ok) {
        return {
          valid: false,
          localHash: SCHEMA_HASH,
          error: `Failed to fetch remote schema: ${response.status}`,
        }
      }
      const { hash: remoteHash } = await response.json()
      const valid = SCHEMA_HASH === remoteHash
      if (!valid && this.config.debug) {
        console.warn(
          `[Strapi Types] Schema mismatch! Local: ${SCHEMA_HASH.slice(0, 8)}... Remote: ${remoteHash.slice(0, 8)}...`
        )
        console.warn('[Strapi Types] Run "npx strapi-types generate" to update types.')
      }
      return { valid, localHash: SCHEMA_HASH, remoteHash }
    } catch (error) {
      return {
        valid: false,
        localHash: 'unknown',
        error: (error as Error).message,
      }
    }
  }
}
