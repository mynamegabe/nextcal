import * as React from "react";

import { cn } from "@/lib/utils";

// input element with suffix
const InputSuffix = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { suffix: React.ReactElement }
>(({ className, type, suffix, ...props }, ref) => {
  return (
    <div className="flex items-center gap-0 w-full">
      <input
        type={type}
        className={cn(
          "flex h-9 w-1/2 rounded-l-md border border-stone-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-stone-950 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-stone-800 dark:file:text-stone-50 dark:placeholder:text-stone-400 dark:focus-visible:ring-stone-300",
          className
        )}
        ref={ref}
        {...props}
      />
      {suffix}
    </div>
  );
});
InputSuffix.displayName = "InputSuffix";

export { InputSuffix };
