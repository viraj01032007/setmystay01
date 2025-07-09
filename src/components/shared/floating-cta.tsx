
'use client';

import { useState } from 'react';
import { Plus, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// WhatsApp SVG Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.639a11.819 11.819 0 005.79 1.494h.006c6.556 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

export function FloatingCta() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
            {/* Action Buttons */}
            <div
                className={cn(
                    'flex flex-col items-center gap-3 transition-all duration-300 ease-in-out',
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                )}
            >
                <Link href="mailto:setmystay02@gmail.com" target="_blank" rel="noopener noreferrer">
                    <Button size="icon" className="rounded-full bg-slate-700 hover:bg-slate-800 text-white w-14 h-14 shadow-lg">
                        <Mail className="w-6 h-6" />
                        <span className="sr-only">Email Us</span>
                    </Button>
                </Link>
                <Link href="https://wa.me/918210552902" target="_blank" rel="noopener noreferrer">
                    <Button size="icon" className="rounded-full bg-[#25D366] hover:bg-[#1DAE52] text-white w-14 h-14 shadow-lg">
                        <WhatsAppIcon />
                        <span className="sr-only">WhatsApp Us</span>
                    </Button>
                </Link>
            </div>

            {/* Main Toggle Button */}
            <Button
                size="icon"
                className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Plus className={cn('w-8 h-8 transition-transform duration-300', isOpen && 'rotate-45 scale-0')} />
                <X className={cn('w-8 h-8 absolute transition-transform duration-300', !isOpen && '-rotate-45 scale-0')} />
                <span className="sr-only">Toggle Contact Options</span>
            </Button>
        </div>
    );
}
