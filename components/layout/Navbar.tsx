"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Menu, Search, X, PartyPopper, UserCircle2, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useUser, SignInButton, SignOutButton, useClerk } from "@clerk/nextjs";

const navLinks = [
  { href: '/activities', label: 'Activities' },
  { href: '/locations', label: 'Locations' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [searchVisible, setSearchVisible] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <PartyPopper className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Party Pulse
            </span>
          </Link>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search and Auth */}
        <div className="flex items-center space-x-4">
          <div className={`${searchVisible ? 'flex' : 'hidden'} absolute inset-x-0 top-0 h-16 bg-background lg:static lg:inset-auto lg:h-auto lg:w-[260px] lg:flex`}>
            <Input
              placeholder="Search activities or locations..."
              className="h-10 w-full border-0 bg-muted px-4 lg:border lg:bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3 lg:right-0 lg:top-0"
              onClick={() => setSearchVisible(false)}
            >
              <X className="h-5 w-5 lg:hidden" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`${searchVisible ? 'hidden' : 'flex'} lg:hidden`}
            onClick={() => setSearchVisible(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  {user.organizationMemberships?.length > 0 ? (
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
                {user.organizationMemberships?.length > 0 && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
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
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}