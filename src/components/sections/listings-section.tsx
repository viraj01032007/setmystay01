"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Listing, RoommateProfile, ListingType, FilterState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PropertyCard } from "@/components/shared/property-card";
import { RoommateCard } from "@/components/shared/roommate-card";
import { Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ListingsSectionProps {
  type: ListingType;
  listings: (Listing | RoommateProfile)[];
  onViewDetails: (item: Listing | RoommateProfile, type: 'listing' | 'roommate') => void;
  onSmartSort: (type: ListingType, items: (Listing | RoommateProfile)[]) => void;
}

const initialFilters: FilterState = {
  budget: 50000,
  amenities: [],
  furnishedStatus: "any",
  propertyType: "any",
  city: "Navi Mumbai",
  locality: "any",
  roomType: "any",
  gender: "any",
  locationQuery: "",
  brokerStatus: "any",
};

const amenitiesList = ['AC', 'WiFi', 'Parking', 'Gym', 'Pool', 'Elevator', 'Security', 'Balcony', 'Power Backup', 'Meals', 'Laundry', 'Housekeeping', 'Garden'];
const cities = ["Navi Mumbai", "Mumbai", "Pune", "Delhi", "Bangalore"];
const localities: {[key: string]: string[]} = {
    "Navi Mumbai": ["Kharghar", "CBD Belapur", "Vashi", "Nerul"],
    "Mumbai": ["Andheri", "Bandra", "Dadar"],
    "Pune": ["Kothrud", "Hinjewadi", "Baner"],
    "Delhi": ["Saket", "Dwarka", "Rohini"],
    "Bangalore": ["Koramangala", "Whitefield", "Indiranagar"]
};

export function ListingsSection({ type, listings, onViewDetails, onSmartSort }: ListingsSectionProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      if ('propertyType' in item && item.propertyType !== 'Roommate') { // It's a Listing
        if (type === 'roommate') return false;
        const l = item as Listing;
        if (filters.budget < l.rent) return false;
        if (filters.furnishedStatus !== 'any' && filters.furnishedStatus !== l.furnishedStatus) return false;
        if (filters.brokerStatus !== 'any' && filters.brokerStatus !== l.brokerStatus) return false;
        if (filters.city !== 'any' && filters.city !== l.city) return false;
        if (filters.locality !== 'any' && filters.locality !== l.locality) return false;
        if (type === 'rental' && filters.propertyType !== 'any' && filters.propertyType !== l.size) return false;
        if (type === 'pg' && filters.roomType !== 'any' && filters.roomType !== l.size) return false;
        if (filters.amenities.length > 0 && !filters.amenities.every(a => l.amenities.includes(a))) return false;
      } else { // It's a RoommateProfile
        if (type !== 'roommate') return false;
        const r = item as RoommateProfile;
        if (filters.budget < r.rent) return false;
        if (filters.gender !== 'any' && filters.gender !== r.gender) return false;
        const fullLocation = `${r.locality}, ${r.city}`.toLowerCase();
        if (filters.locationQuery && !fullLocation.includes(filters.locationQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [listings, filters, type]);

  const pageConfig = {
    pg: { title: 'PG Accommodations', description: 'Comfortable and modern paying guest options.'},
    rental: { title: 'Premium Rentals', description: 'Find your next home from our verified rental properties.'},
    roommate: { title: 'Find Your Roommate', description: 'Connect with like-minded people to share a space.'}
  };
  
  const currentConfig = pageConfig[type];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{currentConfig.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{currentConfig.description}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/3 lg:w-1/4">
          <div className="sticky top-24">
             <ScrollArea className="h-[calc(100vh-7rem)] pr-4">
              <div className="p-1 bg-card rounded-xl shadow-sm space-y-6">
                <h3 className="text-xl font-semibold px-6 pt-6">Filters</h3>
                
                {/* Common Filter: Budget */}
                <div className="space-y-2 px-6">
                  <Label>Max Budget: ₹{filters.budget.toLocaleString()}</Label>
                  <Slider
                    min={5000} max={100000} step={1000}
                    value={[filters.budget]}
                    onValueChange={([val]) => handleFilterChange('budget', val)}
                  />
                </div>
                
                {/* Rental & PG Filters */}
                {(type === 'rental' || type === 'pg') && (
                  <div className="space-y-4 px-6 pb-6">
                    <Select value={filters.city} onValueChange={(val) => { handleFilterChange('city', val); handleFilterChange('locality', 'any'); }}>
                      <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                      <SelectContent>
                        {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                     <Select value={filters.locality} onValueChange={(val) => handleFilterChange('locality', val)}>
                      <SelectTrigger><SelectValue placeholder="Select Locality" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">All Localities</SelectItem>
                        {(localities[filters.city] || []).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>

                    {type === 'rental' && (
                      <Select value={filters.propertyType} onValueChange={(val) => handleFilterChange('propertyType', val)}>
                        <SelectTrigger><SelectValue placeholder="Property Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any BHK</SelectItem>
                          <SelectItem value="1 BHK">1 BHK</SelectItem>
                          <SelectItem value="2 BHK">2 BHK</SelectItem>
                          <SelectItem value="3 BHK">3 BHK</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {type === 'pg' && (
                      <Select value={filters.roomType} onValueChange={(val) => handleFilterChange('roomType', val)}>
                        <SelectTrigger><SelectValue placeholder="Room Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Type</SelectItem>
                          <SelectItem value="Single Room">Single Room</SelectItem>
                          <SelectItem value="Double Sharing">Double Sharing</SelectItem>
                          <SelectItem value="Triple Sharing">Triple Sharing</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    <div className="space-y-2">
                        <Label>Furnishing</Label>
                        <RadioGroup value={filters.furnishedStatus} onValueChange={(val) => handleFilterChange('furnishedStatus', val as 'any' | 'Furnished' | 'Semi-Furnished' | 'Unfurnished')} className="flex gap-2">
                            <Label className="flex-1 p-2 border rounded-md text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"><RadioGroupItem value="any" className="sr-only"/>Any</Label>
                            <Label className="flex-1 p-2 border rounded-md text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"><RadioGroupItem value="Furnished" className="sr-only"/>Furnished</Label>
                            <Label className="flex-1 p-2 border rounded-md text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"><RadioGroupItem value="Semi-Furnished" className="sr-only"/>Semi</Label>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Contact Type</Label>
                        <RadioGroup value={filters.brokerStatus} onValueChange={(val) => handleFilterChange('brokerStatus', val as 'any' | 'With Broker' | 'Without Broker')} className="flex gap-2">
                            <Label className="flex-1 p-2 border rounded-md text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"><RadioGroupItem value="any" className="sr-only"/>Any</Label>
                            <Label className="flex-1 p-2 border rounded-md text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"><RadioGroupItem value="With Broker" className="sr-only"/>Broker</Label>
                            <Label className="flex-1 p-2 border rounded-md text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"><RadioGroupItem value="Without Broker" className="sr-only"/>Owner</Label>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Amenities</Label>
                        <div className="grid grid-cols-2 gap-2">
                        {amenitiesList.map(a => (
                            <div key={a} className="flex items-center space-x-2">
                            <Checkbox id={`amenity-${a}`} onCheckedChange={(checked) => handleAmenityChange(a, !!checked)} />
                            <Label htmlFor={`amenity-${a}`} className="text-sm font-normal">{a}</Label>
                            </div>
                        ))}
                        </div>
                    </div>
                  </div>
                )}
                
                {/* Roommate Filters */}
                {type === 'roommate' && (
                  <div className="space-y-4 px-6 pb-6">
                     <Input 
                       placeholder="Search by location..."
                       value={filters.locationQuery}
                       onChange={(e) => handleFilterChange('locationQuery', e.target.value)}
                     />
                     <Select value={filters.gender} onValueChange={(val) => handleFilterChange('gender', val)}>
                        <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any Gender</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </aside>

        <main className="md:w-2/3 lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">{filteredListings.length} results found</p>
            <Button variant="outline" onClick={() => onSmartSort(type, filteredListings)}>
              <Wand2 className="w-4 h-4 mr-2" />
              AI Smart Sort
            </Button>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {type === 'roommate' 
              ? filteredListings.map(item => <RoommateCard key={item.id} profile={item as RoommateProfile} onViewDetails={(i) => onViewDetails(i, 'roommate')} />)
              : filteredListings.map(item => <PropertyCard key={item.id} listing={item as Listing} onViewDetails={(i) => onViewDetails(i, 'listing')} />)
            }
          </div>
          {filteredListings.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl">
                <h3 className="text-xl font-semibold">No results found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
