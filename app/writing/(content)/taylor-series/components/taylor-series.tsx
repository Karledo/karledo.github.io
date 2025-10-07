"use client";

import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import P5 from "p5";
import katex from "katex";

const setup: Setup = ({ p, state }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CORNERS);

  const createStyledParagraph = () => {
    const paragraph = p.createP();
    paragraph.style("font-size", "1rem");
    return paragraph;
  };

  const equationNames = ["green", "blue", "red"];
  const equations = Object.fromEntries(
    equationNames.map((name) => {
      const paragraph = createStyledParagraph();
      return [name, paragraph];
    }),
  );

  const axisNames = ["x", "y", "halfPi"];
  const axis = Object.fromEntries(
    axisNames.map((value) => {
      const paragraph = createStyledParagraph();
      return [value, paragraph];
    }),
  );

  state.equations = equations;
  state.axis = axis;
};

const sinApprox = (x: number) => {
  return x - (x * x * x) / 6 + (x * x * x * x * x) / 120;
};

const moreAccurateSinApproximation = (x: number) => {
  return x - (x * x * x) / 6 + (x * x * x * x * x) / 120 - (x * x * x * x * x * x * x) / 5040;
};

const draw: Draw = ({ p, state }) => {
  p.clear();
  p.noStroke();

  const equations = state.equations as { [k: string]: P5.Element };
  const axis = state.axis as { [k: string]: P5.Element };
  const documentStyle = getComputedStyle(document.documentElement);

  const foreground = documentStyle.getPropertyValue("--foreground-100");
  const red = documentStyle.getPropertyValue("--visual-red");
  const green = documentStyle.getPropertyValue("--visual-green");
  const blue = documentStyle.getPropertyValue("--visual-blue");

  p.push();
  p.translate(p.width * 0.2, p.height * 0.5);
  p.strokeWeight(2);

  p.stroke(foreground);
  p.line(0, 0.5 * p.height, 0, 0.5 * -p.height);
  p.line(0, 0, p.width * 0.8, 0);

  const angularScale = 0.01;
  const amplitude = (100 / ((p.width * 9) / 16)) * p.height;

  p.stroke(red);
  for (let x = 0; x < p.width; x++) {
    const current = x * angularScale;
    const next = (x + 1) * angularScale;
    p.line(x, -p.sin(current) * amplitude, x + 1, -p.sin(next) * amplitude);
  }

  p.stroke(blue);
  for (let x = 0; x < p.width; x++) {
    const current = x * angularScale;
    const next = (x + 1) * angularScale;
    p.line(x, -sinApprox(current) * amplitude, x + 1, -sinApprox(next) * amplitude);
  }

  p.stroke(green);
  for (let x = 0; x < p.width; x++) {
    const current = x * angularScale;
    const next = (x + 1) * angularScale;
    p.line(
      x,
      -moreAccurateSinApproximation(current) * amplitude,
      x + 1,
      -moreAccurateSinApproximation(next) * amplitude,
    );
  }
  p.pop();

  axis.halfPi.position(p.width * 0.68, p.height * 0.5);
  axis.halfPi.style("color", foreground);
  katex.render(String.raw`\frac{\pi}{2}`, axis.halfPi.elt);

  axis.x.position(p.width * 0.97, p.height * 0.49);
  axis.x.style("color", foreground);
  katex.render(String.raw`x`, axis.x.elt);

  axis.y.position(p.width * 0.17, p.height * 0.0);
  axis.y.style("color", foreground);
  katex.render(String.raw`y`, axis.y.elt);

  equations.blue.position(p.width * 0.39, p.height * 0.06);
  equations.blue.style("color", blue);
  katex.render(String.raw`y = x - \frac{x^3}{3!} + \frac{x^5}{5!}`, equations.blue.elt);

  equations.green.position(p.width * 0.61, p.height * 0.8);
  equations.green.style("color", green);
  katex.render(String.raw`y = \frac{x^3}{3!} + \frac{x^5}{5!} + \frac{x^7}{7!}`, equations.green.elt);

  equations.red.position(p.width * 0.78, p.height * 0.39);
  equations.red.style("color", red);
  katex.render(String.raw`y = sin(x)`, equations.red.elt);
};

const sketch = defaultSketch({ draw, setup });

export function TaylorSeries() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
    </div>
  );
}
