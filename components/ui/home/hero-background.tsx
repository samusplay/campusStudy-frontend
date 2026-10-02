import { BookStack } from "@/components/ui/home/book-silhouette";

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden text-gray-400/6"
    >
      <BookStack className="absolute -top-6 -right-10 w-72 rotate-6 sm:w-96" />
      <BookStack className="absolute -bottom-7.5 left-[-20px] w-56 -rotate-3 sm:w-72" />
      <BookStack className="absolute top-1/2 right-1/4 w-40 rotate-12 opacity-60" />
    </div>
  );
}