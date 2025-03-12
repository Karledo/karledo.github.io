import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import { highlight } from "sugar-high";

const components: MDXComponents = {
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const className =
      "decoration-foreground-200 hover:decoration-foreground-100 underline underline-offset-3";
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const codeHTML = highlight(children as string);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
};

export function useMDXComponents(
  otherComponents: MDXComponents,
): MDXComponents {
  return {
    ...otherComponents,
    ...components,
  };
}
