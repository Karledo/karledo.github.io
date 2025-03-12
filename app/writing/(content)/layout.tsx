import { Footer } from "@/components/footer";
import { CornerUpLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://karledo.github.io/writing"),
};

export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="mx-auto max-w-prose px-6 py-30">
      <div className="mb-7">
        <Link
          className="text-foreground-200 group hover:text-foreground-100 inline-flex items-center gap-x-1 text-sm transition-colors duration-300"
          href="/writing"
        >
          <CornerUpLeft
            size={"0.875rem"}
            className="group-hover:stroke-foreground-100 stroke-foreground-200 transition-colors duration-300"
          />
          Back
        </Link>
      </div>
      {children}
      <Footer />
    </main>
  );
}
