
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Home, LogOut, CheckCircle, Trash2, XCircle, FileText, ChevronLeft, ChevronRight, Search, Phone, MapPin, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/icons';
import { dummyProperties, dummyRoommates } from '@/lib/data';
import { format } from 'date-fns';
import { getFromLocalStorage } from '@/lib/storage';

export default function StaffDashboard() {
    const router = useRouter();
    const { toast } = useToast();
    
    const [properties, setProperties] = useState([]);
    const [roommates, setRoommates] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [propertySearchTerm, setPropertySearchTerm] = useState('');

    useEffect(() => {
        const authStatus = localStorage.getItem('staff_authenticated');
        if (authStatus !== 'true') {
            router.replace('/staff/login');
        } else {
            setIsMounted(true);
        }
    }, [router]);
    
    useEffect(() => {
        if (isMounted) {
            // In a real app, fetch data from an API
            setProperties(getFromLocalStorage('properties', dummyProperties));
            setRoommates(getFromLocalStorage('roommates', dummyRoommates));
        }
    }, [isMounted]);

    const handleLogout = () => {
        localStorage.removeItem('staff_authenticated');
        router.replace('/staff/login');
    };

    const pendingListings = useMemo(() => {
        if (!properties.length && !roommates.length) return [];
        return [
            ...properties.filter(p => p.status === 'pending').map(p => ({ ...p, itemType: p.propertyType })),
            ...roommates.filter(r => r.status === 'pending').map(r => ({ ...r, itemType: 'roommate' }))
        ];
    }, [properties, roommates]);

    const filteredProperties = useMemo(() => {
        const allSystemItems = [...properties, ...roommates];
        return allSystemItems.filter(p => {
            const titleOrName = p.title || p.ownerName;
            return propertySearchTerm === '' || titleOrName.toLowerCase().includes(propertySearchTerm.toLowerCase());
        });
    }, [properties, roommates, propertySearchTerm]);
    
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
        const staffId = 'Staff1'; // In a real app, this would come from the logged-in staff's session
        const timestamp = new Date();
        if (type === 'roommate') {
            setRoommates(rms => rms.map(r => r.id === id ? { ...r, status, verifiedBy: staffId, verificationTimestamp: timestamp } : r));
        } else {
            setProperties(props => props.map(p => p.id === id ? { ...p, status, verifiedBy: staffId, verificationTimestamp: timestamp } : r));
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

    const StatusBadge = ({ status }) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold capitalize";
        const statusClasses = {
            pending: "bg-yellow-200 text-yellow-800",
            approved: "bg-green-200 text-green-800",
            rejected: "bg-red-200 text-red-800",
        };
        return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
    };
    
    if (!isMounted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <LoadingSpinner className="w-12 h-12 text-primary" />
            </div>
        );
    }
    
    return (
        <div className="bg-slate-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-2">
                     <h1 className="text-2xl font-bold text-slate-800">StayFinder Staff Panel</h1>
                     <div className="flex items-center gap-2">
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
                {/* Pending Listings Section */}
                <Card className="mb-8">
                    <CardHeader><CardTitle className="text-2xl">Pending Listings for Verification</CardTitle></CardHeader>
                    <CardContent>
                        {pendingListings.length > 0 ? (
                            pendingListings.map(item => (
                                <div key={item.id} className="border-l-4 border-yellow-400 bg-slate-50 p-4 rounded-md mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div className="w-full">
                                        <p className="font-semibold">{item.title || item.ownerName} <span className="text-xs font-medium text-slate-500">({item.itemType})</span></p>
                                        <p className="text-sm text-slate-600">{item.locality}</p>
                                    </div>
                                    <Button onClick={() => handleViewDetails(item.id, item.itemType)} className="w-full sm:w-auto">Verify Details</Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500">No pending listings.</p>
                        )}
                    </CardContent>
                </Card>

                {/* All Listings Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-2xl">All System Listings</CardTitle>
                                <CardDescription>Search and manage all properties and roommate profiles.</CardDescription>
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by title or name..." 
                                    value={propertySearchTerm}
                                    onChange={(e) => setPropertySearchTerm(e.target.value)}
                                    className="pl-10 w-full sm:w-64"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title/Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Rent/Budget</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProperties.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.title || p.ownerName}</TableCell>
                                        <TableCell className="capitalize">{p.propertyType || p.type || 'N/A'}</TableCell>
                                        <TableCell>₹{(p.rent || p.budget).toLocaleString()}</TableCell>
                                        <TableCell><StatusBadge status={p.status} /></TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(p.id, p.propertyType || p.type || 'roommate')}>View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>

            {/* Details Modal */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setDetailsModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{currentItem?.title || currentItem?.ownerName}</DialogTitle>
                    </DialogHeader>
                    {currentItem && (
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                             {currentItem.images?.length > 0 && (
                                <div className="relative w-full h-64 bg-slate-200 rounded-lg overflow-hidden">
                                     <Image 
                                        src={currentItem.images[currentMediaIndex]} 
                                        alt="Listing Media" 
                                        layout="fill" 
                                        objectFit="contain" 
                                        className="p-2"
                                     />
                                     {currentItem.images.length > 1 && (
                                         <>
                                            <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50" onClick={() => setCurrentMediaIndex(i => Math.max(0, i-1))} disabled={currentMediaIndex === 0}><ChevronLeft /></Button>
                                            <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50" onClick={() => setCurrentMediaIndex(i => Math.min(currentItem.images.length - 1, i+1))} disabled={currentMediaIndex === currentItem.images.length - 1}><ChevronRight /></Button>
                                         </>
                                     )}
                                </div>
                            )}

                            <div className="border rounded-lg p-4 bg-blue-50">
                                <h4 className="font-semibold text-base mb-3">Verification Documents</h4>
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

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">ID</strong>
                                    <div>{currentItem.id}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">Type</strong>
                                    <div className="capitalize">{currentItem.propertyType || currentItem.type}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">Locality</strong>
                                    <div>{currentItem.locality}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground">Status</strong>
                                    <StatusBadge status={currentItem.status} />
                                </div>
                                {currentItem.verifiedBy && (
                                     <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                        <strong className="block text-sm font-medium text-muted-foreground flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Verified By</strong>
                                        <div>
                                            Staff ({currentItem.verifiedBy}) on {format(new Date(currentItem.verificationTimestamp), 'dd MMM yyyy, p')}
                                        </div>
                                    </div>
                                )}

                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground flex items-center gap-1.5"><UserIcon className="w-4 h-4" /> Owner/User Name</strong>
                                    <div>{currentItem.ownerName || currentItem.name}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Phone className="w-4 h-4" /> Phone Number</strong>
                                    <div>{currentItem.contactPhonePrimary}</div>
                                </div>
                                <div className="md:col-span-2 p-3 bg-slate-50 rounded-md space-y-1">
                                    <strong className="block text-sm font-medium text-muted-foreground flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Full Address</strong>
                                    <div>{currentItem.completeAddress}</div>
                                </div>

                                <div className="md:col-span-2 p-3 bg-slate-50 rounded-md space-y-1">
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
        </div>
    );
}
