import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Blue rounded square background */}
      <rect width="48" height="48" rx="12" fill="#3B82F6"/>
      
      {/* White circle outline */}
      <circle cx="24" cy="24" r="17" stroke="white" strokeWidth="1.5" fill="none"/>

      {/* Location Pin with House */}
      <g transform="translate(0, -2)">
        <path d="M24 15C19.5817 15 16 18.5817 16 23C16 28.5 24 36 24 36C24 36 32 28.5 32 24C32 18.5817 28.4183 15 24 15Z" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M21 21H27V26H21V21Z" fill="white"/>
        <path d="M20 22L24 19L28 22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="22.25" y="22.25" width="1.5" height="1.5" fill="#3B82F6"/>
        <rect x="24.75" y="22.25" width="1.5" height="1.5" fill="#3B82F6"/>
      </g>
    </svg>
  );
}

export function LoadingSpinner({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
