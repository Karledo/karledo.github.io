"use client";

import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { arrow, createText, grid } from "@/utils/sketch-utils";
import P5 from "p5";
import katex from "katex";

type Node = {
  timestamp: number;
  point: P5.Vector;
};

class Trail {
  p: P5;
  nodes: Node[];
  lifetime: number;

  constructor(p: P5, lifetime: number) {
    this.p = p;
    this.nodes = [];
    this.lifetime = lifetime;
  }

  addPoint(x: number, y: number) {
    const point = this.p.createVector(x, y);
    const timestamp = this.p.millis();
    const node: Node = { point, timestamp };
    this.nodes.push(node);
  }

  cullDeadPoints() {
    const aliveNodes: Node[] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      if (this.p.millis() - node.timestamp < this.lifetime) {
        aliveNodes.push(node);
      }
    }

    this.nodes = aliveNodes;
  }

  draw(baseColor: P5.Color) {
    const color = this.p.color(baseColor);
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const curr = this.nodes[i];
      const next = this.nodes[i + 1];
      const age = this.p.millis() - curr.timestamp;
      color.setAlpha(1 - age / this.lifetime);
      this.p.stroke(color);
      this.p.line(curr.point.x, curr.point.y, next.point.x, next.point.y);
    }
  }
}

let labels: Record<string, P5.Element>;
let trail: Trail;

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);
  labels = createText(p, "red", "blue", "green");

  trail = new Trail(p, 5000);
};

const draw: Draw = ({ p }) => {
  p.noStroke();
  p.clear();
  const spacing = p.width / 15;

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
  const frequency = 1 / 16;
  const sampleFrequency = 1 / 2;

  p.push();
  p.stroke(background3);
  grid(p, spacing);
  p.pop();

  const orientation = 2 * Math.PI * frequency * seconds;

  const point = p
    .createVector(1, 0)
    .rotate(orientation)
    .mult(p.noise(seconds * sampleFrequency) * spacing * 5);

  trail.addPoint(point.x, -point.y);
  trail.cullDeadPoints();
  p.push();
  p.strokeWeight(p.width * 0.0025);
  p.translate(halfWidth, halfHeight);
  trail.draw(p.color(foreground));
  p.pop();

  p.push();
  p.translate(halfWidth, halfHeight);
  p.strokeWeight(p.width * 0.0025);
  p.stroke(red);
  p.fill(red);
  arrow(p, 0, 0, point.x, 0);

  p.stroke(green);
  p.fill(green);
  arrow(p, point.x, 0, point.x, -point.y);

  p.stroke(blue);
  p.fill(blue);
  arrow(p, 0, 0, point.x, -point.y);
  p.pop();

  p.push();
  p.fill(foreground);
  p.circle(halfWidth, halfHeight, p.width * 0.01);
  p.pop();

  const textSide = point.dot(1, 0);

  labels.red.position(halfWidth + point.x / 2, p.height * 0.52);
  labels.red.style("color", red).style("font-size", fontSize);
  katex.render(String.raw`Acos(\omega t)`, labels.red.elt);

  const offset = (textSide < 0 ? -labels.green.elt.offsetWidth : 0) + Math.sign(textSide) * p.width * 0.015;
  labels.green.position(halfWidth + point.x + offset, halfHeight - point.y / 2);
  labels.green.style("color", green).style("font-size", fontSize);
  katex.render(String.raw`Bcos(\omega t)`, labels.green.elt);

  labels.blue.position(halfWidth + point.x / 2, halfHeight - point.y / 2);
  labels.blue.style("color", blue).style("font-size", fontSize);
  katex.render(String.raw`|z|`, labels.blue.elt);
};

const sketch = defaultSketch({ setup, draw });

export function AmplitudeTriangle() {
  return <StyledP5Container sketch={sketch} />;
}
