export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="#CDFF47" />
      {/* Kinetic "K" — an anatomical hinge */}
      <path
        d="M11 7v18"
        stroke="#0A0A0B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22 7L12 15.5L22 25"
        stroke="#0A0A0B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="15.5" r="2.4" fill="#0A0A0B" />
    </svg>
  );
}
