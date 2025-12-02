import slugify from "slugify";
import { Link2Icon } from "@radix-ui/react-icons";
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
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => {
    const id = children
      ? slugify(children.toString(), { lower: true, remove: /[*+~.()'"!:@]/g })
      : undefined;
    const href = id ? `#${id}` : undefined;

    return (
      <h2 className="mt-14 font-medium">
        <a
          className="group inline-flex items-center gap-x-2"
          id={id}
          href={href}
        >
          <span>{children}</span>
          <Link2Icon className="text-foreground-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </a>
      </h2>
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
