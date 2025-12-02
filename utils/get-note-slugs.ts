import { promises as fs } from "fs";
import path from "path";

export async function getNoteSlugs() {
  const noteDirectory = path.join(process.cwd(), "content")
  const slugs = (await fs.readdir(noteDirectory, "utf-8"))
    .filter(async (slug) => {
      const note = await fs.stat(path.join(noteDirectory, slug))
      return note.isDirectory()
    });

  return slugs
}

