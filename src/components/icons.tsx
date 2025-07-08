import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary))"/>
          <stop offset="1" stopColor="hsl(var(--accent))"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#logo-gradient)"/>
      <path d="M14 34V18.2L24 14L34 18.2V34H14Z" fill="white" fillOpacity="0.2"/>
      <path d="M24 20L17 23.5V32H31V23.5L24 20Z" fill="hsl(var(--primary-foreground))"/>
      <path d="M20 28H28V30H20V28Z" fill="hsl(var(--primary))"/>
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
