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
  group(name: string): StrapiNextClient;
  noStore(): StrapiNextClient;
  // internal tags and group for next.js cache invalidation
  __next_tags?: string[];
  __next_group?: string;
};

export default function strapiNext(config: Config): StrapiNextClient {
  const client = strapi(config) as StrapiNextClient;

  client.with = (scoped: NextInit): StrapiNextClient => {
    const clone = Object.create(client) as StrapiNextClient;
    const baseFetch = client.fetch.bind(client);

    clone.__next_tags = scoped.next?.tags ?? client.__next_tags ?? [];
    clone.__next_group = client.__next_group;

    clone.fetch = (url: string, init: RequestInit = {}) => baseFetch(url, {
      ...init,
      next: {
        ...(scoped.next ?? {}),
        ...(init as any).next ?? {},
      },
      cache: init.cache ?? scoped.cache,
      headers: {
        ...(scoped.headers as any),
        ...(init.headers as any),
      } as HeadersInit,
    } as NextInit);

    return clone;
  };

  client.tag = (tag: string) => {
    const current = client.__next_tags ?? [];
    const merged = Array.from(new Set([...current, tag]));
    const c = client.with({ next: { tags: merged } });
    c.__next_tags = merged; // persist on returned client
    return c;
  };

  client.tags = (tags: string[]) => {
    const current = client.__next_tags ?? [];
    const merged = Array.from(new Set([...current, ...tags]));
    const c = client.with({ next: { tags: merged } });
    c.__next_tags = merged;
    return c;
  };

  client.revalidate = (seconds: number) => client.with({ next: { revalidate: seconds } });

  client.group = (name: string) => {
    const c = client.tag(`group:${name}`);
    c.__next_group = name;
    return c;
  };

  client.noStore = () => client.with({ cache: 'no-store' });

  const baseCollection = client.collection.bind(client);
  client.collection = ((name: string) => {
    const tagName = client.__next_group ? `${client.__next_group}:${name}` : name;
    const scoped = client.tag(tagName);
    return baseCollection.call(scoped, name);
  }) as typeof client.collection;

  const baseSingle = client.single.bind(client);
  client.single = ((name: string) => {
    const tagName = client.__next_group ? `${client.__next_group}:${name}` : name;
    const scoped = client.tag(tagName);
    return baseSingle.call(scoped, name);
  }) as typeof client.single;

  return client;
}