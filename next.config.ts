import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { yamlParser } from "./utils/yaml-parser";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { parsers: { yaml: yamlParser } }],
    ],
  },
});

export default withMDX(nextConfig);
