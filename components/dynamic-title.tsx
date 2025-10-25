import type { ComponentPropsWithRef } from "react";
import { parseFrontmatter } from "@/utils/parse-frontmatter";

type TitleProps = {
  slug: string;
} & ComponentPropsWithRef<"div">;

export function DynamicTitle({ slug, ...props }: TitleProps) {
  const { frontmatter } = parseFrontmatter(slug)
  const title = frontmatter.title
  const date = frontmatter.date

  return (
    <div {...props}>
      <p className="font-medium">{title}</p>
      <p className="text-foreground-200 text-sm">
        {date.toLocaleString("en-US", { month: "long" })} {date.getFullYear()}
      </p>
    </div>
  );
}
