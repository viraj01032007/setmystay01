
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Gift, Ticket, Cherry, Gem, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Coupon } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SlotMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizes: Coupon[];
  onWin: (coupon: Coupon) => void;
}

const ReelIcon = ({ icon: Icon, className }: { icon: React.ElementType, className?: string }) => (
    <Icon className={cn("w-16 h-16", className)} />
);

const reelSymbols = [
    { id: 'cherry', icon: (props: any) => <Cherry {...props} />, color: "text-red-500" },
    { id: 'star', icon: (props: any) => <Star {...props} />, color: "text-yellow-400" },
    { id: 'gem', icon: (props: any) => <Gem {...props} />, color: "text-blue-500" },
];

export function SlotMachineModal({ isOpen, onClose, prizes, onWin }: SlotMachineModalProps) {
    const [reels, setReels] = useState([0, 0, 0]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<Coupon | null>(null);
    const [hasSpun, setHasSpun] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            const alreadySpun = sessionStorage.getItem('setmystay_has_spun_slot');
            if (alreadySpun) {
                setHasSpun(true);
            }
        } else {
            if (!isSpinning) {
                setWinner(null);
            }
        }
    }, [isOpen, isSpinning]);

    const handleSpin = () => {
        if (isSpinning || hasSpun || prizes.length === 0) return;

        setIsSpinning(true);
        setWinner(null);
        sessionStorage.setItem('setmystay_has_spun_slot', 'true');

        // Determine winner
        const winProbability = 0.3; // 30% chance to win
        const didWin = Math.random() < winProbability;
        
        let finalReels: number[];

        if (didWin) {
            const winningSymbolIndex = Math.floor(Math.random() * reelSymbols.length);
            finalReels = [winningSymbolIndex, winningSymbolIndex, winningSymbolIndex];
        } else {
            // Ensure no win
            finalReels = [
                Math.floor(Math.random() * reelSymbols.length),
                (Math.floor(Math.random() * (reelSymbols.length -1)) + 1) % reelSymbols.length,
                (Math.floor(Math.random() * (reelSymbols.length -2)) + 2) % reelSymbols.length,
            ];
             // Shuffle to make it look random
            finalReels.sort(() => Math.random() - 0.5);
        }

        // Animate reels one by one
        setTimeout(() => setReels(prev => [finalReels[0], prev[1], prev[2]]), 500);
        setTimeout(() => setReels(prev => [prev[0], finalReels[1], prev[2]]), 1000);
        setTimeout(() => {
            setReels(finalReels);
            setIsSpinning(false);
            if (didWin) {
                const prize = prizes[Math.floor(Math.random() * prizes.length)];
                setWinner(prize);
                onWin(prize);
            }
        }, 1500);
    };

    const copyToClipboard = () => {
        if (winner) {
            navigator.clipboard.writeText(winner.code);
            toast({ title: "Copied!", description: "Coupon code copied to clipboard." });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">Slot Machine Fun!</DialogTitle>
                    <DialogDescription className="text-center">
                        {hasSpun 
                            ? "You've already played this session."
                            : winner
                            ? "Congratulations! You've won a prize!"
                            : "Spin the reels to win a discount coupon. Good luck!"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-8 flex flex-col items-center justify-center gap-6">
                    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border-4 border-slate-600 w-full">
                        <div className="grid grid-cols-3 gap-4 bg-slate-100 rounded-lg p-4 overflow-hidden">
                            {reels.map((symbolIndex, i) => (
                                <div key={i} className={cn("flex items-center justify-center transition-transform duration-500 ease-in-out", isSpinning ? 'animate-pulse' : '')}>
                                    <ReelIcon icon={reelSymbols[symbolIndex].icon} className={reelSymbols[symbolIndex].color} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {winner ? (
                        <div className="text-center space-y-2">
                             <p className="text-3xl font-bold text-primary">JACKPOT!</p>
                             <div className="flex items-center gap-2 mt-2 p-3 border-2 border-dashed rounded-lg bg-muted">
                                <Ticket className="w-6 h-6 text-muted-foreground"/>
                                <span className="text-xl font-bold tracking-widest">{winner.code} ({winner.discountPercentage}%)</span>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                                    <Copy className="w-5 h-5"/>
                                </Button>
                            </div>
                        </div>
                    ) : (
                         <Button size="lg" onClick={handleSpin} disabled={isSpinning || hasSpun} className="w-full">
                            {isSpinning ? "Spinning..." : hasSpun ? "Already Played" : "Spin Now!"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
