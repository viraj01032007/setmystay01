

// @ts-nocheck
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, Building, Users, LockOpen, Home, X as XIcon, HelpCircle, CheckCircle, Trash2, ChevronLeft, ChevronRight, LogOut, XCircle, PlusCircle, Edit, ImageIcon, Ticket, Settings, KeyRound, ShieldQuestion, Mail, Phone, MapPin, FileCheck, Search, Filter, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/icons';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Advertisement, Coupon } from '@/lib/types';
import { dummyCoupons } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfWeek, addDays, getWeek } from 'date-fns';
import { cn } from '@/lib/utils';


// Mock data similar to the provided script
const initialProperties = [
    { id: 'P001', type: 'rental', title: 'Spacious 2BHK Apartment', locality: 'Andheri West', rent: 35000, status: 'pending', description: 'A beautiful and spacious 2BHK apartment...', media: ['https://placehold.co/600x400', 'https://placehold.co/600x400'], aadhaarCardUrl: 'https://placehold.co/600x800', electricityBillUrl: 'https://placehold.co/600x800', nocUrl: 'https://placehold.co/600x800', 'data-ai-hint': 'apartment interior' },
    { id: 'P002', type: 'pg', title: 'Cozy PG near College', locality: 'Dadar East', rent: 8000, status: 'approved', description: 'Comfortable PG accommodation for students...', media: ['https://placehold.co/600x400'], aadhaarCardUrl: 'https://placehold.co/600x800', electricityBillUrl: 'https://placehold.co/600x800', 'data-ai-hint': 'student room' },
    { id: 'P003', type: 'rental', title: '1BHK for Bachelors', locality: 'Ghatkopar', rent: 18000, status: 'rejected', description: 'Compact 1BHK suitable for single working professionals.', media: [], aadhaarCardUrl: 'https://placehold.co/600x800', electricityBillUrl: 'https://placehold.co/600x800', 'data-ai-hint': 'small apartment' },
    { id: 'P004', type: 'pg', title: 'Luxury PG with all amenities', locality: 'Bandra', rent: 15000, status: 'pending', description: 'High-end PG with AC, food, and laundry.', media: ['https://placehold.co/600x400', 'https://placehold.co/600x400', 'https://placehold.co/600x400'], aadhaarCardUrl: 'https://placehold.co/600x800', electricityBillUrl: 'https://placehold.co/600x800', nocUrl: 'https://placehold.co/600x800', 'data-ai-hint': 'luxury room' }
];
const initialRoommates = [
    { id: 'R001', name: 'Alok Sharma', profession: 'Software Engineer', gender: 'Male', locality: 'Powai', budget: 10000, status: 'pending', description: 'Looking for a male roommate in a 2BHK.', media: ['https://placehold.co/400x400'], aadhaarCardUrl: 'https://placehold.co/600x800', electricityBillUrl: 'https://placehold.co/600x800', 'data-ai-hint': 'male portrait' },
    { id: 'R002', name: 'Priya Singh', profession: 'Student', gender: 'Female', locality: 'Andheri', budget: 7000, status: 'approved', description: 'Seeking a female roommate for a shared apartment.', media: [], 'data-ai-hint': 'female portrait' }
];
const initialAdvertisements: Advertisement[] = [
    { id: 'ad001', title: 'Grand Opening Offer!', description: 'Get 50% off on all listing plans for a limited time. Use code: GRAND50', imageUrl: 'https://placehold.co/600x400', isActive: true, 'data-ai-hint': 'sale promotion' },
    { id: 'ad002', title: 'Unlock Unlimited Connections', description: 'Subscribe to our unlimited plan and find your perfect roommate today.', imageUrl: 'https://placehold.co/600x400', isActive: false, 'data-ai-hint': 'people connecting' }
];

const initialPricing = {
    unlocks: {
        1: 49,
        5: 199,
        10: 399,
        unlimited: 999
    },
    listings: {
        roommate: 149,
        pg: 349,
        rental: 999
    }
}

// Chart data generation functions
const generateHourlyData = (date: Date) => {
    return Array.from({ length: 24 }, (_, i) => ({
        name: `${i.toString().padStart(2, '0')}:00`,
        views: Math.floor(Math.random() * 50) + (i > 8 && i < 22 ? 20 : 5),
    }));
};
const generateDailyData = (date: Date) => {
    const start = startOfWeek(date);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, i) => ({
        name: `${day} (${format(addDays(start, i), 'd')})`,
        views: Math.floor(Math.random() * 200) + 100,
    }));
};
const generateWeeklyData = (year: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let weeklyData = [];
    months.forEach((month) => {
        for (let week = 1; week <= 4; week++) {
            weeklyData.push({
                name: `W${week} (${month})`,
                views: Math.floor(Math.random() * 500) + 800,
            });
        }
    });
    return weeklyData.slice(0, 52); // Cap at 52 weeks
};
const generateMonthlyData = (year: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
        name: month,
        views: Math.floor(Math.random() * 4000) + 1000 + (year - 2022) * 500
    }));
};
const generateYearlyData = () => {
    const years = [2022, 2023, 2024];
    return years.map(year => ({
        name: year.toString(),
        views: Math.floor(Math.random() * 30000) + 20000 + (year-2022)*15000
    }));
};

const ADMIN_PASSWORD = 'Bluechip@123';
const ADMIN_OTP = '16082007';
const ADMIN_ANSWER = 'rohan kholi';
const ADMIN_EMAIL = 'setmystay02@gmail.com';
const ADMIN_PHONE = '+918210552902';
const ADMIN_ADDRESS = 'Office no. 01, Neelsidhi Splendour, Sector 15, CBD Belapur, Navi Mumbai, Maharashtra 400614';


const PasswordChangeForm = ({ currentPassword, onClose }) => {
    const { toast } = useToast();
    const [passwords, setPasswords] = useState({
        current: '',
        newPass: '',
        confirmPass: ''
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.current !== currentPassword) {
            toast({ title: 'Error', description: 'Current password is not correct.', variant: 'destructive' });
            return;
        }
        if (passwords.newPass !== passwords.confirmPass) {
            toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
            return;
        }
        if (passwords.newPass.length < 6) {
             toast({ title: 'Error', description: 'New password must be at least 6 characters.', variant: 'destructive' });
            return;
        }
        toast({ title: 'Success!', description: 'Your password has been changed.' });
        setPasswords({ current: '', newPass: '', confirmPass: '' });
        onClose();
    };

    return (
        <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" name="current" type="password" value={passwords.current} onChange={handlePasswordChange} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" name="newPass" type="password" value={passwords.newPass} onChange={handlePasswordChange} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" name="confirmPass" type="password" value={passwords.confirmPass} onChange={handlePasswordChange} required />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Update Password</Button>
            </DialogFooter>
        </form>
    );
};

const PinChangeForm = ({ currentPin, onClose }) => {
    const { toast } = useToast();
    const [pins, setPins] = useState({
        current: '',
        newPin: '',
    });

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPins(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPinChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (pins.current !== currentPin) {
            toast({ title: 'Error', description: 'Current PIN is not correct.', variant: 'destructive' });
            return;
        }
        if (pins.newPin.length !== 8) {
             toast({ title: 'Error', description: 'New PIN must be 8 digits.', variant: 'destructive' });
            return;
        }
        toast({ title: 'Success!', description: 'Your PIN has been changed.' });
        setPins({ current: '', newPin: '' });
        onClose();
    };

    return (
        <form onSubmit={handleSubmitPinChange} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current-pin">Current PIN</Label>
                <Input id="current-pin" name="current" type="password" value={pins.current} onChange={handlePinChange} required maxLength={8} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="new-pin">New PIN</Label>
                <Input id="new-pin" name="newPin" type="password" value={pins.newPin} onChange={handlePinChange} required maxLength={8} />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Update PIN</Button>
            </DialogFooter>
        </form>
    );
};

const SecurityQuestionChangeForm = ({ currentAnswer, onClose }) => {
    const { toast } = useToast();
    const [security, setSecurity] = useState({
        current: '',
        newQuestion: '',
        newAnswer: ''
    });

    const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSecurity(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitSecurityChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (security.current.toLowerCase() !== currentAnswer) {
            toast({ title: 'Error', description: 'Your current security answer is not correct.', variant: 'destructive' });
            return;
        }
        if (!security.newQuestion || !security.newAnswer) {
             toast({ title: 'Error', description: 'New question and answer cannot be empty.', variant: 'destructive' });
            return;
        }
        toast({ title: 'Success!', description: 'Your security question and answer have been updated.' });
        setSecurity({ current: '', newQuestion: '', newAnswer: '' });
        onClose();
    };

    return (
        <form onSubmit={handleSubmitSecurityChange} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current-answer">Current Security Answer (Who are you?)</Label>
                <Input id="current-answer" name="current" type="text" value={security.current} onChange={handleSecurityChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="new-question">New Security Question</Label>
                <Input id="new-question" name="newQuestion" type="text" value={security.newQuestion} onChange={handleSecurityChange} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="new-answer">New Security Answer</Label>
                <Input id="new-answer" name="newAnswer" type="text" value={security.newAnswer} onChange={handleSecurityChange} required />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Update Security Question</Button>
            </DialogFooter>
        </form>
    );
};

const ContactInfoChangeForm = ({ currentEmail, currentPhone, currentAddress, onClose }) => {
    const { toast } = useToast();
    const [info, setInfo] = useState({
        email: currentEmail,
        phone: currentPhone,
        address: currentAddress
    });

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!info.email || !info.phone || !info.address) {
            toast({ title: 'Error', description: 'All fields are required.', variant: 'destructive' });
            return;
        }
        toast({ title: 'Success!', description: 'Your contact information has been updated.' });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" value={info.email} onChange={handleInfoChange} required className="pl-10"/>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" name="phone" type="tel" value={info.phone} onChange={handleInfoChange} required className="pl-10"/>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="address">Office Address</Label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="address" name="address" value={info.address} onChange={handleInfoChange} required className="pl-10"/>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Update Information</Button>
            </DialogFooter>
        </form>
    );
};

const AdFormDialog = ({ isOpen, onClose, onSave, ad }) => {
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (ad) {
            setTitle(ad.title);
            setDescription(ad.description);
            setImagePreview(ad.imageUrl);
            setImageFile(null);
            setIsActive(ad.isActive);
        } else {
            setTitle('');
            setDescription('');
            setImageFile(null);
            setImagePreview(null);
            setIsActive(false);
        }
    }, [ad, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!imagePreview) {
            toast({
                title: "Image required",
                description: "Please upload an image for the advertisement.",
                variant: "destructive",
            });
            return;
        }
        onSave({ title, description, imageUrl: imagePreview, isActive });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ad ? 'Edit' : 'Add'} Advertisement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="ad-title">Title</Label>
                        <Input id="ad-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="ad-description">Description</Label>
                        <Textarea id="ad-description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="ad-image-upload">Image</Label>
                        <div 
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary"
                            onClick={() => document.getElementById('ad-image-upload')?.click()}
                        >
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" width={200} height={100} className="mx-auto h-24 object-contain rounded-md" />
                                ) : (
                                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                )}
                                <div className="flex text-sm text-muted-foreground justify-center">
                                    <p className="pl-1">{imageFile ? 'Click to change' : 'Click to upload'}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </div>
                        <Input 
                            id="ad-image-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="ad-is-active" checked={isActive} onCheckedChange={setIsActive} />
                        <Label htmlFor="ad-is-active">Set as active Pop-up</Label>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


const CouponFormDialog = ({ isOpen, onClose, onSave, coupon }) => {
    const [code, setCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (coupon) {
            setCode(coupon.code);
            setDiscountPercentage(coupon.discountPercentage);
            setIsActive(coupon.isActive);
        } else {
            setCode('');
            setDiscountPercentage(0);
            setIsActive(true);
        }
    }, [coupon, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ code: code.toUpperCase(), discountPercentage, isActive });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{coupon ? 'Edit' : 'Add'} Coupon</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="coupon-code">Coupon Code</Label>
                        <Input id="coupon-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
                    </div>
                    <div>
                        <Label htmlFor="coupon-discount">Discount Percentage (%)</Label>
                        <Input id="coupon-discount" type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(parseInt(e.target.value, 10))} required />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="coupon-is-active" checked={isActive} onCheckedChange={setIsActive} />
                        <Label htmlFor="coupon-is-active">Active</Label>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Coupon</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default function AdminDashboard() {
    const router = useRouter();
    const { toast } = useToast();
    
    // State management
    const [properties, setProperties] = useState([]);
    const [roommates, setRoommates] = useState([]);
    const [pricing, setPricing] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const [isAdFormModalOpen, setAdFormModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

    const [isCouponFormModalOpen, setCouponFormModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    const [isMounted, setIsMounted] = useState(false);
    
    const [activeSettingsDialog, setActiveSettingsDialog] = useState<null | 'password' | 'pin' | 'security' | 'contact'>(null);
    
    const [propertySearchTerm, setPropertySearchTerm] = useState('');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');

    const [chartView, setChartView] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const chartData = useMemo(() => {
        switch (chartView) {
            case 'hourly':
                return generateHourlyData(selectedDate);
            case 'daily':
                return generateDailyData(selectedDate);
            case 'weekly':
                return generateWeeklyData(selectedYear);
            case 'yearly':
                return generateYearlyData();
            case 'monthly':
            default:
                return generateMonthlyData(selectedYear);
        }
    }, [chartView, selectedYear, selectedDate]);
    
    const years = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

    useEffect(() => {
        const authStatus = localStorage.getItem('admin_authenticated');
        if (authStatus !== 'true') {
            router.replace('/admin/login');
        } else {
            setIsMounted(true);
            setProperties(initialProperties);
            setRoommates(initialRoommates);
            setPricing(initialPricing);
            setAdvertisements(initialAdvertisements);
            setCoupons(dummyCoupons);
            setAnalytics({
                totalPageViews: (Math.floor(Math.random() * 5000) + 1000),
                totalUnlocks: (Math.floor(Math.random() * 500) + 50),
                lastUpdated: new Date().toLocaleString()
            });
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('admin_authenticated');
        router.replace('/admin/login');
    };

    const pendingListings = useMemo(() => {
        if (!properties.length && !roommates.length) return [];
        return [
            ...properties.filter(p => p.status === 'pending').map(p => ({ ...p, itemType: p.type })),
            ...roommates.filter(r => r.status === 'pending').map(r => ({ ...r, itemType: 'roommate' }))
        ];
    }, [properties, roommates]);

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const matchesSearch = propertySearchTerm === '' || p.title.toLowerCase().includes(propertySearchTerm.toLowerCase());
            const matchesType = propertyTypeFilter === 'all' || p.type === propertyTypeFilter;
            return matchesSearch && matchesType;
        });
    }, [properties, propertySearchTerm, propertyTypeFilter]);
    
    const handleViewDetails = (id, type) => {
        const item = type === 'roommate'
            ? roommates.find(r => r.id === id)
            : properties.find(p => p.id === id);
        
        if (item) {
            setCurrentItem({ ...item, type });
            setCurrentMediaIndex(0);
            setDetailsModalOpen(true);
        }
    };
    
    const handleUpdateStatus = (id, type, status) => {
        if (type === 'roommate') {
            setRoommates(rms => rms.map(r => r.id === id ? { ...r, status } : r));
        } else {
            setProperties(props => props.map(p => p.id === id ? { ...p, status } : p));
        }
        setDetailsModalOpen(false);
        toast({ title: "Status Updated", description: `Item ${id} has been ${status}.` });
    };

    const handleDeleteItem = (id, type) => {
        if (type === 'roommate') {
            setRoommates(rms => rms.filter(r => r.id !== id));
        } else {
            setProperties(props => props.filter(p => p.id !== id));
        }
        setDetailsModalOpen(false);
        toast({ title: "Item Deleted", description: `Item ${id} has been removed.`, variant: 'destructive' });
    };

    const handlePriceChange = (category, plan, value) => {
        if (!pricing) return;
        setPricing(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [plan]: value
            }
        }));
    };

    const handleSavePricing = () => {
        console.log("Saving new prices:", pricing);
        toast({ title: "Pricing Updated", description: "The new prices have been saved." });
    }

    const handleOpenAdForm = (ad: Advertisement | null) => {
        setEditingAd(ad);
        setAdFormModalOpen(true);
    };

    const handleSaveAd = (adData) => {
        if (editingAd) {
            setAdvertisements(ads => ads.map(ad => ad.id === editingAd.id ? { ...editingAd, ...adData } : ad));
            toast({ title: "Advertisement Updated" });
        } else {
            const newAd: Advertisement = { id: `ad_${Date.now()}`, ...adData };
            setAdvertisements(ads => [newAd, ...ads]);
            toast({ title: "Advertisement Added" });
        }
        setAdFormModalOpen(false);
        setEditingAd(null);
    };

    const handleDeleteAd = (adId: string) => {
        setAdvertisements(ads => ads.filter(ad => ad.id !== adId));
        toast({ title: "Advertisement Deleted", variant: 'destructive' });
    };
    
    const handleOpenCouponForm = (coupon: Coupon | null) => {
        setEditingCoupon(coupon);
        setCouponFormModalOpen(true);
    };

    const handleSaveCoupon = (couponData: Omit<Coupon, 'id'>) => {
        if (editingCoupon) {
            setCoupons(cs => cs.map(c => c.id === editingCoupon.id ? { ...editingCoupon, ...couponData } : c));
            toast({ title: "Coupon Updated" });
        } else {
            const newCoupon: Coupon = { id: `coupon_${Date.now()}`, ...couponData };
            setCoupons(cs => [newCoupon, ...cs]);
            toast({ title: "Coupon Added" });
        }
        setCouponFormModalOpen(false);
        setEditingCoupon(null);
    };
    
    const handleDeleteCoupon = (couponId: string) => {
        setCoupons(cs => cs.filter(c => c.id !== couponId));
        toast({ title: "Coupon Deleted", variant: 'destructive' });
    };

    const StatusBadge = ({ status }) => {
        const isBoolean = typeof status === 'boolean';
        const currentStatus = isBoolean ? (status ? 'active' : 'inactive') : status;
    
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold capitalize";
        const statusClasses = {
            pending: "bg-yellow-200 text-yellow-800",
            approved: "bg-green-200 text-green-800",
            rejected: "bg-red-200 text-red-800",
            active: "bg-blue-200 text-blue-800",
            inactive: "bg-slate-200 text-slate-800",
        };
        return <span className={`${baseClasses} ${statusClasses[currentStatus]}`}>{currentStatus}</span>;
    };
    
    if (!isMounted || !analytics || !pricing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <LoadingSpinner className="w-12 h-12 text-primary" />
            </div>
        );
    }
    
    return (
        <div className="bg-slate-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 h-auto sm:h-20 py-4 sm:py-0">
                     <h1 className="text-2xl font-bold text-slate-800">StayFinder Admin</h1>
                     <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" />
                                Go to Main Site
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => setActiveSettingsDialog('password')}>Change Password</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setActiveSettingsDialog('pin')}>Change PIN</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setActiveSettingsDialog('security')}>Change Security Question</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setActiveSettingsDialog('contact')}>Change Contact Info</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                     </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Analytics Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">Analytics Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                                <div><p className="text-sm font-medium text-blue-700">Total Page Views</p><p className="text-2xl font-bold text-blue-900">{analytics.totalPageViews.toLocaleString()}</p></div>
                                <Eye className="text-3xl text-blue-400 w-8 h-8"/>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                                <div><p className="text-sm font-medium text-green-700">Total Properties</p><p className="text-2xl font-bold text-green-900">{properties.length}</p></div>
                                <Building className="text-3xl text-green-400 w-8 h-8"/>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg flex items-center justify-between">
                                <div><p className="text-sm font-medium text-purple-700">Total Roommates</p><p className="text-2xl font-bold text-purple-900">{roommates.length}</p></div>
                                <Users className="text-3xl text-purple-400 w-8 h-8"/>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg flex items-center justify-between">
                                <div><p className="text-sm font-medium text-yellow-700">Total Unlocks</p><p className="text-2xl font-bold text-yellow-900">{analytics.totalUnlocks.toLocaleString()}</p></div>
                                <LockOpen className="text-3xl text-yellow-400 w-8 h-8"/>
                            </div>
                        </div>
                        <div className="mt-6">
                             <Tabs value={chartView} onValueChange={setChartView} className="w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-slate-800">Property Views</h3>
                                    <div className="flex items-center gap-4">
                                        {(chartView === 'daily' || chartView === 'hourly') && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("w-[240px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                        {(chartView === 'monthly' || chartView === 'weekly') && (
                                            <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="Select year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )}
                                        <TabsList>
                                            <TabsTrigger value="hourly">Hourly</TabsTrigger>
                                            <TabsTrigger value="daily">Daily</TabsTrigger>
                                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                            <TabsTrigger value="yearly">Yearly</TabsTrigger>
                                        </TabsList>
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="views" fill="#4582EF" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Tabs>
                        </div>
                        <p className="text-sm text-slate-500 mt-4 text-right">Last Updated: {analytics.lastUpdated}</p>
                    </CardContent>
                </Card>
                
                 {/* Pricing Management */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">Pricing Management</CardTitle>
                        <CardDescription>Update the pricing for unlocks and listings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold mb-4 text-lg">Unlock Plans</h4>
                                <div className="space-y-4">
                                    {Object.entries(pricing.unlocks).map(([plan, price]) => (
                                        <div key={plan} className="flex items-center gap-4">
                                            <strong className="w-28 capitalize">{plan} Unlock{plan !== '1' && plan !== 'unlimited' ? 's' : ''}</strong>
                                            <Input id={`price-unlock-${plan}`} type="number" value={price} onChange={(e) => handlePriceChange('unlocks', plan, parseInt(e.target.value))} className="max-w-xs" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-4 text-lg">Listing Plans</h4>
                                <div className="space-y-4">
                                     {Object.entries(pricing.listings).map(([plan, price]) => (
                                        <div key={plan} className="flex items-center gap-4">
                                            <strong className="w-28 capitalize">{plan} Listing</strong>
                                            <Input id={`price-listing-${plan}`} type="number" value={price} onChange={(e) => handlePriceChange('listings', plan, parseInt(e.target.value))} className="max-w-xs" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSavePricing}>Save Prices</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Coupon Management */}
                <Card className="mb-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Coupon Code Management</CardTitle>
                            <CardDescription>Create and manage discount coupons.</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenCouponForm(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Coupon
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons.map(coupon => (
                                    <TableRow key={coupon.id}>
                                        <TableCell className="font-medium">{coupon.code}</TableCell>
                                        <TableCell>{coupon.discountPercentage}%</TableCell>
                                        <TableCell><StatusBadge status={coupon.isActive} /></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenCouponForm(coupon)}><Edit className="h-4 w-4" /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Delete Coupon?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the coupon.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteCoupon(coupon.id)}>Confirm</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Advertisement Management */}
                <Card className="mb-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Pop-up Advertisement Management</CardTitle>
                            <CardDescription>Manage the pop-up shown to users.</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenAdForm(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {advertisements.map(ad => (
                                    <TableRow key={ad.id}>
                                        <TableCell className="font-medium">{ad.title}</TableCell>
                                        <TableCell><StatusBadge status={ad.isActive} /></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenAdForm(ad)}><Edit className="h-4 w-4" /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Delete Advertisement?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. Are you sure you want to delete this ad?</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteAd(ad.id)}>Confirm</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pending Listings Section */}
                <Card className="mb-8">
                    <CardHeader><CardTitle className="text-2xl">Pending Listings</CardTitle></CardHeader>
                    <CardContent>
                        {pendingListings.length > 0 ? (
                            pendingListings.map(item => (
                                <div key={item.id} className="border-l-4 border-yellow-400 bg-slate-50 p-4 rounded-md mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div className="w-full">
                                        <p className="font-semibold">{item.title || item.name} <span className="text-xs font-medium text-slate-500">({item.itemType})</span></p>
                                        <p className="text-sm text-slate-600">{item.locality}</p>
                                    </div>
                                    <Button onClick={() => handleViewDetails(item.id, item.itemType)} className="w-full sm:w-auto">View Details</Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500">No pending listings.</p>
                        )}
                    </CardContent>
                </Card>

                {/* All Listings Table */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <CardTitle className="text-2xl">All Properties</CardTitle>
                                    <CardDescription>Search and filter all properties.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                     <div className="relative w-full sm:w-auto">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Search by title..." 
                                            value={propertySearchTerm}
                                            onChange={(e) => setPropertySearchTerm(e.target.value)}
                                            className="pl-10 w-full sm:w-48"
                                        />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onSelect={() => setPropertyTypeFilter('all')}>All</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setPropertyTypeFilter('pg')}>PG</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setPropertyTypeFilter('rental')}>Rental</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Rent</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProperties.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{p.title}</TableCell>
                                            <TableCell>{p.type}</TableCell>
                                            <TableCell>₹{p.rent.toLocaleString()}</TableCell>
                                            <TableCell><StatusBadge status={p.status} /></TableCell>
                                            <TableCell><Button variant="outline" size="sm" onClick={() => handleViewDetails(p.id, p.type)}>View</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-2xl">All Roommates</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead><TableHead>Budget</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roommates.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium">{r.name}</TableCell>
                                            <TableCell>₹{r.budget.toLocaleString()}</TableCell>
                                            <TableCell><StatusBadge status={r.status} /></TableCell>
                                            <TableCell><Button variant="outline" size="sm" onClick={() => handleViewDetails(r.id, 'roommate')}>View</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Ad Form Modal */}
            <AdFormDialog
                isOpen={isAdFormModalOpen}
                onClose={() => setAdFormModalOpen(false)}
                onSave={handleSaveAd}
                ad={editingAd}
            />
            
            {/* Coupon Form Modal */}
            <CouponFormDialog
                isOpen={isCouponFormModalOpen}
                onClose={() => setCouponFormModalOpen(false)}
                onSave={handleSaveCoupon}
                coupon={editingCoupon}
            />

            {/* Details Modal */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setDetailsModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{currentItem?.title || currentItem?.name}</DialogTitle>
                    </DialogHeader>
                    {currentItem && (
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                             {currentItem.media?.length > 0 && (
                                <div className="relative w-full h-64 bg-slate-200 rounded-lg overflow-hidden">
                                     <Image 
                                        src={currentItem.media[currentMediaIndex]} 
                                        alt="Listing Media" 
                                        layout="fill" 
                                        objectFit="contain" 
                                        className="p-2"
                                     />
                                     {currentItem.media.length > 1 && (
                                         <>
                                            <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50" onClick={() => setCurrentMediaIndex(i => Math.max(0, i-1))} disabled={currentMediaIndex === 0}><ChevronLeft /></Button>
                                            <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50" onClick={() => setCurrentMediaIndex(i => Math.min(currentItem.media.length - 1, i+1))} disabled={currentMediaIndex === currentItem.media.length - 1}><ChevronRight /></Button>
                                         </>
                                     )}
                                </div>
                            )}

                             {(currentItem.aadhaarCardUrl || currentItem.electricityBillUrl) && (
                                <div className="border rounded-lg p-4 bg-blue-50">
                                    <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                                        <FileCheck className="w-5 h-5 text-blue-700" />
                                        Verification Documents
                                    </h4>
                                    <p className="text-sm text-blue-600 mb-4">These documents are visible only to admins for verification.</p>
                                    <div className="flex flex-wrap gap-4">
                                        {currentItem.aadhaarCardUrl && (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-8 h-8 text-blue-600"/>
                                                <p className="text-sm font-medium">Aadhaar Card</p>
                                                <Button asChild variant="outline" size="sm">
                                                    <a href={currentItem.aadhaarCardUrl} target="_blank" rel="noopener noreferrer">View</a>
                                                </Button>
                                            </div>
                                        )}
                                        {currentItem.electricityBillUrl && (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-8 h-8 text-blue-600"/>
                                                <p className="text-sm font-medium">Electricity Bill</p>
                                                <Button asChild variant="outline" size="sm">
                                                    <a href={currentItem.electricityBillUrl} target="_blank" rel="noopener noreferrer">View</a>
                                                </Button>
                                            </div>
                                        )}
                                        {currentItem.nocUrl && (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-8 h-8 text-blue-600"/>
                                                <p className="text-sm font-medium">NOC</p>
                                                <Button asChild variant="outline" size="sm">
                                                    <a href={currentItem.nocUrl} target="_blank" rel="noopener noreferrer">View</a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">ID</strong>
                                    <div>{currentItem.id}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">Type</strong>
                                    <div className="capitalize">{currentItem.type}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">Locality</strong>
                                    <div>{currentItem.locality}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">Status</strong>
                                    <StatusBadge status={currentItem.status} />
                                </div>
                                <div className="p-3 bg-slate-50 rounded-md col-span-2 space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">Description</strong>
                                    <div>{currentItem.description}</div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>Close</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the item.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteItem(currentItem.id, currentItem.type)}>Confirm Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                {currentItem.status !== 'rejected' && <Button variant="secondary" onClick={() => handleUpdateStatus(currentItem.id, currentItem.type, 'rejected')}><XCircle className="w-4 h-4 mr-2" />Reject</Button>}
                                {currentItem.status !== 'approved' && <Button onClick={() => handleUpdateStatus(currentItem.id, currentItem.type, 'approved')}><CheckCircle className="w-4 h-4 mr-2" />Approve</Button>}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

             {/* Settings Modals */}
            <Dialog open={activeSettingsDialog === 'password'} onOpenChange={() => setActiveSettingsDialog(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
                    <PasswordChangeForm currentPassword={ADMIN_PASSWORD} onClose={() => setActiveSettingsDialog(null)} />
                </DialogContent>
            </Dialog>
            <Dialog open={activeSettingsDialog === 'pin'} onOpenChange={() => setActiveSettingsDialog(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Change PIN</DialogTitle></DialogHeader>
                    <PinChangeForm currentPin={ADMIN_OTP} onClose={() => setActiveSettingsDialog(null)} />
                </DialogContent>
            </Dialog>
            <Dialog open={activeSettingsDialog === 'security'} onOpenChange={() => setActiveSettingsDialog(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Change Security Question</DialogTitle></DialogHeader>
                    <SecurityQuestionChangeForm currentAnswer={ADMIN_ANSWER} onClose={() => setActiveSettingsDialog(null)} />
                </DialogContent>
            </Dialog>
            <Dialog open={activeSettingsDialog === 'contact'} onOpenChange={() => setActiveSettingsDialog(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Change Contact Information</DialogTitle></DialogHeader>
                    <ContactInfoChangeForm 
                        currentEmail={ADMIN_EMAIL}
                        currentPhone={ADMIN_PHONE}
                        currentAddress={ADMIN_ADDRESS}
                        onClose={() => setActiveSettingsDialog(null)} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
