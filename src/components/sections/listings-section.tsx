
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { AutocompleteInput } from '@/components/shared/autocomplete-input';
import { indianStates } from '@/lib/states';
import { allIndianCities, indianCitiesByState } from '@/lib/cities';
import { indianAreas } from '@/lib/areas';
import { Heart } from 'lucide-react';

interface ListingsSectionProps {
  type: ListingType;
  listings: (Listing | RoommateProfile)[];
  onViewDetails: (item: Listing | RoommateProfile, type: 'listing' | 'roommate') => void;
  initialSearchFilters: Partial<FilterState> | null;
}

const initialFilters: FilterState = {
  budget: 100000,
  amenities: [],
  furnishedStatus: "any",
  propertyType: "any",
  state: "",
  city: "",
  locality: "",
  roomType: "any",
  gender: "any",
  brokerStatus: "any",
};

const amenitiesList = ['AC', 'WiFi', 'Parking', 'Gym', 'Pool', 'Elevator', 'Security', 'Balcony', 'Power Backup', 'Meals', 'Laundry', 'Housekeeping', 'Garden', 'Piped Gas'];
const roommatePreferencesList = ['Non-Smoker', 'Vegetarian', 'Non-Vegetarian', 'Clean', 'Drinker', 'Pet-Friendly'];
const allFeaturesList = [...new Set([...amenitiesList, ...roommatePreferencesList])];

export function ListingsSection({ 
  type, 
  listings, 
  onViewDetails, 
  initialSearchFilters,
}: ListingsSectionProps) {
  const [filters, setFilters] = useState<FilterState>({ ...initialFilters, ...initialSearchFilters });
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  
  useEffect(() => {
    if (initialSearchFilters) {
      setFilters(prev => ({ ...prev, ...initialSearchFilters }));
    }

    const pageConfig = {
      pg: { title: 'PG & Co-living Spaces', description: 'Explore the best PG and co-living spaces in your city. We offer a variety of options, from single private rooms to shared accommodations, complete with modern amenities for a hassle-free living experience. Filter by budget and location to find your perfect spot.' },
      rental: { title: 'Find Your Next Home', description: "Find your next home from our curated selection of rental properties. Whether you're looking for a cozy studio or a spacious family house, our verified listings provide all the details you need. Use the filters to narrow down by price, location, amenities, and more to find a space that feels like it was made for you." },
      roommate: { title: 'Find Your Ideal Roommate', description: "Discover your next great roommate with SetMyStay. Browse through detailed profiles to find people who match your lifestyle, budget, and living preferences. Our platform makes it easy to connect with compatible individuals to start your shared living adventure." }
    };
    
    const config = pageConfig[type] || { title: 'Our Listings', description: 'Browse our collection of properties and roommate profiles to find your perfect match.' };
    setPageTitle(config.title);
    setPageDescription(config.description);

  }, [initialSearchFilters, type]);

  
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      const newState = { ...prev, [key]: value };
      if (key === 'state') {
        newState.city = '';
        newState.locality = '';
      }
      if (key === 'city') {
        newState.locality = '';
      }
      return newState;
    });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const citySuggestions = filters.state ? indianCitiesByState[filters.state] || [] : allIndianCities;
  const areaSuggestions = filters.city ? indianAreas[filters.city] || [] : [];


  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Common filters
      if (item.rent > filters.budget) return false;
      if (filters.state && !item.state.toLowerCase().includes(filters.state.toLowerCase())) return false;
      if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.locality && !item.locality.toLowerCase().includes(filters.locality.toLowerCase())) return false;

      // Type-specific filters
      if (item.propertyType !== 'Roommate') { // Is a Listing
          const l = item as Listing;
          if (filters.furnishedStatus !== 'any' && filters.furnishedStatus !== l.furnishedStatus) return false;
          if (filters.brokerStatus !== 'any' && filters.brokerStatus !== l.brokerStatus) return false;
          if (l.propertyType === 'Rental' && filters.propertyType !== 'any' && filters.propertyType !== l.size) return false;
          if (l.propertyType === 'PG' && filters.roomType !== 'any' && filters.roomType !== l.size) return false;
          if (filters.amenities.length > 0 && !filters.amenities.every(a => l.amenities.includes(a))) return false;
      } else { // Is a RoommateProfile
          const r = item as RoommateProfile;
          if (filters.gender !== 'any' && filters.gender !== r.gender) return false;
          if (filters.amenities.length > 0 && !filters.amenities.every(a => r.preferences.includes(a))) return false;
      }

      return true;
    });
  }, [listings, filters]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{pageTitle}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">{pageDescription}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/3 lg:w-1/4">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                <div className="p-4 bg-card rounded-xl shadow-sm space-y-6">
                  <h3 className="text-xl font-semibold">Filters</h3>
                  
                  {/* Common Filter: Budget */}
                  <div className="space-y-2">
                    <Label>Max Budget: ₹{filters.budget.toLocaleString()}</Label>
                    <Slider
                      min={5000} max={100000} step={1000}
                      value={[filters.budget]}
                      onValueChange={([val]) => handleFilterChange('budget', val)}
                    />
                  </div>
                  
                  {/* Common Geographic Filters */}
                  <div className="space-y-4">
                      <AutocompleteInput 
                        placeholder="Enter State"
                        value={filters.state}
                        onChange={(val) => handleFilterChange('state', val)}
                        suggestions={indianStates}
                      />
                      <AutocompleteInput 
                        placeholder="Enter City"
                        value={filters.city}
                        onChange={(val) => handleFilterChange('city', val)}
                        suggestions={citySuggestions}
                      />
                      <AutocompleteInput
                        placeholder="Enter Area / Locality"
                        value={filters.locality}
                        onChange={(val) => handleFilterChange('locality', val)}
                        suggestions={areaSuggestions}
                      />
                  </div>

                  <div className="space-y-4">
                    {type === 'rental' && (
                      <Select value={filters.propertyType} onValueChange={(val) => handleFilterChange('propertyType', val)}>
                        <SelectTrigger><SelectValue placeholder="Property Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any BHK</SelectItem>
                          <SelectItem value="1 BHK">1 BHK</SelectItem>
                          <SelectItem value="2 BHK">2 BHK</SelectItem>
                          <SelectItem value="3 BHK">3 BHK</SelectItem>
                            <SelectItem value="4 BHK">4 BHK</SelectItem>
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
                            <Label className="flex-1 p-2 border rounded-md text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"><RadioGroupItem value="Furnished" className="sr-only"/>Full</Label>
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
                     <Select value={filters.gender} onValueChange={(val) => handleFilterChange('gender', val)}>
                        <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any Gender</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="space-y-2">
                        <Label>Features &amp; Preferences</Label>
                        <div className="grid grid-cols-2 gap-2">
                        {allFeaturesList.map(a => (
                            <div key={a} className="flex items-center space-x-2">
                            <Checkbox id={`amenity-${a}`} checked={filters.amenities.includes(a)} onCheckedChange={(checked) => handleAmenityChange(a, !!checked)} />
                            <Label htmlFor={`amenity-${a}`} className="text-sm font-normal">{a}</Label>
                            </div>
                        ))}
                        </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </aside>

        <main className={'md:w-2/3 lg:w-3/4'}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">{filteredListings.length} results found</p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map(item => {
              const itemType = item.propertyType === 'Roommate' ? 'roommate' : 'listing';
              return itemType === 'roommate' 
                ? <RoommateCard key={item.id} profile={item as RoommateProfile} onViewDetails={(i) => onViewDetails(i, 'roommate')} />
                : <PropertyCard key={item.id} listing={item as Listing} onViewDetails={(i) => onViewDetails(i, 'listing')} />
            })}
          </div>
          {filteredListings.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold mt-4">No results found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
