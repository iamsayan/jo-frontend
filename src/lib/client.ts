import { strapi, type Config } from '@strapi/client';

export type NextInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[]
  };
};

export type StrapiNextClient = ReturnType<typeof strapi> & {
  with(init: NextInit): StrapiNextClient;
  tag(tag: string): StrapiNextClient;
  tags(tags: string[]): StrapiNextClient;
  revalidate(seconds: number): StrapiNextClient;
  noStore(): StrapiNextClient;

  // internal state carried on the instance
  __next_tags?: string[];
};

export default function strapiNext(config: Config): StrapiNextClient {
  const client = strapi(config) as StrapiNextClient;

  client.with = function withScoped(this: StrapiNextClient, scoped: NextInit): StrapiNextClient {
    const clone = Object.create(this) as StrapiNextClient;
    const baseFetch = this.fetch.bind(this);

    const parentTags = this.__next_tags ?? [];
    const incoming = scoped.next?.tags ?? [];
    clone.__next_tags = Array.from(new Set([...parentTags, ...incoming]));

    clone.fetch = (url: string, init: RequestInit = {}) => {
      const callNext = (init as any).next ?? {};
      const callTags = Array.isArray(callNext.tags) ? callNext.tags : [];
      const merged = Array.from(new Set([...(clone.__next_tags ?? []), ...callTags]));

      return baseFetch(url, {
        ...init,
        next: {
          ...(scoped.next ?? {}),
          ...callNext,
          tags: merged,
        },
        cache: init.cache ?? scoped.cache,
        headers: {
          ...(scoped.headers ?? {}),
          ...(init.headers ?? {}),
        } as HeadersInit,
      } as NextInit);
    };

    return clone;
  };

  client.tag = function (this: StrapiNextClient, tag: string) {
    return this.tags([tag]);
  };

  client.tags = function (this: StrapiNextClient, tags: string[]) {
    const current = this.__next_tags ?? [];
    const merged = Array.from(new Set([...current, ...tags]));
    const c = this.with({ next: { tags: merged } });
    c.__next_tags = merged;
    return c;
  };

  client.revalidate = function (this: StrapiNextClient, seconds: number) {
    return this.with({ next: { revalidate: seconds } });
  };

  client.noStore = function (this: StrapiNextClient) {
    return this.with({ cache: 'no-store' });
  };

  return client;
}