import { DynamicTitle } from "@/components/dynamic-title";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <DynamicTitle className="mb-7" slug={slug} />
      <article className="space-y-7 mb-7">{children}</article>
    </div>
  );
}
