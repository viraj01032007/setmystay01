
"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Listing, RoommateProfile, Page } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home as HomeIcon, BedDouble, Search } from "lucide-react";
import { PropertyCard } from "@/components/shared/property-card";
import { RoommateCard } from "@/components/shared/roommate-card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { indianCities } from "@/lib/cities";

interface HomeSectionProps {
  featuredProperties: Listing[];
  featuredRoommates: RoommateProfile[];
  onViewDetails: (item: Listing | RoommateProfile, type: 'listing' | 'roommate') => void;
  onNavigate: (page: Page) => void;
}

const features = [
  {
    icon: <BedDouble className="w-8 h-8 text-white" />,
    title: "PG Accommodations",
    description: "Discover comfortable paying guest accommodations with modern amenities and flexible lease terms.",
  },
  {
    icon: <HomeIcon className="w-8 h-8 text-white" />,
    title: "Premium Rentals",
    description: "Explore verified rental properties with detailed amenities, photos, and transparent pricing information.",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Find Roommates",
    description: "Connect with compatible roommates based on lifestyle preferences, location, and budget requirements.",
  },
];

export function HomeSection({ featuredProperties, featuredRoommates, onViewDetails, onNavigate }: HomeSectionProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const filteredSuggestions = indianCities
        .filter(city => city.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 7); // Limit suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden min-h-[50vh] flex items-center justify-center text-center p-6">
        <Image
          src="https://placehold.co/1200x600"
          alt="Modern architecture"
          fill
          className="object-cover -z-10"
          priority
          data-ai-hint="modern architecture"
        />
        <div className="absolute inset-0 bg-black/60 -z-10" />
        <div className="relative text-white max-w-4xl space-y-6 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Find Your Perfect Living Space
          </h1>
          <p className="text-lg sm:text-xl text-slate-200">
            Discover roommates, rental properties, and PG accommodations with transparent pricing.
          </p>
          
          <div className="max-w-2xl mx-auto relative" ref={searchContainerRef}>
            <div className="flex items-center bg-white rounded-full shadow-lg p-2">
              <Input
                type="text"
                placeholder="Search for a location, e.g., 'Mumbai'"
                className="flex-grow bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-500"
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputChange}
              />
              <Button size="lg" className="rounded-full">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto text-left">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-muted text-gray-800"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" onClick={() => onNavigate('roommates')}>
              <Users className="mr-2 h-5 w-5" /> Find Roommates
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('rentals')}>
              <HomeIcon className="mr-2 h-5 w-5" /> Browse Rentals
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('pg')}>
              <BedDouble className="mr-2 h-5 w-5" /> Browse Co-living / PG
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="text-center p-8 border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Properties Section */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Properties</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(listing => (
                <PropertyCard key={listing.id} listing={listing} onViewDetails={(item) => onViewDetails(item, 'listing')} />
            ))}
        </div>
      </div>

      {/* Featured Roommates Section */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Roommate Profiles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {featuredRoommates.map(profile => (
                <RoommateCard key={profile.id} profile={profile} onViewDetails={(item) => onViewDetails(item, 'roommate')} />
           ))}
        </div>
      </div>
    </div>
  );
}
