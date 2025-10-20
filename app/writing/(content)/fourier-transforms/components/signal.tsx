"use client";
import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import P5 from "p5";
import katex from "katex";

const axis: Record<string, P5.Element> = {};
const frequencies: number[] = [];
const n = 10;

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);

  const createParagraph = (key: string) => {
    const paragraph = p.createP();
    paragraph.style("font-size", "1rem");
    axis[key] = paragraph;
  };

  createParagraph("t");
  createParagraph("f");

  for (let i = 0; i < n; i++) {
    const frequency = Math.random() * 10;
    frequencies.push(frequency);
  }
};

const draw: Draw = ({ p }) => {
  p.clear();

  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;

  const fontSize = `${p.width * 0.025}px`;
  const documentStyle = getComputedStyle(document.documentElement);
  const background3 = documentStyle.getPropertyValue("--background-300");
  const foreground1 = documentStyle.getPropertyValue("--foreground-100");

  axis.t.position(p.width * 0.97, p.height * 0.42);
  axis.t.style("font-size", fontSize);
  katex.render(String.raw`t`, axis.t.elt);

  axis.f.position(p.width * 0.52, p.height * 0.01).style("font-size", "0.75rem");
  axis.f.style("font-size", fontSize);
  katex.render(String.raw`f(t)`, axis.f.elt);

  p.push();
  p.fill(background3);
  p.stroke(background3);
  p.strokeWeight(p.width * 0.0025);
  p.line(0, halfHeight, p.width, halfHeight);
  p.line(halfWidth, 0, halfWidth, p.height);
  p.pop();

  const f = (x: number) => {
    let result = 0;
    for (let i = 0; i < frequencies.length; i++) {
      result += Math.cos(frequencies[i] * 2 * Math.PI * x);
    }
    return result;
  };

  p.push();
  p.translate(halfWidth, halfHeight);
  p.strokeWeight(p.width * 0.0025);
  p.stroke(foreground1);
  const scale = 200;
  const max = p.height * 0.4;
  for (let curr = -halfWidth; curr < halfWidth; curr++) {
    const next = curr + 1;
    const currentF = -(max / n) * f(curr / scale);
    const nextF = -(max / n) * f(next / scale);
    p.line(curr, currentF, next, nextF);
  }
  p.pop();
};

const sketch = defaultSketch({ setup, draw });

export function Signal() {
  return <StyledP5Container sketch={sketch} />;
}
