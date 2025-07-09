
"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Listing, RoommateProfile, Page, FilterState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home as HomeIcon, BedDouble, Search } from "lucide-react";
import { PropertyCard } from "@/components/shared/property-card";
import { RoommateCard } from "@/components/shared/roommate-card";
import Image from "next/image";
import { AutocompleteInput } from "@/components/shared/autocomplete-input";
import { indianStates } from "@/lib/states";
import { indianCitiesByState, allIndianCities } from "@/lib/cities";
import { indianAreas } from "@/lib/areas";

interface HomeSectionProps {
  featuredProperties: Listing[];
  featuredRoommates: RoommateProfile[];
  onViewDetails: (item: Listing | RoommateProfile, type: 'listing' | 'roommate') => void;
  onNavigate: (page: Page) => void;
  onSearch: (filters: { state: string; city: string; locality: string }) => void;
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

export function HomeSection({ featuredProperties, featuredRoommates, onViewDetails, onNavigate, onSearch }: HomeSectionProps) {
  const [stateQuery, setStateQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [areaQuery, setAreaQuery] = useState("");

  const [citySuggestions, setCitySuggestions] = useState<string[]>(allIndianCities);
  const [areaSuggestions, setAreaSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (stateQuery && indianCitiesByState[stateQuery]) {
      setCitySuggestions(indianCitiesByState[stateQuery]);
    } else {
      setCitySuggestions(allIndianCities);
    }
    setCityQuery("");
  }, [stateQuery]);

  useEffect(() => {
    if (cityQuery && indianAreas[cityQuery]) {
      setAreaSuggestions(indianAreas[cityQuery]);
    } else {
      setAreaSuggestions([]);
    }
    setAreaQuery("");
  }, [cityQuery]);
  
  const handleSearchClick = () => {
    onSearch({ state: stateQuery, city: cityQuery, locality: areaQuery });
  };

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
          data-ai-hint="modern architecture building"
        />
        <div className="absolute inset-0 bg-black/60 -z-10" />
        <div className="relative text-white max-w-4xl space-y-6 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Find Your Perfect Living Space
          </h1>
          <p className="text-lg sm:text-xl text-slate-200">
            Discover roommates, rental properties, and PG accommodations with transparent pricing.
          </p>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-2 bg-white rounded-full shadow-lg p-2">
              <div className="md:col-span-3 relative">
                <AutocompleteInput
                  placeholder="State"
                  value={stateQuery}
                  onChange={setStateQuery}
                  suggestions={indianStates}
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <div className="md:col-span-3 relative">
                 <AutocompleteInput
                  placeholder="City"
                  value={cityQuery}
                  onChange={setCityQuery}
                  suggestions={citySuggestions}
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <div className="md:col-span-2 relative">
                <AutocompleteInput
                  placeholder="Area"
                  value={areaQuery}
                  onChange={setAreaQuery}
                  suggestions={areaSuggestions}
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <Button size="lg" className="rounded-full w-full" onClick={handleSearchClick}>
                  <Search className="mr-2 h-5 w-5" /> Search
                </Button>
              </div>
            </div>
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
