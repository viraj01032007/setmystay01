import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="48" height="48" rx="12" fill="#4582EF"/>
      <g stroke="white" strokeWidth="2">
        <path 
          d="M24 14C19.5817 14 16 17.5817 16 22C16 28.35 24 38 24 38C24 38 32 28.35 32 22C32 17.5817 28.4183 14 24 14Z" 
          fill="#4582EF" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M21 26V21H27V26" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M20 22L24 18L28 22" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
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
