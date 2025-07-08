"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RoommateProfile } from "@/lib/types";
import { MapPin, IndianRupee, Eye, User, Briefcase } from "lucide-react";

interface RoommateCardProps {
  profile: RoommateProfile;
  onViewDetails: (profile: RoommateProfile) => void;
}

export function RoommateCard({ profile, onViewDetails }: RoommateCardProps) {
  return (
    <div 
      className="bg-card rounded-xl shadow-md overflow-hidden border border-transparent hover:border-primary/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={() => onViewDetails(profile)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={profile.images[0]}
          alt={profile.ownerName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={profile['data-ai-hint'] as string | undefined}
        />
        <Badge variant="secondary" className="absolute top-3 right-3">
          <User className="w-3 h-3 mr-1.5" />
          Roommate
        </Badge>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-card-foreground truncate group-hover:text-primary">{profile.ownerName}, {profile.age}</h3>
        
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          <span>Seeking in {profile.locality}, {profile.city}</span>
        </div>
        
        <div className="flex items-center text-lg font-bold text-primary">
          <IndianRupee className="w-5 h-5 mr-1" />
          <span>Budget: {profile.rent.toLocaleString()}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">{profile.gender}</Badge>
          {profile.preferences.slice(0, 2).map(pref => (
            <Badge key={pref} variant="outline">{pref}</Badge>
          ))}
        </div>

         <div className="flex justify-between items-center pt-2">
            <Button variant="default" size="sm" className="w-full">
                View Profile
            </Button>
            <div className="flex items-center text-xs text-muted-foreground ml-4 shrink-0">
                <Eye className="w-3 h-3 mr-1" />
                {profile.views || 0}
            </div>
        </div>
      </div>
    </div>
  );
}
