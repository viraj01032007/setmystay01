
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { Listing, RoommateProfile, Page, ListingType, UnlockPlan, Bed, Advertisement, Coupon, Purchase, Inquiry } from "@/lib/types";
import { dummyProperties, dummyRoommates, dummyCoupons } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomeSection } from "@/components/sections/home-section";
import { ListingsSection } from "@/components/sections/listings-section";
import { ListPropertySection } from "@/components/sections/list-property-section";

import { PropertyDetails } from "@/components/modals/property-details";
import { RoommateDetails } from "@/components/modals/roommate-details";
import { UnlockDetailsModal } from "@/components/modals/unlock-details-modal";
import { ListPropertyPaymentModal } from "@/components/modals/list-property-payment-modal";
import { AuthModal } from "@/components/modals/auth-modal";
import { ChatModal } from "@/components/modals/chat-modal";
import { LoadingSpinner } from "@/components/icons";
import { RateUsModal } from "@/components/modals/rate-us-modal";
import { BookingInquiryModal } from "@/components/modals/booking-inquiry-modal";
import { FloatingCta } from "@/components/shared/floating-cta";
import { AdvertisementModal } from "@/components/modals/advertisement-modal";
import { PaymentConfirmationModal } from "@/components/modals/payment-confirmation-modal";
import { SlotMachineModal } from "@/components/modals/slot-machine-modal";
import { ContactFab } from "@/components/shared/contact-fab";
import { HistoryModal } from "@/components/modals/history-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage";


const defaultUserState = {
    unlocks: { count: 0, isUnlimited: false, unlockedIds: new Set<string>() },
    purchaseHistory: [] as Purchase[],
    likedItemIds: new Set<string>(),
};

export default function Home() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [allRoommates, setAllRoommates] = useState<RoommateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState<Listing[]>([]);
  const [featuredRoommates, setFeaturedRoommates] = useState<RoommateProfile[]>([]);
  const [isClient, setIsClient] = useState(false);

  const [selectedItem, setSelectedItem] = useState<{ type: 'listing' | 'roommate'; data: Listing | RoommateProfile } | null>(null);
  const [itemToUnlock, setItemToUnlock] = useState<{ type: 'listing' | 'roommate'; data: Listing | RoommateProfile } | null>(null);
  const [isUnlockModalOpen, setUnlockModalOpen] = useState(false);
  const [isListPaymentModalOpen, setListPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [isRateUsModalOpen, setRateUsModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [chattingWith, setChattingWith] = useState<string | null>(null);

  const [unlocks, setUnlocks] = useState(defaultUserState.unlocks);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [likedItemIds, setLikedItemIds] = useState<Set<string>>(new Set());
  const [likedItems, setLikedItems] = useState<(Listing | RoommateProfile)[]>([]);
  const [myProperties, setMyProperties] = useState<(Listing | RoommateProfile)[]>([]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState<{ listing: Listing; bed: Bed } | null>(null);
  const [pendingListingData, setPendingListingData] = useState<any>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authActionRequired, setAuthActionRequired] = useState<string | null>(null);

  const [adToShow, setAdToShow] = useState<Advertisement | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ planName: string; amount: number; onConfirm: () => void; } | null>(null);

  const [isSlotMachineModalOpen, setIsSlotMachineModalOpen] = useState(false);
  
  const [availabilityInquiries, setAvailabilityInquiries] = useState<Inquiry[]>([]);

  const [isUnlockConfirmationOpen, setUnlockConfirmationOpen] = useState(false);
  
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const loggedInStatus = getFromLocalStorage('setmystay_isLoggedIn', false);
      setIsLoggedIn(loggedInStatus);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      // Initial data loading
      const approvedListings = getFromLocalStorage('properties', dummyProperties).filter((p: Listing) => p.status === 'approved');
      const approvedRoommates = getFromLocalStorage('roommates', dummyRoommates).filter((r: RoommateProfile) => r.status === 'approved');
      setAllListings(approvedListings);
      setAllRoommates(approvedRoommates);
      
      // Shuffling logic for initial render
      const shuffledListings = [...approvedListings].sort(() => 0.5 - Math.random());
      const roommatesWithProperty = approvedRoommates.filter(r => r.hasProperty);
      const shuffledRoommates = [...roommatesWithProperty].sort(() => 0.5 - Math.random());
    
      setFeaturedProperties(shuffledListings.slice(0, 3));
      setFeaturedRoommates(shuffledRoommates.slice(0, 3));
      
      const allUserData = getFromLocalStorage('setmystay_user_data', {});
      const userData = isLoggedIn ? (allUserData.defaultUser || defaultUserState) : defaultUserState;
      
      setUnlocks({
          count: userData.unlocks.count || 0,
          isUnlimited: userData.unlocks.isUnlimited || false,
          unlockedIds: new Set(userData.unlocks.unlockedIds || []),
      });
      setPurchaseHistory((userData.purchaseHistory || []).map((p: any) => ({...p, date: new Date(p.date)})));
      
      const currentLikedIds = new Set(userData.likedItemIds || []);
      setLikedItemIds(currentLikedIds);
      
      const allProps = getFromLocalStorage('properties', dummyProperties);
      const allMates = getFromLocalStorage('roommates', dummyRoommates);
      const allItems = [...allProps, ...allMates];
      setLikedItems(allItems.filter(item => currentLikedIds.has(item.id)));

      const userId = 'newUser'; // Simulate current user
      const userListings = getFromLocalStorage('properties', dummyProperties).filter(l => l.ownerId === userId);
      const userRoommateProfiles = getFromLocalStorage('roommates', dummyRoommates).filter(r => r.ownerId === userId);
      setMyProperties([...userListings, ...userRoommateProfiles]);

      const storedAdvertisements = getFromLocalStorage('advertisements', []);
      const activeAd = storedAdvertisements.find(ad => ad.isActive);
      const adShown = sessionStorage.getItem('setmystay_ad_shown');

      if (activeAd && !adShown) {
          const timer = setTimeout(() => {
              setAdToShow(activeAd);
              setIsAdModalOpen(true);
              sessionStorage.setItem('setmystay_ad_shown', 'true');
          }, 5000); 

          return () => clearTimeout(timer);
      }
      
      setActiveCoupons(getFromLocalStorage('coupons', dummyCoupons));
      
      setIsLoading(false);
    }
  }, [isClient, isLoggedIn]);

  const saveUserData = useCallback(() => {
    if (isLoggedIn && isClient) {
      const allUserData = getFromLocalStorage('setmystay_user_data', {});
      const currentUserData = allUserData.defaultUser || {};
      const updatedData = { 
        ...currentUserData, 
        unlocks: {
            count: unlocks.count,
            isUnlimited: unlocks.isUnlimited,
            unlockedIds: Array.from(unlocks.unlockedIds),
        },
        purchaseHistory: purchaseHistory,
        likedItemIds: Array.from(likedItemIds),
      };
      saveToLocalStorage('setmystay_user_data', { defaultUser: updatedData });
    }
  }, [isLoggedIn, isClient, unlocks, purchaseHistory, likedItemIds]);

  useEffect(() => {
    if (isClient) {
      saveUserData();
    }
  }, [isClient, saveUserData]);
  
  // Effect to handle showing the auth modal when an action requires it
  useEffect(() => {
    if (authActionRequired) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${authActionRequired}.`,
      });
      setAuthModalOpen(true);
      if (authActionRequired === 'list your property') {
        sessionStorage.setItem('setmystay_intended_page', 'list');
      }
    }
  }, [authActionRequired, toast]);


  const handleNavigate = (page: Page) => {
    setActivePage(page);
  };

  const handleRateUsClose = (rated: boolean) => {
    setRateUsModalOpen(false);
  }
  
  const useUnlock = useCallback((itemId: string) => {
    let success = false;
    let newCount: number | undefined;
    setUnlocks(currentUnlocks => {
        if (currentUnlocks.isUnlimited) {
            success = true;
            return {
                ...currentUnlocks,
                unlockedIds: new Set(currentUnlocks.unlockedIds).add(itemId),
            };
        }
        if (currentUnlocks.count > 0) {
            success = true;
            newCount = currentUnlocks.count - 1;
            return {
                ...currentUnlocks,
                count: newCount,
                unlockedIds: new Set(currentUnlocks.unlockedIds).add(itemId),
            };
        }
        return currentUnlocks;
    });
    
    // Show toast AFTER state update
    if (success && newCount !== undefined) {
        toast({
            title: "Details Unlocked!",
            description: `You have ${newCount} unlocks remaining.`,
        });
    }
    
    return success;
  }, [toast]);
  
  const handleUnlockPurchase = useCallback((plan: UnlockPlan, planName: string, amount: number) => {
    setUnlocks(currentUnlocks => {
      const newUnlocksState = { ...currentUnlocks };
      if (plan === 'unlimited') {
        newUnlocksState.isUnlimited = true;
      } else {
        newUnlocksState.count += plan;
      }
      return newUnlocksState;
    });

    setPurchaseHistory(currentHistory => {
        const newPurchase: Purchase = { id: `purchase_${Date.now()}`, planName, amount, date: new Date() };
        return [...currentHistory, newPurchase];
    });

    toast({
      title: "Purchase Successful!",
      description: plan === 'unlimited' ? "You now have unlimited unlocks." : `You've added ${plan} unlocks.`,
      variant: "default",
    });

    setTimeout(() => {
        if (itemToUnlock) {
            setSelectedItem(itemToUnlock);
            setItemToUnlock(null);
        } else {
            setRateUsModalOpen(true);
        }
    }, 300);
  }, [toast, itemToUnlock]);

  const handleViewDetails = (item: Listing | RoommateProfile, type: 'listing' | 'roommate') => {
    setSelectedItem({ type, data: item });
  };
  
  const handleConfirmUnlock = () => {
    if (selectedItem?.data.id) {
      if (useUnlock(selectedItem.data.id)) {
        // Refresh the selected item to show unlocked state by re-setting it
        handleViewDetails(selectedItem.data, selectedItem.type);
      }
    }
    setUnlockConfirmationOpen(false);
  };

  const handleUnlockClick = () => {
    if (!isLoggedIn) {
        setAuthActionRequired('unlock details');
        return;
    }
    if (selectedItem) {
        if (unlocks.isUnlimited || unlocks.count > 0) {
            setUnlockConfirmationOpen(true);
        } else {
            // User has no unlocks, set the item to unlock and close the details modal to show the pricing modal
            setItemToUnlock(selectedItem);
            setSelectedItem(null); 
            setUnlockModalOpen(true);
        }
    }
  }
  
  const handleToggleLike = (itemId: string) => {
    if (!isLoggedIn) {
        setAuthActionRequired('like items');
        return;
    }
    setLikedItemIds(currentSet => {
        const newSet = new Set(currentSet);
        if (newSet.has(itemId)) {
            newSet.delete(itemId);
        } else {
            newSet.add(itemId);
        }
        return newSet;
    });
  };

  const handleInitiateListing = (data: any) => {
    if (!isLoggedIn) {
        setAuthActionRequired('list a property');
        return;
    }
    setPendingListingData(data);
    setListPaymentModalOpen(true);
  };

  const handleListProperty = () => {
    if (!pendingListingData) return;
    
    setListPaymentModalOpen(false);
    const newId = `new-${Date.now()}`;
    const ownerId = 'newUser'; // Simulate current user
    
    let partialAddress = `${pendingListingData.locality}, ${pendingListingData.city}`;
    if (pendingListingData.sector) {
      partialAddress = `${pendingListingData.sector}, ${pendingListingData.locality}, ${pendingListingData.city}`;
    }

    if ('propertyType' in pendingListingData && pendingListingData.propertyType !== 'Roommate') {
        const mappedListing: Listing = {
          id: newId,
          propertyType: pendingListingData.propertyType,
          title: pendingListingData.title,
          rent: pendingListingData.rent,
          area: pendingListingData.area, 
          state: pendingListingData.state,
          city: pendingListingData.city,
          locality: pendingListingData.locality,
          sector: pendingListingData.sector,
          completeAddress: pendingListingData.address,
          partialAddress: partialAddress,
          ownerName: pendingListingData.ownerName,
          contactPhonePrimary: pendingListingData.phonePrimary,
          contactPhoneSecondary: pendingListingData.phoneSecondary,
          description: pendingListingData.description,
          furnishedStatus: 'Furnished', 
          amenities: pendingListingData.amenities,
          size: '2 BHK', 
          images: pendingListingData.images?.length ? pendingListingData.images.map((f: File) => URL.createObjectURL(f)) : ['https://placehold.co/600x400'],
          videoUrl: pendingListingData.videoFile ? URL.createObjectURL(pendingListingData.videoFile) : undefined,
          aadhaarCardUrl: pendingListingData.aadhaarCard ? URL.createObjectURL(pendingListingData.aadhaarCard) : undefined,
          electricityBillUrl: pendingListingData.electricityBill ? URL.createObjectURL(pendingListingData.electricityBill) : undefined,
          nocUrl: pendingListingData.noc ? URL.createObjectURL(pendingListingData.noc) : undefined,
          views: 0,
          ownerId,
          brokerStatus: pendingListingData.brokerStatus,
          lastAvailabilityCheck: new Date().toISOString(),
          status: 'pending', // Set status to pending
          submittedAt: new Date().toISOString(),
          vendorNumber: pendingListingData.vendorNumber,
      }
      const currentProps = getFromLocalStorage('properties', dummyProperties);
      saveToLocalStorage('properties', [...currentProps, mappedListing]);
    } else {
       const mappedRoommate: RoommateProfile = {
        id: newId,
        propertyType: 'Roommate',
        ownerName: pendingListingData.ownerName,
        age: 30, 
        rent: pendingListingData.rent,
        area: pendingListingData.area,
        state: pendingListingData.state,
        city: pendingListingData.city,
        locality: pendingListingData.locality,
        sector: pendingListingData.sector,
        completeAddress: pendingListingData.address,
        partialAddress: partialAddress,
        contactPhonePrimary: pendingListingData.phonePrimary,
        contactPhoneSecondary: pendingListingData.phoneSecondary,
        description: pendingListingData.description,
        preferences: [], 
        gender: pendingListingData.gender || 'Any',
        views: 0,
        ownerId,
        hasProperty: pendingListingData.roommateStatus === 'hasProperty', 
        images: pendingListingData.images?.length ? pendingListingData.images.map((f: File) => URL.createObjectURL(f)) : ['https://placehold.co/400x400'],
        aadhaarCardUrl: pendingListingData.aadhaarCard ? URL.createObjectURL(pendingListingData.aadhaarCard) : undefined,
        electricityBillUrl: pendingListingData.electricityBill ? URL.createObjectURL(pendingListingData.electricityBill) : undefined,
        status: 'pending', // Set status to pending
        submittedAt: new Date().toISOString(),
    }
      const currentMates = getFromLocalStorage('roommates', dummyRoommates);
      saveToLocalStorage('roommates', [...currentMates, mappedRoommate]);
    }
    setPendingListingData(null);
    toast({
      title: "Listing Submitted for Review!",
      description: "Your property is now under review. You will receive a call from our staff for manual verification shortly.",
    });
    setTimeout(() => setRateUsModalOpen(true), 500);
  };
  
  const handleChat = (name: string) => {
    setChattingWith(name);
    setSelectedItem(null); 
    setChatModalOpen(true);
  }

  const handleBookInquiry = (listing: Listing, bed: Bed) => {
    setInquiryData({ listing, bed });
    setIsBookingModalOpen(true);
    setSelectedItem(null); 
  };
  
  const handleCheckAvailability = (listing: Listing) => {
    toast({
      title: "Inquiry Sent!",
      description: "The owner has been notified of your availability request.",
    });
    
    const newInquiry: Inquiry = {
        id: `inq_${Date.now()}`,
        propertyId: listing.id,
        propertyTitle: listing.title,
        userName: 'A Potential Tenant', // Simulate a logged-in user's name
        time: new Date(),
    };
    setAvailabilityInquiries(prev => [...prev, newInquiry]);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAuthActionRequired(null);
    saveToLocalStorage('setmystay_isLoggedIn', true);
    
    // If user intended to list a property, take them there now
    const intendedPage = sessionStorage.getItem('setmystay_intended_page');
    if (intendedPage === 'list') {
      setActivePage('list');
      sessionStorage.removeItem('setmystay_intended_page');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    saveToLocalStorage('setmystay_isLoggedIn', false);
    // Also clear user-specific data from state
    setUnlocks(defaultUserState.unlocks);
    setPurchaseHistory(defaultUserState.purchaseHistory);
    setLikedItemIds(new Set());
    setActivePage('home');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };
  
  const handleOpenConfirmationModal = (planName: string, amount: number, onConfirm: () => void) => {
    setPaymentDetails({ planName, amount, onConfirm });
    setIsPaymentConfirmationOpen(true);
  };

  const handleConfirmPayment = () => {
    if (paymentDetails) {
        paymentDetails.onConfirm();
    }
    setIsPaymentConfirmationOpen(false);
    setPaymentDetails(null);
  };

  const handleCouponWin = (coupon: Coupon) => {
    toast({
        title: "🎉 You Won a Coupon! 🎉",
        description: `Code: ${coupon.code} (${coupon.discountPercentage}% off). It has been copied to your clipboard!`,
    });
    navigator.clipboard.writeText(coupon.code);
  };

  const handlePlanSelect = (plan: { plan: UnlockPlan, title: string, price: number }) => {
    if (!isLoggedIn) {
      setUnlockModalOpen(false);
      setAuthActionRequired('purchase a plan');
      return;
    }
    setUnlockModalOpen(false);
    handleOpenConfirmationModal(plan.title, plan.price, () => handleUnlockPurchase(plan.plan, plan.title, plan.price));
  };

  const handleNavigationWithAuth = (page: Page) => {
    if (page === 'list' && !isLoggedIn) {
      setAuthActionRequired('list your property');
      return;
    }
    handleNavigate(page);
  };
  
  const handleGameClick = () => {
    if (!isLoggedIn) {
      setAuthActionRequired('play the game');
    } else {
      setIsSlotMachineModalOpen(true);
    }
  };

  if (isLoading || !isClient) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <LoadingSpinner className="w-16 h-16 text-primary" />
        <p className="mt-4 text-lg font-semibold text-foreground">Loading SetMyStay...</p>
      </div>
    );
  }
  
  const getListingsForPage = () => {
    switch (activePage) {
        case 'pg':
            return allListings.filter(l => l.propertyType === 'PG');
        case 'rentals':
            return allListings.filter(l => l.propertyType === 'Rental');
        case 'roommates':
            return allRoommates;
        case 'my-properties':
            return myProperties;
        case 'liked-properties':
            return likedItems;
        default:
            return [];
    }
  }
  
  const getPageType = (): ListingType => {
      if (['pg', 'rentals'].includes(activePage)) return activePage as ListingType;
      if (activePage === 'roommates') return 'roommate';
      if (activePage === 'my-properties' || activePage === 'liked-properties') return 'rental'; // Default for mixed content
      return 'rental';
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header 
        activePage={activePage} 
        setActivePage={handleNavigationWithAuth} 
        onSignInClick={() => setAuthModalOpen(true)}
        onSubscriptionClick={() => {
          setItemToUnlock(null); // Clear any specific item context when opening pricing generally
          setUnlockModalOpen(true);
        }}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onHistoryClick={() => setHistoryModalOpen(true)}
      />
      
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomeSection 
            featuredProperties={featuredProperties} 
            featuredRoommates={featuredRoommates.filter(r => r.hasProperty)} 
            onViewDetails={handleViewDetails}
            onNavigate={handleNavigationWithAuth}
            likedItemIds={likedItemIds}
            onToggleLike={handleToggleLike}
            unlockedIds={unlocks.unlockedIds}
          />
        )}
        {(['pg', 'rentals', 'roommates', 'my-properties', 'liked-properties'].includes(activePage)) && (
            <ListingsSection
              key={activePage} // Re-mount component on page change
              type={getPageType()}
              listings={getListingsForPage()}
              onViewDetails={handleViewDetails}
              initialSearchFilters={null}
              likedItemIds={likedItemIds}
              onToggleLike={handleToggleLike}
              unlockedIds={unlocks.unlockedIds}
              pageTitle={
                activePage === 'my-properties' ? 'My Properties' :
                activePage === 'liked-properties' ? 'My Liked Properties' :
                undefined
              }
              inquiries={activePage === 'my-properties' ? availabilityInquiries.filter(inq => myProperties.some(p => p.id === inq.propertyId)) : undefined}
            />
        )}
        {activePage === 'list' && (
          <ListPropertySection onSubmit={handleInitiateListing} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <FloatingCta onGameClick={handleGameClick} />
      <ContactFab />
      
      {/* Modals */}
      <PropertyDetails 
        listing={selectedItem?.type === 'listing' ? selectedItem.data as Listing : null}
        onClose={() => setSelectedItem(null)}
        isUnlocked={isLoggedIn && selectedItem?.data ? unlocks.unlockedIds.has(selectedItem.data.id) : false}
        onUnlock={handleUnlockClick}
        onChat={() => handleChat(selectedItem?.data?.ownerName || 'Owner')}
        onBookInquiry={handleBookInquiry}
        onCheckAvailability={handleCheckAvailability}
      />
      <RoommateDetails
        profile={selectedItem?.type === 'roommate' ? selectedItem.data as RoommateProfile : null}
        onClose={() => setSelectedItem(null)}
        isUnlocked={isLoggedIn && selectedItem?.data ? unlocks.unlockedIds.has(selectedItem.data.id) : false}
        onUnlock={handleUnlockClick}
        onChat={() => handleChat(selectedItem?.data?.ownerName || 'Roommate')}
      />
       <AlertDialog open={isUnlockConfirmationOpen} onOpenChange={setUnlockConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Unlock</AlertDialogTitle>
            <AlertDialogDescription>
              This will use one of your unlock credits. This action cannot be undone.
              You have {unlocks.count} unlocks remaining.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUnlock}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <UnlockDetailsModal 
        isOpen={isUnlockModalOpen}
        onClose={() => {
            setUnlockModalOpen(false);
            if (itemToUnlock) {
                // If we bailed on an unlock to buy more credits, show the item again.
                setSelectedItem(itemToUnlock);
                setItemToUnlock(null);
            }
        }}
        onPlanSelect={handlePlanSelect}
        onNavigateToListProperty={() => {
          setUnlockModalOpen(false);
          handleNavigationWithAuth('list');
        }}
      />
      <ListPropertyPaymentModal
        isOpen={isListPaymentModalOpen}
        onClose={() => setListPaymentModalOpen(false)}
        onProceedToPayment={(plan) => {
          setListPaymentModalOpen(false);
          handleOpenConfirmationModal(plan.title, plan.price, handleListProperty);
        }}
      />
       <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
            setAuthModalOpen(false);
            setAuthActionRequired(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
       <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setChatModalOpen(false)}
        contactName={chattingWith}
      />
       <HistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        purchases={purchaseHistory}
      />
      <RateUsModal 
        isOpen={isRateUsModalOpen}
        onClose={handleRateUsClose}
      />
      <BookingInquiryModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        listing={inquiryData?.listing || null}
        bed={inquiryData?.bed || null}
      />
      {isClient && <AdvertisementModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        title={adToShow?.title || ''}
        description={adToShow?.description || ''}
        imageUrl={adToShow?.imageUrl || ''}
      />}
      <PaymentConfirmationModal
        isOpen={isPaymentConfirmationOpen}
        onClose={() => setIsPaymentConfirmationOpen(false)}
        onConfirm={handleConfirmPayment}
        planName={paymentDetails?.planName || ''}
        amount={paymentDetails?.amount || 0}
        availableCoupons={activeCoupons}
      />
      {isClient && (
        <SlotMachineModal
            isOpen={isSlotMachineModalOpen}
            onClose={() => setIsSlotMachineModalOpen(false)}
            prizes={activeCoupons.filter(c => c.isActive)}
            onWin={handleCouponWin}
        />
      )}
    </div>
  );
}
