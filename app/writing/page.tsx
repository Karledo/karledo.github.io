import pageData from "@/app/writing/page-data.json";
import { CornerUpLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writing",
  description: "A collection of thoughts and ideas.",
  alternates: {
    canonical: "/writing",
  },
};

type Page = {
  title: string;
  date: Date;
  slug: string;
};

function groupPagesByYear(pages: Page[]) {
  const years = Array.from(
    new Set(pages.map((page) => page.date.getFullYear())),
  ).toSorted((year, otherYear) => (year > otherYear ? -1 : 1));
  return years.map((year) => {
    return {
      year,
      pages: pages
        .filter((page) => page.date.getFullYear() == year)
        .toSorted((page, otherPage) => (page.date > otherPage.date ? -1 : 1)),
    };
  });
}

const pages: Page[] = pageData.map(({ title, date, slug }) => ({
  title,
  date: new Date(date),
  slug,
}));

export default async function Page() {
  const pagesGroupedByYear = groupPagesByYear(pages);

  return (
    <main className="mx-auto max-w-prose px-6 py-30">
      <div className="mb-7">
        <Link
          className="text-foreground-200 group hover:text-foreground-100 inline-flex items-center gap-x-1 text-sm transition-colors duration-300"
          href="/"
        >
          <CornerUpLeft
            size={"0.875rem"}
            className="group-hover:stroke-foreground-100 stroke-foreground-200 transition-colors duration-300"
          />
          Home
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {pagesGroupedByYear.map((group) => {
          return (
            <div key={group.year}>
              <span className="text-foreground-200 mb-3 block text-sm">
                {group.year}
              </span>
              <PageGroup pages={group.pages} />
            </div>
          );
        })}
      </div>
    </main>
  );
}

function PageGroup({ pages }: { pages: Page[] }) {
  return (
    <div className="group/wrapper divide-background-300 border-background-300 flex flex-col divide-y border-t">
      {pages.map((page) => {
        return (
          <Link
            key={page.slug}
            href={`/writing${page.slug}`}
            className="group/link flex items-center justify-between py-3"
          >
            <span className="group-hover/link:text-foreground-100! group-hover/wrapper:text-foreground-200 transition-colors duration-300">
              {page.title}
            </span>
            <span className="text-foreground-200 group-hover/link:text-foreground-200! group-hover/wrapper:text-background-300 text-sm transition-colors duration-300">{`${page.date.getDate()}/${page.date.getMonth() + 1}`}</span>
          </Link>
        );
      })}
    </div>
  );
}
