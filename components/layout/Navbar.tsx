'use client';

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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useUser, SignInButton, SignOutButton, useClerk } from "@clerk/nextjs";
import { REGIONS, CITIES, MOCK_ACTIVITIES } from '@/lib/constants';

const mainNavLinks = [
  { href: '/activities', label: 'Activities' },
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
  const [searchVisible, setSearchVisible] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      {/* Main Navigation */}
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
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-4 mt-4">
                {categoryNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
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

        {/* Desktop main nav */}
        <nav className="hidden lg:flex items-center space-x-6">
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

      {/* Category Navigation */}
      <div className="hidden lg:block border-t bg-black h-16">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList className="space-x-2">
              {categoryNavLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuTrigger className="bg-transparent flex items-center justify-center mt-3 mr-10 ml-4 text-[1rem] text-white">
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-3 p-4 w-[600px]">
                      {MOCK_ACTIVITIES
                        .filter(activity => activity.category === link.category)
                        .slice(0, 6)
                        .map((activity) => (
                          <Link
                            key={activity.id}
                            href={`/activities/${activity.id}`}
                            className="flex items-start gap-3 p-2 hover:bg-muted rounded-md"
                          >
                            <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={activity.image}
                                alt={activity.title}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{activity.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {activity.description}
                              </p>
                              <p className="text-sm font-medium mt-1">
                                From £{activity.priceFrom}
                              </p>
                            </div>
                          </Link>
                        ))}
                      <div className="col-span-2 mt-2 text-center">
                        <Link
                          href={link.href}
                          className="text-sm text-purple-600 hover:text-purple-700"
                        >
                          View all {link.label} activities →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Book a Party Button */}
          <Link
            href="/activities"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-md whitespace-nowrap mt-3 ml-4"
          >
            Book a Party
          </Link>
        </div>
      </div>
    </header>
  );
}