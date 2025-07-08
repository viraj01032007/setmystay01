"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Crown, User, Home, Users, Building, BedDouble, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Logo } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Page } from "@/lib/types";

interface NavLinkProps {
  page: Page;
  activePage: Page;
  onClick: (page: Page) => void;
  children: React.ReactNode;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ page, activePage, onClick, children, isMobile }) => {
  const isActive = activePage === page;
  
  if (isMobile) {
    return (
      <SheetClose asChild>
        <button
          onClick={() => onClick(page)}
          className={cn(
            "flex items-center w-full p-3 rounded-lg gap-3 transition-colors",
            isActive ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted"
          )}
        >
          {children}
        </button>
      </SheetClose>
    );
  }

  return (
    <button
      onClick={() => onClick(page)}
      className={cn(
        "relative py-2 text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-foreground/60"
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
      )}
    </button>
  );
};

interface HeaderProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onSignInClick: () => void;
  onSubscriptionClick: () => void;
}

export function Header({ activePage, setActivePage, onSignInClick, onSubscriptionClick }: HeaderProps) {
  const navItems = [
    { page: 'home' as Page, label: 'Home', icon: <Home className="w-5 h-5" /> },
    { page: 'pg' as Page, label: 'PG Listings', icon: <BedDouble className="w-5 h-5" /> },
    { page: 'rentals' as Page, label: 'Rentals', icon: <Building className="w-5 h-5" /> },
    { page: 'roommates' as Page, label: 'Roommates', icon: <Users className="w-5 h-5" /> },
    { page: 'list' as Page, label: 'List Property', icon: <PlusCircle className="w-5 h-5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setActivePage('home')}>
          <Logo className="w-10 h-10" />
          <span className="text-xl font-semibold text-gray-800">SetMyStay</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map(item => (
            <NavLink key={item.page} page={item.page} activePage={activePage} onClick={setActivePage}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={onSubscriptionClick}>
            <Crown className="w-4 h-4 mr-2" />
            Pricing
          </Button>
          <Button variant="secondary" size="sm" onClick={onSignInClick}>
            <User className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                   <Link href="/" className="flex items-center gap-2" onClick={() => setActivePage('home')}>
                     <Logo className="w-8 h-8" />
                     <span className="text-lg font-semibold text-gray-800">SetMyStay</span>
                   </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex flex-col gap-2 flex-grow">
                  {navItems.map(item => (
                     <NavLink key={item.page} page={item.page} activePage={activePage} onClick={setActivePage} isMobile>
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
                
                <Button size="lg" className="w-full mt-4" onClick={onSubscriptionClick}>
                  <Crown className="w-4 h-4 mr-2"/>
                  Pricing
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
