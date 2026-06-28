import type * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border px-2 py-1 text-xs font-semibold uppercase tracking-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
