"use client";

import { defaultSketch, type Setup, type Draw } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import katex from "katex";
import P5 from "p5";

const MAX_WIDTH = 641.52;
const setup: Setup = ({ p, containerStyle, state }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CORNERS);

  const axisNames = ["psi", "x"];
  const axis = Object.fromEntries(
    axisNames.map((value) => {
      return [value, p.createP().style("font-size", "1rem").style("color", containerStyle.color)];
    }),
  );

  state.axis = axis;
};

const draw: Draw = ({ p, state }) => {
  p.clear();
  p.noStroke();

  const axis = state.axis as { [k: string]: P5.Element };

  const documentStyle = getComputedStyle(document.documentElement);
  const foreground = documentStyle.getPropertyValue("--foreground-100");
  const background = documentStyle.getPropertyValue("--background-300");

  const noiseHeight = p.height * 0.5;
  const seconds = p.millis() * 0.001;
  const noiseScale = 0.002;
  const timeScale = 0.3;

  axis.psi.position(p.width * 0.52, p.height * 0.01);
  katex.render(String.raw`\psi(x, t)^2`, axis.psi.elt);

  axis.x.position(p.width * 0.97, p.height * 0.41);
  katex.render(String.raw`x`, axis.x.elt);

  p.stroke(background);
  p.strokeWeight((2 * p.width) / MAX_WIDTH);
  p.line(0, p.height * 0.5, p.width, p.height * 0.5);
  p.line(p.width * 0.5, 0, p.width * 0.5, p.height);

  p.translate(0, p.height * 0.5);
  p.strokeWeight((3 * p.width) / MAX_WIDTH);
  p.stroke(foreground);
  for (let x = 0; x < p.width; x++) {
    const noiseX = x * noiseScale;
    const nextNoiseX = (x + 1) * noiseScale;

    p.line(
      x,
      -p.noise(noiseX, seconds * timeScale) * noiseHeight,
      x + 1,
      -p.noise(nextNoiseX, seconds * timeScale) * noiseHeight,
    );
  }
};

const sketch = defaultSketch({ draw, setup });

export function WaveFunction() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
    </div>
  );
}
