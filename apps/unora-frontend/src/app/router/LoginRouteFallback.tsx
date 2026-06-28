import {Skeleton} from "@/components/ui";

export function LoginRouteFallback() {
  return (
    <div
      className="flex flex-1 flex-col justify-center gap-app-4 px-app-6 py-app-12"
      aria-busy>
      <Skeleton className="mx-auto h-10 w-40 rounded-full" />
      <Skeleton className="mx-auto h-6 w-full max-w-[18rem]" />
      <Skeleton className="mx-auto mt-app-6 h-14 w-full max-w-[22rem] rounded-full" />
      <Skeleton className="mx-auto h-14 w-full max-w-[22rem] rounded-full" />
    </div>
  );
}
