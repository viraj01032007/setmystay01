
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Lock, LogIn } from 'lucide-react';
import { LoadingSpinner } from '@/components/icons';

// Hardcoded credentials for staff simulation
const STAFF_PASSWORD = 'Staff@123';
const STAFF_OTP = '123456';

export default function StaffLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // If staff is already logged in, redirect them to the dashboard
    if (localStorage.getItem('staff_authenticated') === 'true') {
      router.replace('/staff');
    }
  }, [router]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === STAFF_PASSWORD) {
      toast({ title: 'Step 1 Complete', description: 'Password correct. Please enter your OTP.' });
      setStep('otp');
    } else {
      toast({ title: 'Authentication Error', description: 'Incorrect password.', variant: 'destructive' });
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (otp === STAFF_OTP) {
      toast({ title: 'Authentication Successful!', description: 'Redirecting to staff dashboard...' });
      // In a real app, you'd get a session token from the server
      localStorage.setItem('staff_authenticated', 'true');
      router.push('/staff');
    } else {
      toast({ title: 'Authentication Error', description: 'Incorrect OTP.', variant: 'destructive' });
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <LoadingSpinner className="w-12 h-12 text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Staff Panel Access</CardTitle>
          <CardDescription>
            {step === 'password' && 'Enter your staff password.'}
            {step === 'otp' && 'Enter your OTP. (Hint: 123456)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Continue
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                        maxLength={6}
                        required
                        className="pl-10"
                    />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner className="w-4 h-4" /> : <LogIn className="w-4 h-4 mr-2" />}
                {isLoading ? 'Verifying...' : 'Login'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
