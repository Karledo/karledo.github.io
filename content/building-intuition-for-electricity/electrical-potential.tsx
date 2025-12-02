"use client";

import {
  defaultSketchWebGL,
  DrawGL,
  SetupGL,
} from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";

const rows = 25;
const columns = 25;
const scale = 20;
const heights: number[][] = [];
const maxHeight = 200;

const setup: SetupGL = ({ p }) => {
  p.colorMode(p.HSL);
};

const draw: DrawGL = ({ p }) => {
  p.orbitControl();
  p.lights();
  p.clear();

  const documentStyle = getComputedStyle(document.documentElement);
  const foreground = documentStyle.getPropertyValue("--foreground-100");

  p.push();
  p.translate(-(columns * scale) / 2, 0, -(rows * scale) / 2);

  const timeSeconds = p.millis() / 1000;
  for (let x = 0; x < columns; x++) {
    heights[x] = [];
    for (let y = 0; y < rows; y++) {
      heights[x][y] =
        p.noise(x / columns + timeSeconds, y / rows + timeSeconds) * maxHeight;
    }
  }
  p.stroke(foreground);

  p.beginShape(p.LINES);
  for (let x = 0; x < columns - 1; x++) {
    for (let z = 0; z < rows; z++) {
      const height1 = heights[x][z];
      const height2 = heights[x + 1][z];
      p.vertex(x * scale, height1, z * scale);
      p.vertex((x + 1) * scale, height2, z * scale);
    }
  }
  p.endShape();

  p.beginShape(p.LINES);
  for (let x = 0; x < columns; x++) {
    for (let z = 0; z < rows - 1; z++) {
      const height1 = heights[x][z];
      const height2 = heights[x][z + 1];
      p.vertex(x * scale, height1, z * scale);
      p.vertex(x * scale, height2, (z + 1) * scale);
    }
  }
  p.endShape();

  p.pop();
};

const sketch = defaultSketchWebGL({ setup, draw });

export function ElectricalPotential() {
  return <StyledP5Container sketch={sketch} />;
}
