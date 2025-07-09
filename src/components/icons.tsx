import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="120" height="120" rx="24" fill="#4582EF"/>
        <g transform="translate(0, -5)">
            <path d="M60 25C48.9543 25 40 33.9543 40 45C40 59.2494 60 85 60 85C60 85 80 59.2494 80 45C80 33.9543 71.0457 25 60 25Z" fill="white"/>
            <path d="M54 52V46H66V52" stroke="#4582EF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M52 46L60 41L68 46" stroke="#4582EF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <text x="60" y="108" fontFamily="Inter, sans-serif" fontWeight="bold" fontSize="18" fill="white" textAnchor="middle">SetMyStay</text>
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
