import type { MDXComponents } from "mdx/types";
import { ComponentPropsWithoutRef } from "react";
import { highlight } from "sugar-high";

const components: MDXComponents = {
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const codeHTML = highlight(children as string);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
};

export function useMDXComponents(
  otherComponents: MDXComponents
): MDXComponents {
  return {
    ...otherComponents,
    ...components,
  };
}
