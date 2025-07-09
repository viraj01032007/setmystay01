
'use client';

import { useState } from 'react';
import { Plus, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// WhatsApp SVG Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor" {...props}>
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.044-.53-.044-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.12-.302.214-.64.214-1.017-.09-.645-.515-1.176-.82-1.176-.288 0-.6.056-.93.164-.214.072-1.23.486-1.43.486z M16 4.11c-6.557 0-11.887 5.33-11.887 11.887 0 2.09.545 4.068 1.518 5.748L4 29.99l6.027-1.58c1.6.903 3.49 1.43 5.53 1.43 6.557 0 11.887-5.33 11.887-11.888 0-6.557-5.33-11.887-11.887-11.887z" />
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
