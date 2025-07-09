
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
  
  // This component is no longer in use, reverted to a basic modal structure.
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
         <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 h-6 w-6 z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {imageUrl && <Image src={imageUrl} alt={title} width={400} height={200} className="rounded-md" />}
          <Button onClick={onClose} className="mt-4 w-full">Close</Button>
        </CardContent>
      </Card>
    </div>
  );
}
