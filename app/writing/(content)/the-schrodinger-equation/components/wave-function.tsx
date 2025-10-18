"use client";

import { defaultSketch, type Setup, type Draw } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import katex from "katex";
import P5 from "p5";

let axis: Record<string, P5.Element>;
let toggleCollapse = false;
let collapseX: number | undefined;

const setup: Setup = ({ p, renderer, containerStyle }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CORNERS);

  const axisNames = ["psi", "x"];
  axis = Object.fromEntries(
    axisNames.map((value) => {
      return [
        value,
        p
          .createP()
          .style("font-size", `${p.width * 0.0025}rem`)
          .style("color", containerStyle.color),
      ];
    }),
  );

  renderer.mousePressed(() => {
    toggleCollapse = true;
  });

  renderer.mouseReleased(() => {
    toggleCollapse = false;
  });

  renderer.mouseMoved((event: MouseEvent) => {
    collapseX = event.clientX - (renderer.elt as HTMLCanvasElement).getBoundingClientRect().x;
    console.log(collapseX);
  });
};

const gaussianFn = (x: number, a: number, b: number) => {
  return Math.exp(-(Math.pow(x - a, 2) / b));
};

const draw: Draw = ({ p }) => {
  p.clear();
  p.noStroke();

  const documentStyle = getComputedStyle(document.documentElement);
  const foreground = documentStyle.getPropertyValue("--foreground-100");
  const background = documentStyle.getPropertyValue("--background-300");

  const noiseHeight = p.height * 0.5;
  const seconds = p.millis() * 0.001;
  const noiseScale = 0.002;
  const timeScale = 0.3;

  axis.psi.position(p.width * 0.52, p.height * 0.01);
  axis.psi.style("font-size", `${p.width * 0.0015}rem`);
  katex.render(String.raw`\psi(x, t)^2`, axis.psi.elt);

  axis.x.style("font-size", `${p.width * 0.0015}rem`);
  axis.x.position(p.width * 0.97, p.height * 0.41);
  katex.render(String.raw`x`, axis.x.elt);

  const collapseFn = (x: number) => p.height * 0.4 * gaussianFn(x, collapseX!, 4);
  const normalWaveFunction = (x: number) => p.noise(x * noiseScale, seconds * timeScale) * noiseHeight;

  const fn = toggleCollapse && collapseX ? collapseFn : normalWaveFunction;

  p.stroke(background);
  p.strokeWeight(p.width * 0.004);
  p.line(0, p.height * 0.5, p.width, p.height * 0.5);
  p.line(p.width * 0.5, 0, p.width * 0.5, p.height);

  p.translate(0, p.height * 0.5);
  p.strokeWeight(p.width * 0.0025);
  p.stroke(foreground);
  for (let x = 0; x < p.width; x++) {
    p.line(x, -fn(x), x + 1, -fn(x + 1));
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
