
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Star, Gem, Rocket, Crown, Building, User } from "lucide-react";
import type { UnlockPlan } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UnlockDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (plan: UnlockPlan) => void;
  onNavigateToListProperty: () => void;
}

const unlockPlans = [
  { plan: 1 as UnlockPlan, title: 'Single Unlock', price: 49, features: ['1 Listing Unlock', 'Complete Address', 'Direct Contact Details'], icon: <Rocket className="w-5 h-5"/> },
  { plan: 5 as UnlockPlan, title: 'Value Pack', price: 199, features: ['5 Listing Unlocks', 'Complete Address', 'Direct Contact Details', 'Best Value!'], icon: <Star className="w-5 h-5"/> },
  { plan: 10 as UnlockPlan, title: 'Pro Pack', price: 399, features: ['10 Listing Unlocks', 'Complete Address', 'Direct Contact Details', 'Great Deal!'], icon: <Gem className="w-5 h-5"/> },
  { plan: 'unlimited' as UnlockPlan, title: 'Ultimate Subscription', price: 999, features: ['Unlimited unlocks for 1 month', 'View all contact details', 'Chat with owners directly', 'Cancel anytime'], icon: <Crown className="w-5 h-5"/> },
];

const listingPlans = [
  { title: 'Roommate Listing', price: 149, features: ['30-day listing', 'Reach thousands of users'], icon: <User className="w-5 h-5" /> },
  { title: 'PG/Co-living Listing', price: 349, features: ['30-day listing', 'Featured for 7 days'], icon: <Building className="w-5 h-5" /> },
  { title: 'Rental Listing', price: 999, features: ['30-day listing', 'Premium support'], icon: <Crown className="w-5 h-5" /> },
];

export function UnlockDetailsModal({ isOpen, onClose, onPurchase, onNavigateToListProperty }: UnlockDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-3xl font-bold text-center">Our Pricing Plans</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Choose a plan that's right for you.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Unlock Plans */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-center text-primary">Unlock Contact Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unlockPlans.map(p => (
                            <Card key={p.title} className="flex flex-col border-primary/50">
                            <CardHeader className="items-center text-center">
                                <div className="p-3 bg-primary/10 rounded-full mb-2 text-primary">{p.icon}</div>
                                <CardTitle>{p.title}</CardTitle>
                                <CardDescription>
                                <span className="text-3xl font-bold text-foreground">₹{p.price}</span>
                                <span className="text-muted-foreground">/{typeof p.plan === 'number' ? `unlock${p.plan > 1 ? 's':''}`: 'month'}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                {p.features.map(feature => (
                                    <li key={feature} className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-1 shrink-0"/>
                                    <span>{feature}</span>
                                    </li>
                                ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => onPurchase(p.plan)}>
                                Choose Plan
                                </Button>
                            </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Listing Plans */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-center text-accent">List Your Property</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {listingPlans.map(p => (
                            <Card key={p.title} className="flex flex-col border-accent/50">
                            <CardHeader className="items-center text-center">
                                <div className="p-3 bg-accent/10 rounded-full mb-2 text-accent">{p.icon}</div>
                                <CardTitle>{p.title}</CardTitle>
                                <CardDescription>
                                    <span className="text-3xl font-bold text-foreground">₹{p.price}</span>
                                    <span className="text-muted-foreground">/listing</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                {p.features.map(feature => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-500 mt-1 shrink-0"/>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="secondary" onClick={onNavigateToListProperty}>
                                    List Your Property
                                </Button>
                            </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
