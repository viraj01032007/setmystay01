import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="120" height="120" rx="24" fill="#4285F4"/>
        <circle cx="60" cy="50" r="40" stroke="white" strokeWidth="2.5"/>
        <g>
            <path d="M60 28C51.72 28 45 34.72 45 43C45 53.75 60 75 60 75C60 75 75 53.75 75 43C75 34.72 68.28 28 60 28Z" fill="#4285F4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <g stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M54 52V46H66V52"/>
                <path d="M52 46L60 41L68 46"/>
            </g>
        </g>
        <text x="60" y="105" fontFamily="Inter, sans-serif" fontWeight="bold" fontSize="16" fill="white" textAnchor="middle">SetMyStay</text>
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
