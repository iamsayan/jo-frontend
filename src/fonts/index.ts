import {
    Livvic,
    Paytone_One,
} from 'next/font/google'

export const livvic = Livvic({
    weight: ['400', '500', '600', '700', '900'],
    subsets: ['latin'],
    variable: '--font-family',
    display: 'swap',
})

export const paytoneOne = Paytone_One({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})