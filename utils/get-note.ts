import { type MDXContent } from "next-mdx-remote-client";
import { type Metadata } from "next";

export async function getNote(slug: string) {
  const {
    default: Note,
    ...rest
  }: {
    default: MDXContent;
    frontmatter: Record<string, unknown>;
    metadata: Metadata | undefined;
  } = await import(`@/content/${slug}/page.mdx`);

  return { Note, ...rest };
}
