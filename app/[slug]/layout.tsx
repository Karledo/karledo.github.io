import { Footer } from "@/components/footer";
import { Title } from "@/components/title";

export default async function Layout({
  children,
  params,
}: {
  children: Readonly<React.ReactNode>;
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <main className="mx-auto max-w-prose px-6 py-30">
      <Title
        className="mb-8"
        name={slug.charAt(0).toUpperCase() + slug.slice(1)}
        date={new Date(2024, 3, 18)}
      />
      {children}
      <Footer />
    </main>
  );
}
