import { StrapiClient } from '@/strapi';

export const strapi = new StrapiClient({
  baseURL: process.env.API_URL!,
  token: process.env.API_KEY!,
});
