import Link from 'next/link';
import { FaYoutube, FaFacebookF, FaInstagram, FaXTwitter, FaPinterestP, FaGithub, FaWhatsapp } from "react-icons/fa6";
import ScrollTop from "@/components/scroll-top";

interface NavItem {
    name: string;
    path: string;
    target?: '_blank' | '_self';
}

export default function Footer() {
    const items: NavItem[] = [
        {
            name: 'About Us',
            path: '/about-us'
        },
        {
            name: 'Contact',
            path: '/contact-us'
        },
        {
            name: 'Store',
            path: 'https://store.jagadhatrionline.co.in/',
            target: '_blank'
        },
        {
            name: 'Terms & Conditions',
            path: '/terms'
        },
        {
            name: 'Privacy Policy',
            path: '/privacy-policy'
        },
    ];

    return (
        <footer className="p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,#94a3b8_1px,transparent_1px)] bg-[length:40px_40px]"></div>
            <div className="footer footer-horizontal footer-center container mx-auto relative z-10">
                <nav className="grid grid-flow-row md:grid-flow-col gap-2 md:gap-4">
                    {items.map((item, index) => (
                        <div key={index} className="text-xs md:text-sm">
                            <Link href={item.path} target={item.target ?? '_self'} className="link link-hover">{item.name}</Link>
                        </div>
                    ))}
                </nav>
                <nav>
                    <div className="grid grid-flow-col gap-4">
                        <a href="https://www.facebook.com/JagadhatriOnlineOfficial/" aria-label="Facebook" target="_blank" rel="noopener">
                            <FaFacebookF className="size-4 sm:size-5 md:size-6" />
                        </a>
                        <a href="https://www.youtube.com/c/JagadhatriOnline?sub_confirmation=1" aria-label="YouTube" target="_blank"
                           rel="noopener">
                            <FaYoutube className="size-4 sm:size-5 md:size-6" />
                        </a>
                        <a href="https://www.instagram.com/jagadhatri_online" aria-label="Instagram" target="_blank" rel="noopener">
                            <FaInstagram className="size-4 sm:size-5 md:size-6" />
                        </a>
                        <a href="https://whatsapp.com/channel/0029Va54b17DOQIQ6yoP9t39" aria-label="WhatsApp" target="_blank" rel="noopener">
                            <FaWhatsapp className="size-4 sm:size-5 md:size-6" />
                        </a>
                        <a href="https://x.com/Official_JO16" target="_blank" aria-label="X" rel="noopener">
                            <FaXTwitter className="size-4 sm:size-5 md:size-6" />
                        </a>
                        <a href="https://www.pinterest.com/jagadhatrionline/" aria-label="Pinterest" target="_blank" rel="noopener">
                            <FaPinterestP className="size-4 sm:size-5 md:size-6" />
                        </a>
                        {/* <a href="https://github.com/iamsayan/jo-website" aria-label="GitHub" target="_blank" rel="noopener">
                            <FaGithub className="size-4 sm:size-5 md:size-6" />
                        </a> */}
                    </div>
                </nav>
                <aside className="text-slate-400 text-xs">
                    <p>Copyright © 2016 - {new Date().getFullYear()} Jagadhatri Online. All Rights Reserved.</p>
                    <p>Developed with ❤️ by <a href="https://sayandatta.co.in" target="_blank" rel="noopener">Sayan Datta</a>.</p>
                    <p>Unauthorized copying or representation of any content / photograph / illustration / artwork
                        from this website is strictly prohibited.</p>
                </aside>
            </div>
            <ScrollTop />
        </footer>
    )
}