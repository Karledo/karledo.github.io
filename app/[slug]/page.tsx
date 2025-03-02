import fs from "fs/promises";
import path from "path";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { default: Post } = await import(`@/notes/${slug}.mdx`);

  return <Post />;
}

export async function generateStaticParams() {
  const slugs = (await fs.readdir("./notes")).map((file) => {
    return { slug: path.basename(file, ".mdx") };
  });
  return slugs;
}

export const dynamicParams = false;
