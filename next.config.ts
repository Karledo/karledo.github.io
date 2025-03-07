import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["mdx", "ts", "tsx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
