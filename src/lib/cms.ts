
import strapiNext from '@/lib/client';

export const cms = strapiNext({
    baseURL: process.env.API_URL!,
    auth: process.env.API_KEY,
}).revalidate(process.env.NODE_ENV === 'development' ? 0 : 604800);
