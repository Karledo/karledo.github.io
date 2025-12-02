"use client";
import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { createParagraphs } from "@/utils/sketch-utils";
import katex from "katex";
import P5 from "p5";

const electronCount = 20;
let electronLabels: P5.Element[];

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CENTER);
  electronLabels = createParagraphs(p, electronCount);
};

class Electron {
  p: P5;

  constructor(p: P5) {
    this.p = p;
  }
}

const draw: Draw = ({ p }) => {
  p.noStroke();
  p.clear();

  const documentStyle = getComputedStyle(document.documentElement);
  const foreground = documentStyle.getPropertyValue("--foreground-100");
  const background3 = documentStyle.getPropertyValue("--background-300");
  const red = documentStyle.getPropertyValue("--visual-red");
  const green = documentStyle.getPropertyValue("--visual-green");
  const blue = documentStyle.getPropertyValue("--visual-blue");
  const fontSize = `${p.width * 0.025}px`;

  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;

  const seconds = p.millis() / 1000;

  p.translate(halfWidth, halfHeight);

  const electron = (x: number = 0, y: number = 0, id: number) => {
    p.push();
    p.noStroke();
    p.fill(red);
    p.circle(x, y, p.width * 0.04);
    const position = p.createVector(x, y);
    const label = electronLabels[id];
    katex.render(String.raw`-`, label.elt);
    const labelWidth = parseFloat(label.style("width"));
    const labelHeight = parseFloat(label.style("height"));
    label.position(position.x - labelWidth / 2, position.y - labelHeight / 2);
    p.pop();
  };

  const borderRadius = p.width * 0.006;
  p.push();
  p.fill(foreground);
  p.rect(
    0,
    -p.height * 0.3,
    p.width * 0.15,
    p.height * 0.12,
    borderRadius,
    borderRadius,
    borderRadius,
    borderRadius,
  );

  p.pop();

  p.push();
  p.stroke(foreground);
  p.noFill();
  p.rect(
    0,
    p.height * 0.05,
    p.width * 0.8,
    p.height * 0.7,
    borderRadius,
    borderRadius,
    borderRadius,
    borderRadius,
  );

  p.pop();
};

const sketch = defaultSketch({ setup, draw });

export function SeriesCircuit() {
  return <StyledP5Container sketch={sketch} />;
}
