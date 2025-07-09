
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="60" cy="60" r="60" fill="#2A5A9A"/>
      <g transform="translate(0, -5)">
        {/* Shadow */}
        <ellipse cx="60" cy="73" rx="12" ry="3" fill="#FFFFFF" opacity="0.3"/>
        
        {/* Location Pin */}
        <path d="M60 20C46.7452 20 36 30.7452 36 44C36 61.6274 60 75 60 75C60 75 84 61.6274 84 44C84 30.7452 73.2548 20 60 20Z" fill="white"/>
        
        {/* House inside Pin */}
        <g transform="translate(0, -2)">
          <path d="M60 34L50 42V54H70V42L60 34Z" fill="#2A5A9A"/>
          <rect x="54" y="46" width="5" height="5" fill="white"/>
          <rect x="61" y="46" width="5" height="5" fill="white"/>
        </g>
      </g>
      
      {/* Text "SetMyStay" */}
      <text 
        x="60" 
        y="100" 
        fontFamily="Inter, sans-serif" 
        fontSize="17" 
        fontWeight="600" 
        fill="white" 
        textAnchor="middle"
        letterSpacing="0.2"
      >
        SetMyStay
      </text>
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
