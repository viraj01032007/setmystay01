"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Mail, KeyRound, Lock, LogIn } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { toast } = useToast();

  const handleSendOtp = () => {
    if (mobileNumber.length === 10) {
      setIsOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: `An OTP has been sent to ${mobileNumber}. (Simulated)`,
      });
    } else {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Successful!",
      description: "Welcome back to SetMyStay! (Simulated)",
    });
    onClose();
  };
  
  const handleSocialLogin = (provider: string) => {
    toast({
      title: `Signing in with ${provider}...`,
      description: `You are being redirected to sign in. (Simulated)`,
    });
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to manage your listings and unlock details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-2">
             <Button variant="outline" onClick={() => handleSocialLogin('Google')}>
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 65.6l-63.3 62.3C326.5 99.4 290.1 84 248 84c-83.6 0-151.4 68.8-151.4 154s67.8 154 151.4 154c97.2 0 130.3-72.9 134.8-109.3H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                 Google
            </Button>
            <Button variant="outline" onClick={() => handleSocialLogin('Facebook')}>
               <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>
               Facebook
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          <form onSubmit={handleLogin}>
            <div className="grid gap-2">
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="mobile"
                  placeholder="10-digit mobile number"
                  className="pl-10"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  maxLength={10}
                />
              </div>
              {isOtpSent && (
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    className="pl-10"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              )}
               {!isOtpSent ? (
                <Button type="button" onClick={handleSendOtp} variant="secondary">
                  <Mail className="mr-2 h-4 w-4" /> Send OTP
                </Button>
              ) : (
                <Button type="submit">
                  <LogIn className="mr-2 h-4 w-4" /> Verify & Sign In
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
