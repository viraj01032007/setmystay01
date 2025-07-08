'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, ShieldQuestion, Lock, LogIn } from 'lucide-react';
import { LoadingSpinner } from '@/components/icons';

// Hardcoded credentials for simulation
const ADMIN_PASSWORD = 'Bluechip@123';
const ADMIN_OTP = '16082007';
const ADMIN_ANSWER = 'rohan kholi';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'password' | 'otp' | 'question'>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect them to the dashboard
    if (localStorage.getItem('admin_authenticated') === 'true') {
      router.replace('/admin');
    }
  }, [router]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      toast({ title: 'Step 1 Complete', description: 'Password correct. Please enter your OTP.' });
      setStep('otp');
    } else {
      toast({ title: 'Authentication Error', description: 'Incorrect password.', variant: 'destructive' });
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === ADMIN_OTP) {
      toast({ title: 'Step 2 Complete', description: 'OTP correct. Please answer the security question.' });
      setStep('question');
    } else {
      toast({ title: 'Authentication Error', description: 'Incorrect OTP.', variant: 'destructive' });
    }
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (answer.toLowerCase() === ADMIN_ANSWER) {
      toast({ title: 'Authentication Successful!', description: 'Redirecting to dashboard...' });
      // In a real app, you'd get a session token from the server
      localStorage.setItem('admin_authenticated', 'true');
      router.push('/admin');
    } else {
      toast({ title: 'Authentication Error', description: 'Incorrect answer.', variant: 'destructive' });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Panel Access</CardTitle>
          <CardDescription>
            {step === 'password' && 'Factor 1: Enter your password.'}
            {step === 'otp' && 'Factor 2: Enter your PIN. (Hint: 16082007)'}
            {step === 'question' && 'Factor 3: Answer your security question.'}
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
                <Label htmlFor="otp">PIN</Label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="8-digit code"
                        maxLength={8}
                        required
                        className="pl-10"
                    />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Verify PIN
              </Button>
            </form>
          )}

          {step === 'question' && (
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="answer">Security Question: Who are you?</Label>
                <div className="relative">
                    <ShieldQuestion className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="answer"
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Your answer (e.g., Rohan Kholi)"
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
