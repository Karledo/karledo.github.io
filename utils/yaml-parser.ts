import matter from "gray-matter";

export function yamlParser(value: string) {
  return matter(`---\n${value}\n---`).data;
}
