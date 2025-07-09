
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  amount: number;
}

export function PaymentConfirmationModal({ isOpen, onClose, onConfirm, planName, amount }: PaymentConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Confirm Your Purchase</DialogTitle>
          <DialogDescription className="text-center">Please review your order before proceeding.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-semibold">{planName}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-bold flex items-center">
                <IndianRupee className="w-4 h-4 mr-1" />
                {amount}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={onConfirm} className="w-full sm:w-auto">Pay Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
