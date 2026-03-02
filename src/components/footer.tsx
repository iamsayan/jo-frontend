'use client';

import ScrollTop from '@/components/scroll-top';
import { useSiteData } from '@/contexts/siteDataContext';
import { getDateByIndex } from '@/utils/functions';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import {
  FaEnvelope,
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaPinterestP,
  FaThreads,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

interface NavItem {
  name: string;
  path: string;
  target?: '_blank' | '_self';
}

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  link?: string;
}

export default function Footer() {
  const siteData = useSiteData();

  const navigationItems: NavItem[] = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact-us' },
    { name: 'JO Cinematics', path: '/digital-media-partnership' },
    {
      name: 'Visit Store',
      path: 'https://store.jagadhatrionline.co.in/',
      target: '_blank',
    },
  ];

  const legalItems: NavItem[] = [
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ];

  const socialLinks: SocialLink[] = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/JagadhatriOnlineOfficial/',
      icon: FaFacebookF,
      color: 'hover:text-blue-500',
    },
    {
      name: 'WhatsApp',
      url: 'https://www.whatsapp.com/channel/0029Va54b17DOQIQ6yoP9t39',
      icon: FaWhatsapp,
      color: 'hover:text-green-500',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/c/JagadhatriOnline?sub_confirmation=1',
      icon: FaYoutube,
      color: 'hover:text-red-500',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/jagadhatri_online',
      icon: FaInstagram,
      color: 'hover:text-pink-500',
    },
    {
      name: 'Threads',
      url: 'https://www.threads.com/@jagadhatri_online',
      icon: FaThreads,
      color: 'hover:text-black dark:hover:text-white',
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/Official_JO16',
      icon: FaXTwitter,
      color: 'hover:text-black dark:hover:text-white',
    },
    {
      name: 'Pinterest',
      url: 'https://www.pinterest.com/jagadhatrionline/',
      icon: FaPinterestP,
      color: 'hover:text-red-600',
    },
  ];

  const contactInfo: ContactInfo[] = [
    { icon: FaMapMarkerAlt, text: 'Chandannagar, West Bengal, India' },
    {
      icon: FaEnvelope,
      text: 'info@jagadhatrionline.co.in',
      link: 'mailto:info@jagadhatrionline.co.in',
    },
  ];

  const startDate = useMemo(
    () => getDateByIndex(siteData?.schedules, 0),
    [siteData?.schedules]
  );
  const endDate = useMemo(
    () => getDateByIndex(siteData?.schedules, 'last'),
    [siteData?.schedules]
  );
  const pujaYear = useMemo(
    () => startDate.getFullYear() || new Date().getFullYear(),
    [startDate]
  );

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_1px,transparent_1px)] bg-[length:40px_40px] opacity-5"></div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-12 text-center md:text-left lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:[grid-template-columns:1.1fr_0.5fr_0.8fr_0.9fr]">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center justify-center space-x-3 md:justify-start">
              <Image
                src="/logo.png"
                alt="Jagadhatri Online"
                className="fl-h-12/14 w-auto"
                width={500}
                height={500}
              />
              {/* <div>
                                <h3 className="text-xl font-bold text-white">Jagadhatri Online</h3>
                                <p className="text-sm text-slate-400">Celebrating Culture & Tradition</p>
                            </div> */}
            </div>
            <p className="fl-text-xs/sm mb-6 leading-relaxed text-slate-300">
              Dedicated to preserving and promoting the rich cultural heritage
              of Chandannagar Jagadhatri Puja and fostering community
              connections through digital platforms. We celebrate the divine
              mother Jagadhatri and bring together devotees from around the
              world.
            </p>

            {/* Social Links */}
            <div className="fl-space-x-1.5/4 flex justify-center md:justify-start">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.name}
                  title={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full border-2 border-slate-700/50 bg-slate-700/50 p-2 transition-all duration-300 hover:bg-slate-600/50 ${social.color}`}
                >
                  <social.icon className="fl-size-3/4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">
              Quick Links
            </h4>
            <nav className="space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  target={item.target ?? '_self'}
                  className="fl-text-xs/sm block text-slate-300 transition-colors duration-200 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Legal Links */}
            <div className="mt-4 border-t border-slate-700/30 pt-4">
              <div className="space-y-2">
                {legalItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="fl-text-xs/sm block text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">
              Contact & Info
            </h4>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start justify-center space-x-3 md:justify-start"
                >
                  <contact.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                  {contact.link ? (
                    <a
                      href={contact.link}
                      className="fl-text-xs/sm text-slate-300 transition-colors duration-200 hover:text-white"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <span className="fl-text-xs/sm text-slate-300">
                      {contact.text}
                    </span>
                  )}
                </div>
              ))}

              {/* Quick Stats */}
              {/* <div className="pt-4 border-t border-slate-700/30">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-400">8+</div>
                                        <div className="text-xs text-slate-400">Years of Service</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-400">1000+</div>
                                        <div className="text-xs text-slate-400">Community Members</div>
                                    </div>
                                </div>
                            </div> */}

              {/* Additional Info */}
              <div className="border-t border-slate-700/30 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-3 md:justify-start">
                    <div className="fl-size-2/3 flex-shrink-0 rounded-full bg-orange-500"></div>
                    <span className="fl-text-xs/sm text-slate-300">
                      Established in 2016
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 md:justify-start">
                    <div className="fl-size-2/3 flex-shrink-0 rounded-full bg-orange-500"></div>
                    <span className="fl-text-xs/sm text-slate-300">
                      Cultural Heritage Preservation
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 md:justify-start">
                    <div className="fl-size-2/3 flex-shrink-0 rounded-full bg-orange-500"></div>
                    <span className="fl-text-xs/sm text-slate-300">
                      Community Driven
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">
              Upcoming Events
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-700/30 p-3">
                <div className="text-xs font-medium text-orange-400 uppercase">
                  Celebration {pujaYear}
                </div>
                <div className="fl-text-xs/sm mt-1 font-medium text-white">
                  Jagadhatri Puja
                </div>
                <div className="text-xs text-slate-300">
                  Annual celebration from {format(startDate, 'do MMMM')} to{' '}
                  {format(endDate, 'do MMMM')}
                </div>
              </div>
              <div className="rounded-lg bg-slate-700/30 p-3">
                <div className="text-xs font-medium text-orange-400 uppercase">
                  {format(endDate, 'MMM yyyy')}
                </div>
                <div className="fl-text-xs/sm mt-1 font-medium text-white">
                  Grand Procession
                </div>
                <div className="text-xs text-slate-300">
                  Grand procession starts on {format(endDate, 'do MMMM')}, from
                  6:00 PM onwards
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-slate-700/50 pt-8">
          <div className="text-center">
            <div className="mb-4 text-sm text-slate-400">
              <p>
                Copyright © 2016 - {new Date().getFullYear()} Jagadhatri Online.
                All Rights Reserved.
              </p>
              <p className="mt-1 text-xs">
                Developed with{' '}
                <FaHeart className="mx-0.5 inline-block animate-pulse text-red-400" />{' '}
                by{' '}
                <a
                  href="https://sayandatta.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-orange-300"
                >
                  Sayan Datta
                </a>
              </p>
            </div>
            <div className="text-xs text-slate-400">
              Unauthorized copying or representation of any content, photograph,
              illustration, or artwork from this website is strictly prohibited.
            </div>
            {/*<div className="mt-1 text-xs text-slate-400">
              Last Updated: {timeOrigin('MMMM dd, yyyy')}
            </div>*/}
            {/* <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3">
                            <div className="flex-shrink-0">
                                <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-slate-300 text-xs">
                                <span className="font-medium text-orange-400">Copyright Notice:</span>
                                <br />
                                Unauthorized copying or representation of any content, photograph,
                                illustration, or artwork from this website is strictly prohibited.
                            </div>
                        </div> */}
          </div>
        </div>
      </div>
      <ScrollTop />
    </footer>
  );
}
