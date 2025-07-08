"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RateUsModalProps {
  isOpen: boolean;
  onClose: (rated: boolean) => void;
}

export function RateUsModal({ isOpen, onClose }: RateUsModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    // In a real app, you'd send this rating to your backend
    console.log('User rated:', rating);
    onClose(true);
  };
  
  const handleSkip = () => {
    onClose(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Enjoying SetMyStay?</DialogTitle>
          <DialogDescription className="text-center">
            Your feedback helps us improve. Please take a moment to rate your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-10 h-10 cursor-pointer transition-colors",
                (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              )}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
            <Button size="lg" onClick={handleSubmit} disabled={rating === 0}>Submit Rating</Button>
            <Button size="lg" variant="ghost" onClick={handleSkip}>Maybe Later</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
