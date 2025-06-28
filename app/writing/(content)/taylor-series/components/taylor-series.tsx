"use client";

import { baseSketch, type Setup, type Draw } from "@/components/base-sketch";
import { StyledP5Container } from "@/components/p5-container";

const MAX_WIDTH = 641.52;
const setup: Setup = ({ p5 }) => {
  p5.colorMode(p5.HSL);
  p5.rectMode(p5.CORNERS);
};

const sinApprox = (x: number) => {
  return x - (x * x * x) / 6 + (x * x * x * x * x) / 120;
};

const draw: Draw = ({ p5 }) => {
  p5.clear();
  p5.noStroke();

  const documentStyle = getComputedStyle(document.documentElement);

  p5.push();
  p5.translate(p5.width * 0.2, p5.height * 0.5);
  p5.strokeWeight((2 * p5.width) / MAX_WIDTH);

  p5.stroke(documentStyle.getPropertyValue("--foreground-100"));
  p5.line(0, 0.5 * p5.height, 0, 0.5 * -p5.height);
  p5.line(0, 0, p5.width * 0.8, 0);

  p5.stroke(documentStyle.getPropertyValue("--visual-red"));
  const angularScale = 0.01;
  const amplitude = (100 / ((MAX_WIDTH * 9) / 16)) * p5.height;
  for (let x = 0; x < p5.width; x++) {
    const current = x * angularScale;
    const next = (x + 1) * angularScale;
    p5.line(x, -p5.sin(current) * amplitude, x + 1, -p5.sin(next) * amplitude);
  }

  p5.stroke(documentStyle.getPropertyValue("--visual-blue"));
  for (let x = 0; x < p5.width; x++) {
    const current = x * angularScale;
    const next = (x + 1) * angularScale;
    p5.line(x, -sinApprox(current) * amplitude, x + 1, -sinApprox(next) * amplitude);
  }
  p5.pop();

  p5.noStroke();
  p5.textFont("KaTeX_Math");
  p5.textSize((18 * p5.width) / MAX_WIDTH);

  p5.fill(documentStyle.getPropertyValue("--foreground-100"));
  p5.text("π/2", p5.width * 0.68, p5.height * 0.56);
  p5.text("x", p5.width * 0.97, p5.height * 0.55);
  p5.text("y", p5.width * 0.17, p5.height * 0.05);

  p5.fill(documentStyle.getPropertyValue("--visual-red"));
  p5.text("y = x - (1/3!)x^3 + (1/5!)x^5", p5.width * 0.66, p5.height * 0.85);
  p5.fill(documentStyle.getPropertyValue("--visual-blue"));
  p5.text("y = sin(x)", p5.width * 0.77, p5.height * 0.32);
};

const sketch = baseSketch({ draw, setup });

export function TaylorSeries() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
    </div>
  );
}
