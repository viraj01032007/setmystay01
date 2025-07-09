"use client";

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { X } from "lucide-react";

interface AdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imageUrl: string;
}

export function AdvertisementModal({ isOpen, onClose, title, description, imageUrl }: AdvertisementModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in-0 slide-in-from-bottom-10 duration-500">
      <Card className="w-full max-w-sm shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 h-6 w-6 z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <CardHeader className="p-0">
            {imageUrl && (
              <div className="relative h-32 w-full">
                <Image src={imageUrl} alt={title || 'Advertisement'} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint="promotion sale"/>
              </div>
            )}
        </CardHeader>
        <CardContent className="p-4 pt-2">
           <CardTitle className="text-lg mt-2">{title || 'Special Offer!'}</CardTitle>
           {description && <CardDescription className="mt-1">{description}</CardDescription>}
           <Button onClick={onClose} className="mt-4 w-full" size="sm">Claim Offer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
