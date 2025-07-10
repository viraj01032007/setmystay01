

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { Listing, RoommateProfile, Page, ListingType, UnlockPlan, Bed, Advertisement, Coupon, Purchase } from "@/lib/types";
import { dummyProperties, dummyRoommates, dummyAdvertisements, dummyCoupons } from "@/lib/data";
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


export default function Home() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [allRoommates, setAllRoommates] = useState<RoommateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState<Listing[]>([]);
  const [featuredRoommates, setFeaturedRoommates] = useState<RoommateProfile[]>([]);
  const [isClient, setIsClient] = useState(false);

  const [selectedItem, setSelectedItem] = useState<{ type: 'listing' | 'roommate'; data: Listing | RoommateProfile } | null>(null);
  const [isUnlockModalOpen, setUnlockModalOpen] = useState(false);
  const [isListPaymentModalOpen, setListPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [isRateUsModalOpen, setRateUsModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [chattingWith, setChattingWith] = useState<string | null>(null);

  const [unlocks, setUnlocks] = useState({ count: 0, isUnlimited: false, unlockedIds: new Set<string>() });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState<{ listing: Listing; bed: Bed } | null>(null);
  const [pendingListingData, setPendingListingData] = useState<any>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [adToShow, setAdToShow] = useState<Advertisement | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ planName: string; amount: number; onConfirm: () => void; } | null>(null);

  const [isSlotMachineModalOpen, setIsSlotMachineModalOpen] = useState(false);
  
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [likedItemIds, setLikedItemIds] = useState<Set<string>>(new Set());


  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Initial data loading
    setAllListings(dummyProperties);
    setAllRoommates(dummyRoommates);
    
    // Shuffling logic for initial render
    const shuffledListings = [...dummyProperties].sort(() => 0.5 - Math.random());
    const roommatesWithProperty = dummyRoommates.filter(r => r.hasProperty);
    const shuffledRoommates = [...roommatesWithProperty].sort(() => 0.5 - Math.random());
  
    setFeaturedProperties(shuffledListings.slice(0, 3));
    setFeaturedRoommates(shuffledRoommates.slice(0, 3));
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Client-side only logic
      const savedCount = parseInt(localStorage.getItem('setmystay_unlocks') || '0');
      const savedIsUnlimited = localStorage.getItem('setmystay_isUnlimited') === 'true';
      const savedUnlockedIds = new Set<string>(JSON.parse(localStorage.getItem('setmystay_unlockedIds') || '[]'));
      setUnlocks({ count: savedCount, isUnlimited: savedIsUnlimited, unlockedIds: savedUnlockedIds });

      const loggedInStatus = localStorage.getItem('setmystay_isLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
      
      const savedHistory = JSON.parse(localStorage.getItem('setmystay_purchaseHistory') || '[]');
      setPurchaseHistory(savedHistory.map((p: any) => ({ ...p, date: new Date(p.date) })));
      
      const savedLikedItems = new Set<string>(JSON.parse(localStorage.getItem('setmystay_likedItems') || '[]'));
      setLikedItemIds(savedLikedItems);

      const activeAd = dummyAdvertisements.find(ad => ad.isActive);
      const adShown = sessionStorage.getItem('setmystay_ad_shown');

      if (activeAd && !adShown) {
          const timer = setTimeout(() => {
              setAdToShow(activeAd);
              setIsAdModalOpen(true);
              sessionStorage.setItem('setmystay_ad_shown', 'true');
          }, 5000); // Show after 5 seconds

          return () => clearTimeout(timer);
      }
    }
  }, [isClient]);

  const handleRateUsClose = (rated: boolean) => {
    setRateUsModalOpen(false);
  }

  const handleUnlockPurchase = useCallback((plan: UnlockPlan, planName: string, amount: number) => {
    setUnlocks(prev => {
      let newCount = prev.count;
      let newIsUnlimited = prev.isUnlimited;

      if (plan === 'unlimited') {
        newIsUnlimited = true;
      } else {
        newCount += plan;
      }

      const newUnlocks = { ...prev, count: newCount, isUnlimited: newIsUnlimited };
      localStorage.setItem('setmystay_unlocks', newUnlocks.count.toString());
      localStorage.setItem('setmystay_isUnlimited', newUnlocks.isUnlimited.toString());
      
      return newUnlocks;
    });
    
    const newPurchase: Purchase = { id: `purchase_${Date.now()}`, planName, amount, date: new Date() };
    setPurchaseHistory(prev => {
        const updatedHistory = [...prev, newPurchase];
        localStorage.setItem('setmystay_purchaseHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
    });
    
    toast({
      title: "Purchase Successful!",
      description: plan === 'unlimited' ? "You've subscribed to unlimited unlocks for one month." : `You've added ${plan} unlocks.`,
      variant: "default",
    });

    setTimeout(() => setRateUsModalOpen(true), 500);
  }, [toast]);

  const useUnlock = useCallback((itemId: string) => {
    if (unlocks.isUnlimited) {
      const newUnlockedIds = new Set(unlocks.unlockedIds).add(itemId);
      setUnlocks(prev => ({...prev, unlockedIds: newUnlockedIds}));
      localStorage.setItem('setmystay_unlockedIds', JSON.stringify(Array.from(newUnlockedIds)));
      return true;
    }
    if (unlocks.count > 0) {
      const newCount = unlocks.count - 1;
      const newUnlockedIds = new Set(unlocks.unlockedIds).add(itemId);
      setUnlocks({ count: newCount, isUnlimited: false, unlockedIds: newUnlockedIds });
      localStorage.setItem('setmystay_unlocks', newCount.toString());
      localStorage.setItem('setmystay_unlockedIds', JSON.stringify(Array.from(newUnlockedIds)));
      toast({
        title: "Details Unlocked!",
        description: `You have ${newCount} unlocks remaining.`,
      });
      return true;
    }
    return false;
  }, [unlocks, toast]);

  const handleViewDetails = (item: Listing | RoommateProfile, type: 'listing' | 'roommate') => {
    setSelectedItem({ type, data: item });
  };

  const handleUnlockClick = () => {
    if (selectedItem?.data.id && !unlocks.unlockedIds.has(selectedItem.data.id)) {
       if (useUnlock(selectedItem.data.id)) {
        handleViewDetails(selectedItem.data, selectedItem.type);
       } else {
        setUnlockModalOpen(true);
       }
    }
  }
  
  const handleToggleLike = (itemId: string) => {
    setLikedItemIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
            newSet.delete(itemId);
        } else {
            newSet.add(itemId);
        }
        localStorage.setItem('setmystay_likedItems', JSON.stringify(Array.from(newSet)));
        return newSet;
    });
  };
  
  const likedItems = useMemo(() => {
    const allItems = [...allListings, ...allRoommates];
    return allItems.filter(item => likedItemIds.has(item.id));
  }, [likedItemIds, allListings, allRoommates]);
  
  const myProperties = useMemo(() => {
      // In a real app, this would be based on a user ID from the login session.
      // Here, we simulate it by assigning some listings to a "logged in" user.
      const userId = 'newUser';
      return allListings.filter(l => l.ownerId === userId);
  }, [allListings]);


  const handleInitiateListing = (data: any) => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      toast({
        title: "Authentication Required",
        description: "Please sign in to list your property.",
        variant: "destructive"
      });
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
          completeAddress: pendingListingData.address,
          partialAddress: `${pendingListingData.locality}, ${pendingListingData.city}`,
          ownerName: pendingListingData.ownerName,
          contactPhonePrimary: pendingListingData.phonePrimary,
          contactPhoneSecondary: pendingListingData.phoneSecondary,
          description: pendingListingData.description,
          furnishedStatus: 'Furnished', 
          amenities: pendingListingData.amenities,
          size: '2 BHK', 
          images: pendingListingData.images?.length ? pendingListingData.images.map((f: File) => URL.createObjectURL(f)) : ['https://placehold.co/600x400'],
          videoUrl: pendingListingData.videoFile ? URL.createObjectURL(pendingListingData.videoFile) : undefined,
          nocUrl: pendingListingData.noc ? URL.createObjectURL(pendingListingData.noc) : undefined,
          views: 0,
          ownerId,
          brokerStatus: pendingListingData.brokerStatus,
          lastAvailabilityCheck: new Date(),
      }
      setAllListings(prev => [mappedListing, ...prev]);
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
        completeAddress: pendingListingData.address,
        partialAddress: `${pendingListingData.locality}, ${pendingListingData.city}`,
        contactPhonePrimary: pendingListingData.phonePrimary,
        contactPhoneSecondary: pendingListingData.phoneSecondary,
        description: pendingListingData.description,
        preferences: [], 
        gender: pendingListingData.gender || 'Any',
        views: 0,
        ownerId,
        hasProperty: true, 
        images: pendingListingData.images?.length ? pendingListingData.images.map((f: File) => URL.createObjectURL(f)) : ['https://placehold.co/400x400'],
    }
      setAllRoommates(prev => [mappedRoommate, ...prev]);
    }
    setPendingListingData(null);
    toast({
      title: "Listing Submitted!",
      description: "Your property is now live.",
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
  
  const handleCheckAvailability = () => {
    toast({
      title: "Inquiry Sent!",
      description: "The owner has been notified of your availability request.",
    });
    // In a real app, this would trigger an API call to the owner.
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('setmystay_isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('setmystay_isLoggedIn');
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
    if (isLoggedIn) {
      setUnlockModalOpen(false);
      handleOpenConfirmationModal(plan.title, plan.price, () => handleUnlockPurchase(plan.plan, plan.title, plan.price));
    } else {
      setUnlockModalOpen(false);
      setAuthModalOpen(true);
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase a plan.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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
        setActivePage={setActivePage} 
        onSignInClick={() => setAuthModalOpen(true)}
        onSubscriptionClick={() => setUnlockModalOpen(true)}
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
            onNavigate={setActivePage}
            likedItemIds={likedItemIds}
            onToggleLike={handleToggleLike}
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
              pageTitle={
                activePage === 'my-properties' ? 'My Properties' :
                activePage === 'liked-properties' ? 'My Liked Properties' :
                undefined
              }
            />
        )}
        {activePage === 'list' && (
          <ListPropertySection onSubmit={handleInitiateListing} />
        )}
      </main>

      <Footer onNavigate={setActivePage} />
      <FloatingCta onGameClick={() => setIsSlotMachineModalOpen(true)} />
      <ContactFab />
      
      {/* Modals */}
      <PropertyDetails 
        listing={selectedItem?.type === 'listing' ? selectedItem.data as Listing : null}
        onClose={() => setSelectedItem(null)}
        isUnlocked={selectedItem?.data ? unlocks.unlockedIds.has(selectedItem.data.id) : false}
        onUnlock={handleUnlockClick}
        onChat={() => handleChat(selectedItem?.data?.ownerName || 'Owner')}
        onBookInquiry={handleBookInquiry}
        onCheckAvailability={handleCheckAvailability}
      />
      <RoommateDetails
        profile={selectedItem?.type === 'roommate' ? selectedItem.data as RoommateProfile : null}
        onClose={() => setSelectedItem(null)}
        isUnlocked={selectedItem?.data ? unlocks.unlockedIds.has(selectedItem.data.id) : false}
        onUnlock={handleUnlockClick}
        onChat={() => handleChat(selectedItem?.data?.ownerName || 'Roommate')}
      />
      <UnlockDetailsModal 
        isOpen={isUnlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onPlanSelect={handlePlanSelect}
        onNavigateToListProperty={() => {
          setUnlockModalOpen(false);
          setActivePage('list');
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
        onClose={() => setAuthModalOpen(false)}
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
        availableCoupons={dummyCoupons}
      />
      {isClient && (
        <SlotMachineModal
            isOpen={isSlotMachineModalOpen}
            onClose={() => setIsSlotMachineModalOpen(false)}
            prizes={dummyCoupons.filter(c => c.isActive)}
            onWin={handleCouponWin}
        />
      )}
    </div>
  );
}
