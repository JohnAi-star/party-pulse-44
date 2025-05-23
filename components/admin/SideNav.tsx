'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Package,
  BarChart,
  Star,
  Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  {
    title: 'Activities',
    href: '/admin/activities',
    icon: Package
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: Star
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users
  }
];

export function SideNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile menu button - positioned below navbar */}
      {isMobile && (
        <div className="fixed top-30 left-4 z-50 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md bg-white shadow-md border"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle admin menu</span>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static bg-white border-r z-40 transition-all duration-300 ease-in-out",
          "w-64 min-h-screen",
          isMobile 
            ? (isOpen ? "left-0 top-24" : "-left-64") 
            : "left-0 top-16"
        )}
        style={{
          height: isMobile ? "calc(100vh - 6rem)" : "calc(100vh - 4rem)"
        }}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href 
                    ? "bg-purple-50 text-purple-600" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}