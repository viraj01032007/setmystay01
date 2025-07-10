
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
    const [leverPulled, setLeverPulled] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            const alreadySpun = sessionStorage.getItem('setmystay_has_spun_slot');
            if (alreadySpun) {
                setHasSpun(true);
            }
        } else {
            // Reset on close if not spinning
            if (!isSpinning) {
                setWinner(null);
                setResultMessage(null);
            }
        }
    }, [isOpen, isSpinning]);

    const handleSpin = () => {
        if (isSpinning || hasSpun || prizes.length === 0) return;

        setIsSpinning(true);
        setWinner(null);
        setResultMessage(null);
        setLeverPulled(true);
        sessionStorage.setItem('setmystay_has_spun_slot', 'true');

        // Determine winner
        const winProbability = 0.3; // 30% chance to win
        const didWin = Math.random() < winProbability;
        
        let finalReels: number[];

        if (didWin) {
            const winningSymbolIndex = Math.floor(Math.random() * reelSymbols.length);
            finalReels = [winningSymbolIndex, winningSymbolIndex, winningSymbolIndex];
        } else {
            // Ensure no win by making sure at least two are different
            finalReels = [
                Math.floor(Math.random() * reelSymbols.length),
                Math.floor(Math.random() * reelSymbols.length),
                Math.floor(Math.random() * reelSymbols.length),
            ];
            while (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
                 finalReels[1] = (finalReels[1] + 1) % reelSymbols.length;
            }
        }

        // Animate reels one by one, faster now
        setTimeout(() => setReels(prev => [finalReels[0], prev[1], prev[2]]), 500);
        setTimeout(() => setReels(prev => [prev[0], finalReels[1], prev[2]]), 1000);
        setTimeout(() => {
            setReels(finalReels);
            setIsSpinning(false);
            if (didWin) {
                const prize = prizes[Math.floor(Math.random() * prizes.length)];
                setWinner(prize);
                onWin(prize);
            } else {
                setResultMessage("Better luck next time!");
            }
        }, 1500);
        
        // Reset lever animation
        setTimeout(() => setLeverPulled(false), 500);
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
                            : resultMessage
                            ? resultMessage
                            : "Pull the lever to win a discount coupon. Good luck!"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-8 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border-4 border-slate-600 w-full">
                            <div className="grid grid-cols-3 gap-4 bg-slate-100 rounded-lg p-4 overflow-hidden">
                                {reels.map((symbolIndex, i) => (
                                    <div key={i} className={cn("flex items-center justify-center transition-transform duration-500 ease-in-out", isSpinning ? 'animate-pulse' : '')}>
                                        <ReelIcon icon={reelSymbols[symbolIndex].icon} className={reelSymbols[symbolIndex].color} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Slot machine lever */}
                        <div 
                            className="flex-shrink-0 cursor-pointer group"
                            onClick={handleSpin}
                        >
                            <div className="w-4 h-24 bg-slate-400 rounded-t-full relative">
                                <div className={cn(
                                    "absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-600 border-4 border-slate-200 shadow-inner transform transition-transform duration-300 ease-out",
                                    leverPulled ? 'translate-y-20' : 'translate-y-0',
                                    (isSpinning || hasSpun) && 'group-hover:translate-y-0'
                                    )}
                                ></div>
                            </div>
                            <div className="w-10 h-8 bg-slate-700 rounded-b-lg -mt-1 mx-auto"></div>
                        </div>
                    </div>
                    
                    {winner ? (
                        <div className="text-center space-y-2 mt-4">
                             <p className="text-3xl font-bold text-primary animate-pulse">JACKPOT!</p>
                             <div className="flex items-center gap-2 mt-2 p-3 border-2 border-dashed rounded-lg bg-muted">
                                <Ticket className="w-6 h-6 text-muted-foreground"/>
                                <span className="text-xl font-bold tracking-widest">{winner.code} ({winner.discountPercentage}%)</span>
                                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                                    <Copy className="w-5 h-5"/>
                                </Button>
                            </div>
                        </div>
                    ) : resultMessage && !isSpinning ? (
                        <div className="text-center mt-4">
                            <p className="text-xl font-semibold text-muted-foreground">{resultMessage}</p>
                        </div>
                    ) : (
                         <Button size="lg" onClick={handleSpin} disabled={isSpinning || hasSpun} className="w-full mt-4">
                            {isSpinning ? "Spinning..." : hasSpun ? "Already Played" : "Pull Lever to Spin!"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
