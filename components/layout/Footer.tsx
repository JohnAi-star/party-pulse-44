import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PartyPopper, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const footerLinks = [
  {
    title: 'Activities',
    links: [
      { label: 'Hen Do', href: '/activities?category=hen-do' },
      { label: 'Stag Do', href: '/activities?category=stag-do' },
      { label: 'Team Building', href: '/activities?category=team-building' },
      { label: 'Birthday', href: '/activities?category=birthday' },
      { label: 'Corporate', href: '/activities?category=corporate' },
    ],
  },
  {
    title: 'Top Cities',
    links: [
      { label: 'London', href: '/activities?location=london' },
      { label: 'Manchester', href: '/activities?location=manchester' },
      { label: 'Birmingham', href: '/activities?location=birmingham' },
      { label: 'Edinburgh', href: '/activities?location=edinburgh' },
      { label: 'Liverpool', href: '/activities?location=liverpool' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <PartyPopper className="h-6 w-6 text-pink-500 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 text-transparent bg-clip-text">
                Party Pulse
              </span>
            </Link>
            <p className="mb-4 text-slate-300">
              Find and book amazing group activities for any occasion. From hen parties to team building, we've got you covered.
            </p>
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-2">Subscribe to our newsletter</h3>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email"
                  className="bg-slate-800 border-slate-700"
                />
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-300 hover:text-white text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social and copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Button variant="ghost" size="icon" className="text-slate-300">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-300">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-300">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-300">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
          <div className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Party Pulse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}