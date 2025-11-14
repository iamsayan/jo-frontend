import {
    Paytone_One,
    Rubik
} from 'next/font/google'

export const livvic = Rubik({
    weight: ['400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-family',
    display: 'swap',
})

export const paytoneOne = Paytone_One({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})