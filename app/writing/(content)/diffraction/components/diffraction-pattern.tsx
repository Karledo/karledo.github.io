"use client";

import { defaultSketch, type Setup, type Draw } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CORNERS);
};

const draw: Draw = ({ p }) => {
  p.clear();
  p.noStroke();

  const documentStyle = getComputedStyle(document.documentElement);
  const fringeColor = documentStyle.getPropertyValue("--visual-red");

  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;

  p.strokeWeight(Math.ceil(1 / p.width));
  const color = p.color(fringeColor);

  p.translate(halfWidth, halfHeight);
  for (let x = -halfWidth; x <= halfWidth; x++) {
    const frac = x / halfWidth;
    const intensity = p.pow(p.cos(x * 0.04), 4) * (1 - frac * frac);
    color.setAlpha(intensity);
    p.stroke(color);
    p.line(x, -halfHeight + p.height * 0, x, halfHeight);
  }
};

const sketch = defaultSketch({ draw, setup });

export function DiffractionPattern() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
    </div>
  );
}
