import Link from "next/link";
import fs from "fs/promises";
import path from "path";

async function getFileBasenames() {
  return (await fs.readdir("./content")).map((file) => {
    return path.basename(file, ".mdx");
  });
}

export default async function Page() {
  const fileBasenames = await getFileBasenames();

  return (
    <main className="mx-auto max-w-prose">
      <div className="flex flex-col gap-4 px-6 py-30">
        {fileBasenames.map((basename) => {
          return (
            <Link
              className="decoration-foreground-200 hover:decoration-foreground-100 underline underline-offset-3"
              key={basename}
              href={`/${basename}`}
            >
              {basename.charAt(0).toUpperCase() + basename.slice(1)}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
