"use client";

import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { arrow } from "@/utils/sketch-utils";
import katex from "katex";
import { preloadFont } from "next/dist/server/app-render/entry-base";
import P5 from "p5";

type GridContext = {
  p: P5;
  width: number;
  height: number;
  spacing: number;
  gridColor: P5.Color;
};

class Grid {
  context: Partial<GridContext>;

  constructor(context: Partial<GridContext>) {
    this.context = context;
  }

  updateContext(newContext: Partial<GridContext>) {
    Object.assign(this.context, newContext);
  }

  draw() {
    const { p, spacing, gridColor } = this.context as GridContext;

    const halfWidth = p.width * 0.5;
    const halfHeight = p.height * 0.5;
    const gridLinesX = Math.round(halfWidth / spacing);
    const gridLinesY = Math.round(halfWidth / spacing);

    p.push();
    p.translate(halfWidth, halfHeight);
    p.stroke(gridColor);
    p.strokeWeight(p.width * 0.0031);

    for (let i = -gridLinesX; i <= gridLinesX; i++) {
      const x = i * spacing;
      p.line(x, -halfHeight, x, halfHeight);
    }

    for (let i = -gridLinesY; i <= gridLinesY; i++) {
      const y = i * spacing;
      p.line(-halfWidth, y, halfWidth, y);
    }

    p.pop();
  }
}

const grid = (p: P5, spacing: number) => {
  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;
  const gridLinesX = Math.round(halfWidth / spacing);
  const gridLinesY = Math.round(halfWidth / spacing);

  p.push();
  p.translate(halfWidth, halfHeight);

  for (let i = -gridLinesX; i <= gridLinesX; i++) {
    const x = i * spacing;
    p.line(x, -halfHeight, x, halfHeight);
  }

  for (let i = -gridLinesY; i <= gridLinesY; i++) {
    const y = i * spacing;
    p.line(-halfWidth, y, halfWidth, y);
  }

  p.pop();
};

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

  const spacing = p.width / 15;

  const documentStyle = getComputedStyle(document.documentElement);

  const background = documentStyle.getPropertyValue("--background-300");
  const red = documentStyle.getPropertyValue("--visual-red");
  const green = documentStyle.getPropertyValue("--visual-green");
  const blue = documentStyle.getPropertyValue("--visual-blue");

  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;

  p.push();
  p.strokeWeight(0.0015 * p.width);
  p.stroke(background);

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

  labels.red.style("font-size", "1.125rem").style("color", red);
  labels.red.position(p.width * 0.59, p.height * 0.53);
  katex.render(String.raw`\frac{1}{\sqrt{2}}`, labels.red.elt);

  labels.green.style("font-size", "1.125rem").style("color", green);
  labels.green.position(p.width * 0.73, p.height * 0.31);
  katex.render(String.raw`\frac{1}{\sqrt{2}}`, labels.green.elt);

  labels.blue.style("font-size", "1.125rem").style("color", blue);
  labels.blue.position(p.width * 0.57, p.height * 0.24);
  katex.render(String.raw`1`, labels.blue.elt);
};

const sketch = defaultSketch({ setup, draw });

export function SplittingWaveComponents() {
  return <StyledP5Container sketch={sketch} />;
}
