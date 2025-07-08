"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@/lib/types";
import { MapPin, IndianRupee, Home, Eye, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
}

export function PropertyCard({ listing, onViewDetails }: PropertyCardProps) {
  return (
    <div 
      className="bg-card rounded-xl shadow-md overflow-hidden border border-transparent hover:border-primary/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={() => onViewDetails(listing)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={listing['data-ai-hint'] as string | undefined}
        />
        <Badge variant="secondary" className="absolute top-3 right-3">
          {listing.propertyType === 'PG' ? <BedDouble className="w-3 h-3 mr-1.5" /> : <Home className="w-3 h-3 mr-1.5" />}
          {listing.propertyType}
        </Badge>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-card-foreground truncate group-hover:text-primary">{listing.title}</h3>
        
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{listing.locality}, {listing.city}</span>
        </div>
        
        <div className="flex items-center text-lg font-bold text-primary">
          <IndianRupee className="w-5 h-5 mr-1" />
          <span>{listing.rent.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ month</span></span>
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">{listing.furnishedStatus}</Badge>
          <Badge variant="outline">{listing.size}</Badge>
          {listing.amenities.slice(0, 1).map(amenity => (
            <Badge key={amenity} variant="outline">{amenity}</Badge>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
            <Button variant="default" size="sm" className="w-full">
                View Details
            </Button>
            <div className="flex items-center text-xs text-muted-foreground ml-4 shrink-0">
                <Eye className="w-3 h-3 mr-1" />
                {listing.views || 0}
            </div>
        </div>
      </div>
    </div>
  );
}
