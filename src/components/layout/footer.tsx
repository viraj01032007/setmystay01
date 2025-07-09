
"use client";

import Link from "next/link";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import type { Page } from "@/lib/types";

interface FooterProps {
  onYourPropertiesClick: () => void;
  onNavigate: (page: Page) => void;
}

export function Footer({ onYourPropertiesClick, onNavigate }: FooterProps) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-10 h-10" />
              <span className="text-xl font-bold text-white">SetMyStay</span>
            </Link>
            <p className="text-sm">
              Your trusted partner for finding the perfect living space. Connecting people with their ideal homes.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-white"><Facebook className="w-5 h-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-white"><Twitter className="w-5 h-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-white"><Instagram className="w-5 h-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-white"><Linkedin className="w-5 h-5" /></a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><button onClick={onYourPropertiesClick} className="hover:text-white text-left w-full">Your Properties</button></li>
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white">Visit Our Office</Link></li>
              <li><Link href="/admin" className="hover:text-white">Admin Dashboard</Link></li>
              <li><button onClick={() => onNavigate('list')} className="hover:text-white text-left w-full">Post Your Property</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>Office no. 01, Neelsidhi Splendour, Sector 15, CBD Belapur, Navi Mumbai, Maharashtra 400614</p>
              <a href="mailto:setmystay02@gmail.com" className="flex items-center gap-2 hover:text-white">
                <Mail className="w-4 h-4"/>
                <span>setmystay02@gmail.com</span>
              </a>
              <a href="tel:+918210552902" className="flex items-center gap-2 hover:text-white">
                <Phone className="w-4 h-4" />
                <span>+91 8210552902</span>
              </a>
            </div>
          </div>
          
        </div>

        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm">
          {currentYear && <p>&copy; {currentYear} SetMyStay. All rights reserved.</p>}
        </div>
      </div>
    </footer>
  );
}
