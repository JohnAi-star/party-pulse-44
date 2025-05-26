'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, PartyPopper, UserCircle2, Shield, Gift, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useUser, SignInButton, SignOutButton, useClerk, SignUpButton } from "@clerk/nextjs";
import { MOCK_ACTIVITIES } from '@/lib/constants';

const mainNavLinks = [
  { href: '/activities', label: 'Activities' },
  { href: '/venues', label: 'Venues' },
  { href: '/locations', label: 'Locations' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const categoryNavLinks = [
  { href: '/activities?category=hen-do', label: 'Hen Do', category: 'Hen Do' },
  { href: '/activities?category=stag-do', label: 'Stag Do', category: 'Stag Do' },
  { href: '/activities?category=team-building', label: 'Team Building', category: 'Team Building' },
  { href: '/activities?category=birthday', label: 'Birthday', category: 'Birthday' },
  { href: '/activities?category=corporate', label: 'Corporate', category: 'Corporate' },
  { href: '/activities?category=kids', label: 'Kids', category: 'Kids' },
];

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const isAdmin = user?.publicMetadata?.role === "admin";

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      {/* Mobile Header */}
      <div className="lg:hidden">
        {/* Top Bar */}
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4">
                  {categoryNavLinks.map((link) => (
                    <div key={link.href} className="mb-4">
                      <button
                        className="flex items-center justify-between w-full text-lg font-medium"
                        onClick={() => toggleCategory(link.category)}
                      >
                        {link.label}
                        {expandedCategory === link.category ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                      {expandedCategory === link.category && (
                        <div className="mt-2 pl-4">
                          <div className="space-y-3">
                            {MOCK_ACTIVITIES
                              .filter(activity => activity.category === link.category)
                              .map((activity) => (
                                <Link
                                  key={activity.id}
                                  href={`/activities/${activity.id}`}
                                  className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded-md"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                    <img
                                      src={activity.image}
                                      alt={activity.title}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm">{activity.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {activity.description}
                                    </p>
                                    <p className="text-xs font-medium mt-1">
                                      From £{activity.priceFrom}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            <Link
                              href={link.href}
                              className="block text-center mt-2 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-sm"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              View All {link.label} Activities
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <PartyPopper className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Party Pulse
            </span>
          </Link>

          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="px-4 py-2 bg-white border-t">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for activities..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button 
                className="absolute right-3 top-2.5"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <div className="bg-black h-14 flex items-center justify-around px-2">
          <Link
            href="/party-planning"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 rounded-sm whitespace-nowrap"
          >
            <span className="block">Plan a</span>
            <span className="block">Party</span>
          </Link>

          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white flex flex-col items-center justify-center h-full px-2">
                  <UserCircle2 className="h-5 w-5" />
                  <span className="text-xs mt-1">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="flex flex-col items-start">
                  <span className="font-medium">{user.fullName || user.emailAddresses[0].emailAddress}</span>
                  <span className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/activities" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <UserCircle2 className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => signOut()}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-white flex flex-col items-center justify-center h-full px-2">
                  <UserCircle2 className="h-5 w-5" />
                  <span className="text-xs mt-1">Sign in</span>
                </Button>
              </SignInButton>
            </>
          )}

          <SignUpButton mode="modal">
            <Button variant="ghost" className="text-white flex flex-col items-center justify-center h-full px-2">
              <span className="text-xs">Create</span>
              <span className="text-xs">Account</span>
            </Button>
          </SignUpButton>

          <Link
            href="/gift-cards"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 rounded-sm whitespace-nowrap"
          >
            <Gift className="h-5 w-5" />
            <span className="text-xs mt-1">Buy a Gift</span>
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        {/* Main Navigation */}
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <PartyPopper className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                Party Pulse
              </span>
            </Link>
          </div>

          {/* Desktop main nav */}
          <nav className="flex items-center space-x-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth and Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/party-planning"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-md whitespace-nowrap"
            >
              Plan a Party
            </Link>

            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    {isAdmin ? (
                      <Shield className="h-5 w-5 text-purple-600" />
                    ) : (
                      <UserCircle2 className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="flex flex-col items-start">
                    <span className="font-medium">{user.fullName || user.emailAddresses[0].emailAddress}</span>
                    <span className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/activities" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <UserCircle2 className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button className='text-purple-600' variant="ghost" size="sm">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className='text-purple-600' variant="ghost" size="sm">
                    Create Account
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        {/* Categories Navigation - Desktop */}
        <div className="border-t bg-black h-16">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {categoryNavLinks.map((link) => (
                <div key={link.href} className="group relative">
                  <button className="text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-colors flex items-center">
                    {link.label}
                    <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute left-0 mt-2 w-96 bg-white shadow-lg rounded-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-3">{link.label} Activities</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {MOCK_ACTIVITIES
                          .filter(activity => activity.category === link.category)
                          .slice(0, 3)
                          .map((activity) => (
                            <Link
                              key={activity.id}
                              href={`/activities/${activity.id}`}
                              className="flex items-start gap-3 p-3 hover:bg-gray-100 rounded-md"
                            >
                              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={activity.image}
                                  alt={activity.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm">{activity.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {activity.description}
                                </p>
                                <p className="text-xs font-medium mt-1">
                                  From £{activity.priceFrom}
                                </p>
                              </div>
                            </Link>
                          ))}
                      </div>
                      <Link
                        href={link.href}
                        className="block text-center mt-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-sm"
                      >
                        View All {link.label} Activities
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/gift-cards"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-md whitespace-nowrap ml-4"
            >
              Buy a Gift
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}