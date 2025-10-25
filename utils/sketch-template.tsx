"use client";
import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import P5 from "p5";

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);
};

const draw: Draw = ({ p }) => {
  p.clear();

  const documentStyle = getComputedStyle(document.documentElement);
};

const sketch = defaultSketch({ setup, draw });

export function Component() {
  return <StyledP5Container sketch={sketch} />;
}
