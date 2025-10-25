import fs from "fs"
import path from "path"
import matter from "gray-matter"

export const parseFrontmatter = (slug: string) => {
  const source = fs.readFileSync(path.join(process.cwd(), "app", "writing", "(content)", slug, "page.mdx"))
  const { data: frontmatter, ...rest } = matter(source)
  return { ...rest, frontmatter }
}
