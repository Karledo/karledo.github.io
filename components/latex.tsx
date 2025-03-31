import "katex/dist/katex.min.css";
import ReactLatexNext from "react-latex-next";

export function Latex({ text }: { text: string }) {
  return <ReactLatexNext>{text}</ReactLatexNext>;
}
