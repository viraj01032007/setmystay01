
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Gift, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Coupon } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizes: Coupon[];
  onWin: (coupon: Coupon) => void;
}

const colors = ["#FFC107", "#FF9800", "#FF5722", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50"];

export function SpinWheelModal({ isOpen, onClose, prizes, onWin }: SpinWheelModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Coupon | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
        const alreadySpun = sessionStorage.getItem('setmystay_has_spun_wheel');
        if (alreadySpun) {
            setHasSpun(true);
        }
    } else {
        // Reset on close if not spinning
        if(!isSpinning) {
            setWinner(null);
            setRotation(0);
        }
    }
  }, [isOpen, isSpinning]);

  const handleSpin = () => {
    if (isSpinning || hasSpun || prizes.length === 0) return;
    
    setIsSpinning(true);
    sessionStorage.setItem('setmystay_has_spun_wheel', 'true');

    const totalPrizes = prizes.length;
    const winningIndex = Math.floor(Math.random() * totalPrizes);
    const winningPrize = prizes[winningIndex];

    const degreesPerSegment = 360 / totalPrizes;
    const randomOffset = (Math.random() - 0.5) * degreesPerSegment * 0.8;
    const baseRotation = 360 * 5; // 5 full spins
    const winningRotation = 360 - (winningIndex * degreesPerSegment + randomOffset);
    
    const finalRotation = baseRotation + winningRotation;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winningPrize);
      onWin(winningPrize);
    }, 4000); // Duration of the spin animation
  };

  const copyToClipboard = () => {
    if (winner) {
      navigator.clipboard.writeText(winner.code);
      toast({ title: "Copied!", description: "Coupon code copied to clipboard." });
    }
  };

  const prizeSegments = prizes.length > 0 ? prizes : Array(6).fill({ code: 'Try Again', discountPercentage: 0 });
  const segmentAngle = 360 / prizeSegments.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Spin to Win!</DialogTitle>
          <DialogDescription className="text-center">
            {hasSpun 
                ? "You've already spun the wheel this session."
                : winner
                ? "Congratulations! Here's your prize."
                : "Spin the wheel to win an exclusive discount coupon. Good luck!"
            }
          </DialogDescription>
        </DialogHeader>

        {winner ? (
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <Gift className="w-20 h-20 text-yellow-500"/>
            <p className="text-lg">You won a</p>
            <p className="text-3xl font-bold text-primary">{winner.discountPercentage}% Discount!</p>
            <div className="flex items-center gap-2 mt-2 p-3 border-2 border-dashed rounded-lg bg-muted">
                <Ticket className="w-6 h-6 text-muted-foreground"/>
                <span className="text-xl font-bold tracking-widest">{winner.code}</span>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Copy className="w-5 h-5"/>
                </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center gap-6">
            <div className="relative w-72 h-72">
                <div 
                    className="absolute inset-0 rounded-full border-8 border-slate-300 transition-transform duration-[4000ms] ease-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {prizeSegments.map((prize, index) => (
                        <div
                            key={index}
                            className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
                            style={{
                                transform: `rotate(${index * segmentAngle}deg)`,
                                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`, // sector shape
                            }}
                        >
                            <div
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                    backgroundColor: colors[index % colors.length],
                                    transform: `rotate(${segmentAngle / 2}deg) translateY(-50%)`,
                                }}
                            >
                                <span className="text-white font-bold text-xs transform -rotate-90">
                                    {prize.discountPercentage}% OFF
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-[16px] border-t-slate-700 z-10"></div>
            </div>

            <Button size="lg" onClick={handleSpin} disabled={isSpinning || hasSpun}>
              {isSpinning ? "Spinning..." : hasSpun ? "Already Spun" : "Spin Now!"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
