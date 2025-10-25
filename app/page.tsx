import { Footer } from "@/components/footer";
import Link from "next/link";

export default async function Page() {
  return (
    <main className="mx-auto max-w-prose px-6 py-30">
      <div className="mb-7 space-y-7">
        <h1 className="text-foreground-100 mb-6">Karl Edochie</h1>
        <p>Driven by curiosity, building with logic, striving for novelty—always moving forward.</p>
      </div>
      <div className="mt-16 flex">
        <div className="flex aspect-square max-w-[calc(100%_/_3_-_2rem)] flex-col">
          <span className="text-foreground-200 mb-6 text-sm">Writing</span>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center">
              <Link href="/writing" className="link-underline">
                All writing
              </Link>
            </div>
            <p className="text-foreground-200">A collection of thoughts and ideas</p>
          </div>
        </div>
        <div></div>
        <div></div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
