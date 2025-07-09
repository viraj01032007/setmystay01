"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{title || 'Special Offer!'}</DialogTitle>
          {description && <DialogDescription className="text-center">{description}</DialogDescription>}
        </DialogHeader>
        {imageUrl && (
          <div className="relative w-full h-64 mt-4 rounded-lg overflow-hidden">
            <Image src={imageUrl} alt={title || 'Advertisement'} layout="fill" objectFit="cover" data-ai-hint="advertisement graphic"/>
          </div>
        )}
        <Button onClick={onClose} className="mt-4 w-full">Close</Button>
      </DialogContent>
    </Dialog>
  );
}
