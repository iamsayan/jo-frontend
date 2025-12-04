
import strapiNext from '@/lib/client';

export const client = strapiNext({
    baseURL: process.env.API_URL!,
    auth: process.env.API_KEY,
});

export const cms = client.revalidate(604800);
export const admin = client.noStore();
