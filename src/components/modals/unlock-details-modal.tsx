"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Star, Gem, Rocket, Crown } from "lucide-react";
import type { UnlockPlan } from "@/lib/types";

interface UnlockDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (plan: UnlockPlan) => void;
}

const plans = [
  { plan: 1 as UnlockPlan, title: 'Single Unlock', price: 49, features: ['1 Listing Unlock', 'Complete Address', 'Direct Contact Details'], icon: <Rocket className="w-5 h-5"/> },
  { plan: 5 as UnlockPlan, title: 'Value Pack', price: 199, features: ['5 Listing Unlocks', 'Complete Address', 'Direct Contact Details', 'Best Value!'], icon: <Star className="w-5 h-5"/> },
  { plan: 10 as UnlockPlan, title: 'Pro Pack', price: 399, features: ['10 Listing Unlocks', 'Complete Address', 'Direct Contact Details', 'Great Deal!'], icon: <Gem className="w-5 h-5"/> },
  { plan: 'unlimited' as UnlockPlan, title: 'Ultimate Subscription', price: 999, features: ['Unlimited unlocks for 1 month', 'View all contact details', 'Chat with owners directly', 'Cancel anytime'], icon: <Crown className="w-5 h-5"/> },
];

export function UnlockDetailsModal({ isOpen, onClose, onPurchase }: UnlockDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Unlock Full Access</DialogTitle>
          <DialogDescription className="text-center">
            Choose a plan to view complete address and contact details for all listings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
          {plans.map(p => (
            <Card key={p.title} className="flex flex-col">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2 text-primary">{p.icon}</div>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">₹{p.price}</span>
                  <span className="text-muted-foreground">/{typeof p.plan === 'number' ? `${p.plan} unlock${p.plan > 1 ? 's':''}`: 'month'}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {p.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500"/>
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
      </DialogContent>
    </Dialog>
  );
}
