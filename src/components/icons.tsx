
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="120" height="120" rx="20" fill="hsl(var(--primary))"/>
      <circle cx="60" cy="60" r="45" stroke="white" strokeWidth="1.5" fill="none"/>
      
      <g transform="translate(0, -8)">
        <ellipse cx="60" cy="78" rx="12" ry="3" fill="white" opacity="0.3"/>
        
        {/* Location Pin */}
        <path d="M60 32C49.507 32 41 40.507 41 51C41 65.5 60 78 60 78C60 78 79 65.5 79 51C79 40.507 70.493 32 60 32Z" fill="white"/>
        
        {/* House inside Pin (as cutout) */}
        <g fill="hsl(var(--primary))">
            <path d="M60 43.5L53 49.5V58.5H67V49.5L60 43.5Z"/>
            <rect x="55.5" y="52" width="4" height="4" rx="0.5"/>
            <rect x="60.5" y="52" width="4" height="4" rx="0.5"/>
        </g>
      </g>
      
      {/* Text "SetMyStay" */}
      <text 
        x="60" 
        y="100" 
        fontFamily="Inter, sans-serif" 
        fontSize="17" 
        fontWeight="500" 
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
