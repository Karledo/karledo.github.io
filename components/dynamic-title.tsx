"use client";
import type { ComponentPropsWithRef } from "react";
import { formatBasename, getPageData } from "@/utils/helper";

type TitleProps = {
  slug: string;
} & ComponentPropsWithRef<"div">;

export function DynamicTitle({ slug, ...props }: TitleProps) {
  const { title, date } = getPageData(slug);

  return (
    <div {...props}>
      <p className="font-medium">{formatBasename(title)}</p>
      <p className="text-foreground-200 text-sm">
        {date.toLocaleString("en-US", { month: "long" })} {date.getFullYear()}
      </p>
    </div>
  );
}
