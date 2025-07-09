
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { Listing, RoommateProfile, Page, ListingType, UnlockPlan, Bed } from "@/lib/types";
import { dummyProperties, dummyRoommates } from "@/lib/data";
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

type ToastInfo = {
    title: string;
    description: string;
    variant?: "default" | "destructive";
}

export default function Home() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [allRoommates, setAllRoommates] = useState<RoommateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState<Listing[]>([]);
  const [featuredRoommates, setFeaturedRoommates] = useState<RoommateProfile[]>([]);

  const [selectedItem, setSelectedItem] = useState<{ type: 'listing' | 'roommate'; data: Listing | RoommateProfile } | null>(null);
  const [isUnlockModalOpen, setUnlockModalOpen] = useState(false);
  const [isListPaymentModalOpen, setListPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [isRateUsModalOpen, setRateUsModalOpen] = useState(false);
  const [chattingWith, setChattingWith] = useState<string | null>(null);

  const [unlocks, setUnlocks] = useState({ count: 0, isUnlimited: false, unlockedIds: new Set<string>() });
  const [postPurchaseToast, setPostPurchaseToast] = useState<ToastInfo | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState<{ listing: Listing; bed: Bed } | null>(null);
  const [pendingListingData, setPendingListingData] = useState<any>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const shuffledListings = [...dummyProperties].sort(() => 0.5 - Math.random());
    const roommatesWithProperty = dummyRoommates.filter(r => r.hasProperty);
    const shuffledRoommates = [...roommatesWithProperty].sort(() => 0.5 - Math.random());
    
    setFeaturedProperties(shuffledListings.slice(0, 3));
    setFeaturedRoommates(shuffledRoommates.slice(0, 3));
    setAllListings(dummyProperties);
    setAllRoommates(dummyRoommates);
    setIsLoading(false);

    const savedCount = parseInt(localStorage.getItem('setmystay_unlocks') || '0');
    const savedIsUnlimited = localStorage.getItem('setmystay_isUnlimited') === 'true';
    const savedUnlockedIds = new Set<string>(JSON.parse(localStorage.getItem('setmystay_unlockedIds') || '[]'));
    setUnlocks({ count: savedCount, isUnlimited: savedIsUnlimited, unlockedIds: savedUnlockedIds });

    const loggedInStatus = localStorage.getItem('setmystay_isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleRateUsClose = (rated: boolean) => {
    setRateUsModalOpen(false);
    if (postPurchaseToast) {
        toast(postPurchaseToast);
        setPostPurchaseToast(null);
    }
  }

  const handleUnlockPurchase = useCallback((plan: UnlockPlan) => {
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
      
      setPostPurchaseToast({
        title: "Purchase Successful!",
        description: plan === 'unlimited' ? "You've subscribed to unlimited unlocks for one month." : `You've added ${plan} unlocks.`,
        variant: "default",
      });
      
      return newUnlocks;
    });
    setUnlockModalOpen(false);
    setRateUsModalOpen(true);
  }, []);

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

  const handleInitiateListing = (data: any) => {
    setPendingListingData(data);
    setListPaymentModalOpen(true);
  };

  const handleListProperty = () => {
    if (!pendingListingData) return;
    
    setListPaymentModalOpen(false);
    const newId = `new-${Date.now()}`;
    if ('propertyType' in pendingListingData && pendingListingData.propertyType !== 'Roommate') {
        const mappedListing: Listing = {
          id: newId,
          propertyType: pendingListingData.propertyType,
          title: pendingListingData.title,
          rent: pendingListingData.rent,
          area: 1200, 
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
          views: 0,
          ownerId: 'newUser',
          brokerStatus: pendingListingData.brokerStatus
      }
      setAllListings(prev => [mappedListing, ...prev]);
    } else {
       const mappedRoommate: RoommateProfile = {
        id: newId,
        propertyType: 'Roommate',
        ownerName: pendingListingData.ownerName,
        age: 30, 
        rent: pendingListingData.rent,
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
        ownerId: 'newUser',
        hasProperty: true, 
        images: pendingListingData.images?.length ? pendingListingData.images.map((f: File) => URL.createObjectURL(f)) : ['https://placehold.co/400x400'],
    }
      setAllRoommates(prev => [mappedRoommate, ...prev]);
    }
    setPendingListingData(null);
    setPostPurchaseToast({
      title: "Listing Submitted!",
      description: "Your property is now live.",
    });
    setRateUsModalOpen(true);
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
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <LoadingSpinner className="w-16 h-16 text-primary" />
        <p className="mt-4 text-lg font-semibold text-foreground">Loading SetMyStay...</p>
      </div>
    );
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
      />
      
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomeSection 
            featuredProperties={featuredProperties} 
            featuredRoommates={featuredRoommates.filter(r => r.hasProperty)} 
            onViewDetails={handleViewDetails}
            onNavigate={setActivePage}
          />
        )}
        {(activePage === 'pg' || activePage === 'rentals' || activePage === 'roommates') && (
            <ListingsSection
              key={activePage} // Re-mount component on page change
              type={activePage as ListingType}
              listings={
                activePage === 'roommates'
                  ? allRoommates.filter(r => r.hasProperty)
                  : allListings.filter(l => {
                      if (activePage === 'pg') return l.propertyType === 'PG';
                      if (activePage === 'rentals') return l.propertyType === 'Rental';
                      return false;
                    })
              }
              onViewDetails={handleViewDetails}
              initialSearchFilters={null}
            />
        )}
        {activePage === 'list' && (
          <ListPropertySection onSubmit={handleInitiateListing} />
        )}
      </main>

      <Footer onYourPropertiesClick={() => setAuthModalOpen(true)} onNavigate={setActivePage}/>
      <FloatingCta />
      
      {/* Modals */}
      <PropertyDetails 
        listing={selectedItem?.type === 'listing' ? selectedItem.data as Listing : null}
        onClose={() => setSelectedItem(null)}
        isUnlocked={selectedItem?.data ? unlocks.unlockedIds.has(selectedItem.data.id) : false}
        onUnlock={handleUnlockClick}
        onChat={() => handleChat(selectedItem?.data?.ownerName || 'Owner')}
        onBookInquiry={handleBookInquiry}
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
        onPurchase={handleUnlockPurchase}
        onNavigateToListProperty={() => {
          setUnlockModalOpen(false);
          setActivePage('list');
        }}
      />
      <ListPropertyPaymentModal
        isOpen={isListPaymentModalOpen}
        onClose={() => setListPaymentModalOpen(false)}
        onSubmit={handleListProperty}
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
    </div>
  );
}
