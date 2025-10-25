import Link from "next/link";
import fs from "fs";
import path from "path";
import { CornerUpLeft } from "lucide-react";
import { Metadata } from "next";
import { parseFrontmatter } from "@/utils/parse-frontmatter";

export const metadata: Metadata = {
  title: "Writing",
  description: "A collection of thoughts and ideas.",
  alternates: {
    canonical: "/writing",
  },
};

const getFiles = () => {
  const contentDir = path.join(process.cwd(), "app", "writing", "(content)");
  const dirnames = fs.readdirSync(contentDir, "utf-8").filter((dirname) => {
    const isDirectory = fs
      .statSync(path.join(contentDir, dirname))
      .isDirectory();
    const isRouteGroup = /^\(.*\)$/.test(dirname);
    return isDirectory && !isRouteGroup;
  });

  const files = dirnames.map((dirname) => {
    const { frontmatter } = parseFrontmatter(dirname);
    frontmatter.date ??= new Date();
    frontmatter.title ??= dirname;
    return { name: dirname, frontmatter };
  });

  return files;
};

const toGroups = <T, K extends string | number>(
  array: T[],
  getKey: (element: T) => K,
) => {
  const entries = Object.entries(
    array.reduce(
      (groups, data) => {
        const key = getKey(data);
        (groups[key] ??= []).push(data);
        return groups;
      },
      {} as Record<K, T[]>,
    ),
  ) as [K, T[]][];

  return entries.map(([group, data]) => ({ group, data }));
};

type Frontmatter = {
  title: string;
  date: Date;
};

type File = {
  name: string;
  frontmatter: Frontmatter;
};

export default async function Page() {
  const ungroupedFiles = getFiles() as File[];
  const files = toGroups(ungroupedFiles, (file) => {
    return file.frontmatter.date.getFullYear();
  });

  files.sort((a, b) => b.group - a.group);

  files.forEach(({ data: files }) => {
    files.sort(
      (a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime(),
    );
  });

  return (
    <main className="px- mx-auto max-w-prose py-30">
      <div className="mb-7">
        <Link
          className="text-foreground-200 group hover:text-foreground-100 inline-flex items-center gap-x-1 text-sm transition-colors duration-300"
          href="/"
        >
          <CornerUpLeft
            size="0.875rem"
            className="group-hover:stroke-foreground-100 stroke-foreground-200 transition-colors duration-300"
          />
          Home
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {files.map(({ group: year, data: files }) => {
          return (
            <div key={year}>
              <span className="text-foreground-200 mb-3 block text-sm">
                {year}
              </span>
              <FileGroup files={files} />
            </div>
          );
        })}
      </div>
    </main>
  );
}

function FileGroup({ files }: { files: File[] }) {
  return (
    <div className="group/wrapper divide-background-300 border-background-300 flex flex-col divide-y border-t">
      {files.map(({ name, frontmatter }) => {
        const day = frontmatter.date.getDate().toString().padStart(2, "0");
        const month = frontmatter.date.getMonth() + 1;
        const dateString = `${day}/${month}`;
        return (
          <Link
            key={name}
            href={`/writing/${name}`}
            className="group/link flex items-center justify-between py-3"
          >
            <span className="group-hover/link:text-foreground-100! group-hover/wrapper:text-foreground-200 transition-colors duration-300">
              {frontmatter.title}
            </span>
            <span className="text-foreground-200 group-hover/link:text-foreground-200! group-hover/wrapper:text-background-300 text-sm transition-colors duration-300">
              {dateString}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
