import Link from "next/link";
import { CornerUpLeft } from "lucide-react";
import { Metadata } from "next";
import { getNoteSlugs } from "@/utils/get-note-slugs";
import { getNote } from "@/utils/get-note";

export const metadata: Metadata = {
  title: "Writing",
  description: "A collection of thoughts and ideas.",
  alternates: {
    canonical: "/writing",
  },
};

type Frontmatter = {
  title: string;
  date: Date;
};

type SlugAndFrontmatter = {
  slug: string;
  frontmatter: Frontmatter;
};

type Group = {
  group: number;
  data: SlugAndFrontmatter[];
};

const getSlugsAndFrontmatter = async () => {
  const slugs = await getNoteSlugs();
  const frontmatterList = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getNote(slug);
      return frontmatter as Frontmatter;
    }),
  );

  return slugs.map((slug, i) => {
    return { slug, frontmatter: frontmatterList[i] };
  });
};

const toGroups = <K extends string | number, T>(
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

const sortYearsMostRecent = (a: Group, b: Group) => b.group - a.group;
const sortContentMostRecent = (a: SlugAndFrontmatter, b: SlugAndFrontmatter) =>
  b.frontmatter.date.getTime() - a.frontmatter.date.getTime();
const groupByYear = ({ frontmatter }: { frontmatter: Frontmatter }) =>
  frontmatter.date.getFullYear();

export default async function Page() {
  const res = (await getSlugsAndFrontmatter()) as {
    slug: string;
    frontmatter: Frontmatter;
  }[];

  const dataGroupedByYear: Group[] = toGroups<number, SlugAndFrontmatter>(
    res,
    groupByYear,
  );

  dataGroupedByYear.sort(sortYearsMostRecent);
  dataGroupedByYear.forEach(({ data: files }) => {
    files.sort(sortContentMostRecent);
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
        {dataGroupedByYear.map(({ group: year, data: slugAndFrontmatter }) => {
          return (
            <div key={year}>
              <span className="text-foreground-200 mb-3 block text-sm">
                {year}
              </span>
              <FileGroup slugAndFrontmatter={slugAndFrontmatter} />
            </div>
          );
        })}
      </div>
    </main>
  );
}

function FileGroup({
  slugAndFrontmatter,
}: {
  slugAndFrontmatter: SlugAndFrontmatter[];
}) {
  return (
    <div className="group/wrapper divide-background-300 border-background-300 flex flex-col divide-y border-t">
      {slugAndFrontmatter.map(({ slug, frontmatter }) => {
        const day = frontmatter.date.getDate().toString().padStart(2, "0");
        const month = frontmatter.date.getMonth() + 1;
        const dateString = `${day}/${month}`;
        return (
          <Link
            key={slug}
            href={`/writing/${slug}`}
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
