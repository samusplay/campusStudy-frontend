type BookStackProps = {
  className?: string;
};

export function BookStack({ className }: BookStackProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <rect x="10" y="55" width="100" height="12" rx="2" />
      <rect x="18" y="40" width="84" height="12" rx="2" />
      <rect x="26" y="25" width="68" height="12" rx="2" />
    </svg>
  );
}