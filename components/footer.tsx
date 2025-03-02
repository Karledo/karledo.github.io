import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="border-background-200 mt-10 border-t pt-10">
        <Link
          href="https://google.com"
          className="decoration-foreground-200 hover:decoration-foreground-100 underline underline-offset-3"
        >
          Google
        </Link>
      </div>
    </footer>
  );
}
