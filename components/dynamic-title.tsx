import { getNote } from "@/utils/get-note";
import type { ComponentPropsWithRef } from "react";

export async function DynamicTitle({
  slug,
  ...props
}: { slug: string } & ComponentPropsWithRef<"div">) {
  const { frontmatter: rawFrontmatter } = await getNote(slug)
  const frontmatter = rawFrontmatter as { title: string, date: Date }

  const title = frontmatter.title;
  const date = frontmatter.date || new Date();

  return (
    <div {...props}>
      <h1 className="font-medium">{title}</h1>
      <p className="text-foreground-200 text-sm">
        {date.toLocaleString("en-US", { month: "long" })} {date.getFullYear()}
      </p>
    </div>
  );
}
