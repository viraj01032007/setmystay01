// @ts-nocheck
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, Building, Users, LockOpen, Home, X as XIcon, HelpCircle, CheckCircle, Trash2, ChevronLeft, ChevronRight, LogOut, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/icons';

// Mock data similar to the provided script
const initialProperties = [
    { id: 'P001', type: 'rental', title: 'Spacious 2BHK Apartment', locality: 'Andheri West', rent: 35000, status: 'pending', description: 'A beautiful and spacious 2BHK apartment...', media: ['https://placehold.co/600x400', 'https://placehold.co/600x400'], 'data-ai-hint': 'apartment interior' },
    { id: 'P002', type: 'pg', title: 'Cozy PG near College', locality: 'Dadar East', rent: 8000, status: 'approved', description: 'Comfortable PG accommodation for students...', media: ['https://placehold.co/600x400'], 'data-ai-hint': 'student room' },
    { id: 'P003', type: 'rental', title: '1BHK for Bachelors', locality: 'Ghatkopar', rent: 18000, status: 'rejected', description: 'Compact 1BHK suitable for single working professionals.', media: [], 'data-ai-hint': 'small apartment' },
    { id: 'P004', type: 'pg', title: 'Luxury PG with all amenities', locality: 'Bandra', rent: 15000, status: 'pending', description: 'High-end PG with AC, food, and laundry.', media: ['https://placehold.co/600x400', 'https://placehold.co/600x400', 'https://placehold.co/600x400'], 'data-ai-hint': 'luxury room' }
];
const initialRoommates = [
    { id: 'R001', name: 'Alok Sharma', profession: 'Software Engineer', gender: 'Male', locality: 'Powai', budget: 10000, status: 'pending', description: 'Looking for a male roommate in a 2BHK.', media: ['https://placehold.co/400x400'], 'data-ai-hint': 'male portrait' },
    { id: 'R002', name: 'Priya Singh', profession: 'Student', gender: 'Female', locality: 'Andheri', budget: 7000, status: 'approved', description: 'Seeking a female roommate for a shared apartment.', media: [], 'data-ai-hint': 'female portrait' }
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

const chartData = [
    { name: 'Jan', views: 1200 }, { name: 'Feb', views: 1900 }, { name: 'Mar', views: 3000 },
    { name: 'Apr', views: 5000 }, { name: 'May', views: 2000 }, { name: 'Jun', views: 3500 },
];


export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { toast } = useToast();
    
    // State management
    const [properties, setProperties] = useState(initialProperties);
    const [roommates, setRoommates] = useState(initialRoommates);
    const [pricing, setPricing] = useState(initialPricing);

    const [analytics, setAnalytics] = useState({
        totalPageViews: 0,
        totalUnlocks: 0,
        lastUpdated: ''
    });

    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    useEffect(() => {
        const authStatus = localStorage.getItem('admin_authenticated');
        if (authStatus !== 'true') {
            router.replace('/admin/login');
        } else {
            setIsAuthenticated(true);
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
        return [
            ...properties.filter(p => p.status === 'pending').map(p => ({ ...p, itemType: p.type })),
            ...roommates.filter(r => r.status === 'pending').map(r => ({ ...r, itemType: 'roommate' }))
        ];
    }, [properties, roommates]);
    
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

    const StatusBadge = ({ status }) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
        const statusClasses = {
            pending: "bg-yellow-200 text-yellow-800",
            approved: "bg-green-200 text-green-800",
            rejected: "bg-red-200 text-red-800",
        };
        return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <LoadingSpinner className="w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                     <h1 className="text-2xl font-bold text-slate-800">SetMyStay Admin</h1>
                     <div className="flex items-center gap-4">
                        <Button asChild>
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" />
                                Go to Main Site
                            </Link>
                        </Button>
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
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">Property Views by Month</h3>
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
                                            <Label htmlFor={`price-unlock-${plan}`} className="w-28 capitalize">{plan} Unlock{plan !== '1' && plan !== 'unlimited' ? 's' : ''}</Label>
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
                                            <Label htmlFor={`price-listing-${plan}`} className="w-28 capitalize">{plan} Listing</Label>
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

                {/* Pending Listings Section */}
                <Card className="mb-8">
                    <CardHeader><CardTitle className="text-2xl">Pending Listings</CardTitle></CardHeader>
                    <CardContent>
                        {pendingListings.length > 0 ? (
                            pendingListings.map(item => (
                                <div key={item.id} className="border-l-4 border-yellow-400 bg-slate-50 p-4 rounded-md mb-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.title || item.name} <span className="text-xs font-medium text-slate-500">({item.itemType})</span></p>
                                        <p className="text-sm text-slate-600">{item.locality}</p>
                                    </div>
                                    <Button onClick={() => handleViewDetails(item.id, item.itemType)}>View Details</Button>
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
                        <CardHeader><CardTitle className="text-2xl">All Properties</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Rent</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {properties.map(p => (
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

            {/* Details Modal */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setDetailsModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{currentItem?.title || currentItem?.name}</DialogTitle>
                    </DialogHeader>
                    {currentItem && (
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-md"><Label>ID</Label><p>{currentItem.id}</p></div>
                                <div className="p-3 bg-slate-50 rounded-md"><Label>Type</Label><p className="capitalize">{currentItem.type}</p></div>
                                <div className="p-3 bg-slate-50 rounded-md"><Label>Locality</Label><p>{currentItem.locality}</p></div>
                                <div className="p-3 bg-slate-50 rounded-md"><Label>Status</Label><StatusBadge status={currentItem.status} /></div>
                                <div className="p-3 bg-slate-50 rounded-md col-span-2"><Label>Description</Label><p>{currentItem.description}</p></div>
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
        </div>
    );
}
