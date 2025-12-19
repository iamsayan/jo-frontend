import Image from 'next/image';
import logo from '@/public/circle-logo.png';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="fl-p-4/10 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="mx-auto max-w-xl overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="fl-p-4/8">
                    <div className="mb-6 flex justify-center">
                        <Image
                            src={logo}
                            alt="Organization Logo"
                            className="fl-w-[70px]/[120px]"
                            priority={true}
                        />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
