import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Jagadhatri Online',
        short_name: 'Jagadhatri Online',
        description: '#1 Online Jagadhatri Puja Portal',
        start_url: '/',
        display: 'standalone',
        background_color: '#eab308',
        theme_color: '#eab308',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '32x32',
                type: 'image/x-icon',
            },
        ],
    };
}
