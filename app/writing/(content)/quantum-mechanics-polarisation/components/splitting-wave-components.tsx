"use client";

import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { arrow, grid } from "@/utils/sketch-utils";
import katex from "katex";
import P5 from "p5";

const labels: { [k: string]: P5.Element } = {};
const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);

  const arrowLabelNames = ["green", "red", "blue"];
  for (let i = 0; i < arrowLabelNames.length; i++) {
    const key = arrowLabelNames[i];
    labels[key] = p.createP();
  }
};

const draw: Draw = ({ p }) => {
  p.clear();
  p.noStroke();

  const spacing = p.width / 15;

  const documentStyle = getComputedStyle(document.documentElement);

  const background3 = documentStyle.getPropertyValue("--background-300");
  const foreground1 = documentStyle.getPropertyValue("--foreground-100");
  const red = documentStyle.getPropertyValue("--visual-red");
  const green = documentStyle.getPropertyValue("--visual-green");
  const blue = documentStyle.getPropertyValue("--visual-blue");
  const fontSize = `${p.width * 0.025}px`;

  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;

  p.push();
  p.strokeWeight(0.0015 * p.width);
  p.stroke(background3);

  grid(p, spacing);

  p.strokeWeight(p.width * 0.004);

  p.stroke(blue);
  p.fill(blue);
  arrow(p, halfWidth, halfHeight, halfWidth + spacing * 3, halfHeight - spacing * 3);

  p.stroke(red);
  p.fill(red);
  arrow(p, halfWidth, halfHeight, halfWidth + spacing * 3, halfHeight);

  p.stroke(green);
  p.fill(green);
  arrow(p, halfWidth + spacing * 3, halfHeight, halfWidth + spacing * 3, halfHeight - spacing * 3);
  p.pop();

  p.push();
  p.fill(foreground1);
  p.circle(halfWidth, halfHeight, p.width * 0.01);
  p.pop();

  labels.red.style("font-size", fontSize).style("color", red);
  labels.red.position(p.width * 0.59, p.height * 0.53);
  katex.render(String.raw`\frac{1}{\sqrt{2}}`, labels.red.elt);

  labels.green.style("font-size", fontSize).style("color", green);
  labels.green.position(p.width * 0.73, p.height * 0.31);
  katex.render(String.raw`\frac{1}{\sqrt{2}}`, labels.green.elt);

  labels.blue.style("font-size", fontSize).style("color", blue);
  labels.blue.position(p.width * 0.57, p.height * 0.24);
  katex.render(String.raw`1`, labels.blue.elt);
};

const sketch = defaultSketch({ setup, draw });

export function SplittingWaveComponents() {
  return <StyledP5Container sketch={sketch} />;
}
