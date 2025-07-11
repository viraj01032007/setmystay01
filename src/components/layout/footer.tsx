
"use client";

import Link from "next/link";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import type { Page } from "@/lib/types";

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
                <a href="https://www.instagram.com/setmystay?igsh=MXJkOXFkYzVwc3JjNg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-400 hover:text-white"><Instagram className="w-5 h-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.linkedin.com/company/setmystay/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white"><Linkedin className="w-5 h-5" /></a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white text-left w-full">Home</button></li>
              <li><button onClick={() => onNavigate('my-properties')} className="hover:text-white text-left w-full">Your Properties</button></li>
              <li><a href="https://g.co/kgs/Mmk6x3N" target="_blank" rel="noopener noreferrer" className="hover:text-white">Visit Our Office</a></li>
              <li><Link href="/admin" className="hover:text-white">Admin Dashboard</Link></li>
              <li><Link href="/staff" className="hover:text-white">Staff Dashboard</Link></li>
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
          {isMounted && <p>&copy; {new Date().getFullYear()} SetMyStay. All rights reserved.</p>}
          <p className="text-xs text-slate-400 mt-2">Designed by CodeCrafter (Viraj & Devansh)</p>
        </div>
      </div>
    </footer>
  );
}
