export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <defs>
          <linearGradient id="acutio-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6366f1" />
            <stop offset="0.55" stopColor="#a855f7" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#acutio-g)" />
        <path d="M9.5 23 15 9h2l5.5 14h-3.1l-1.2-3.2h-4.4L12.6 23H9.5Zm4.7-5.8h3.2L15.8 13l-1.6 4.2Z" fill="#fff" />
      </svg>
      <span className="text-xl text-gray-900">Acutio</span>
    </span>
  );
}
