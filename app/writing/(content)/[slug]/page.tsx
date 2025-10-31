import type { Metadata } from "next";
import { getNote } from "@/utils/get-note";
import { getNoteSlugs } from "@/utils/get-note-slugs";
import { type MDXContent } from "next-mdx-remote-client";

type Frontmatter = {
  title: string;
  description?: string;
  date: string;
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { Note } = (await getNote(slug)) as {
    Note: MDXContent;
    frontmatter: Frontmatter;
    metadata: Metadata | undefined;
  };

  return <Note />;
}

export async function generateStaticParams() {
  const slugs = (await getNoteSlugs()).map((slug) => ({ slug }));
  return [...slugs, { slug: "test" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter, metadata } = (await getNote(slug)) as {
    Note: MDXContent;
    frontmatter: Frontmatter;
    metadata: Metadata | undefined;
  };

  const generatedMetadata: Metadata = {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: `/${slug}`,
    },
  };

  if (metadata) {
    Object.assign(generatedMetadata, metadata);
  }

  return generatedMetadata;
}

export const dynamicParams = false;
