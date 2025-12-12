import Image from 'next/image';
import logo from '@/public/circle-logo.png';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="fl-p-4/10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="fl-p-4/8">
                    <div className="flex justify-center mb-6">
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
    )
}