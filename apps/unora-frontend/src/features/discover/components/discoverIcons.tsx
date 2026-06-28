import {cn} from "@/lib/cn";

export function IconSearch({className}: {className?: string}) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M20 20l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSpark({className}: {className?: string}) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden>
      <path
        d="M12 3l1.2 4.2L17.4 9l-4.2 1.8L12 15l-1.2-4.2L6.6 9l4.2-1.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconX({className}: {className?: string}) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden>
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconHeart({
  filled,
  className,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      className={cn(className)}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden>
      {filled ? (
        <path
          d="M12 21s-6.2-4.35-8.2-8.2C2.25 9.5 4.5 6 8.2 6c1.85 0 3.55.9 4.55 2.35A5.45 5.45 0 0117.2 6c3.7 0 5.95 3.5 4.2 6.8C19.4 16.65 12 21 12 21z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M12 21s-6.2-4.35-8.2-8.2C2.25 9.5 4.5 6 8.2 6c1.85 0 3.55.9 4.55 2.35A5.45 5.45 0 0117.2 6c3.7 0 5.95 3.5 4.2 6.8C19.4 16.65 12 21 12 21z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function IconPin({className}: {className?: string}) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden>
      <path
        d="M12 21s6-5.33 6-10a6 6 0 10-12 0c0 4.67 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}
