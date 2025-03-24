import { pages } from "@/app/writing/page-data";

export function formatBasename(name: string) {
  return name
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getPageData(slug: string) {
  const pageData = pages.find((page) => {
    return page.slug == slug;
  });
  if (pageData == undefined) {
    throw Error(
      "Attempting to get the informatio of a page which does not exist",
    );
  }
  return pageData;
}
