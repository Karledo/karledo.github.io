"use client";
import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { createText } from "@/utils/sketch-utils";
import P5 from "p5";
import katex from "katex";
import { RefSlider } from "@/components/base-slider";
import { Latex } from "@/components/latex";

const omega = { current: 0.2 };
const n = 10;
const frequencies: number[] = [];
let axis: Record<string, P5.Element>;
let text: Record<string, P5.Element>;
let timestamp: number = 0;
let trig = Math.cos;

const f = (t: number) => {
  let result = 0;
  for (let i = 0; i < frequencies.length; i++) {
    result += Math.cos(frequencies[i] * 2 * Math.PI * t);
  }
  return result;
};

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);

  axis = createText(p, "y", "t");
  text = createText(p, "I", "trig", "f", "proj");

  for (let i = 0; i < n; i++) {
    frequencies.push(Math.random() * 10);
  }
};

const draw: Draw = ({ p }) => {
  p.clear();

  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;

  const documentStyle = getComputedStyle(document.documentElement);
  const background3 = documentStyle.getPropertyValue("--background-300");
  const foreground1 = documentStyle.getPropertyValue("--foreground-100");
  const blue = documentStyle.getPropertyValue("--visual-blue");
  const red = documentStyle.getPropertyValue("--visual-red");
  const green = documentStyle.getPropertyValue("--visual-green");
  const fontSize = `${p.width * 0.025}px`;

  axis.t.position(p.width * 0.97, p.height * 0.42);
  axis.t.style("font-size", fontSize);
  katex.render(String.raw`t`, axis.t.elt);

  axis.y.position(p.width * 0.52, p.height * 0.0);
  axis.y.style("font-size", fontSize);
  katex.render(String.raw`y`, axis.y.elt);

  p.push();
  p.fill(background3);
  p.stroke(background3);
  p.strokeWeight(p.width * 0.0025);
  p.line(0, halfHeight, p.width, halfHeight);
  p.line(halfWidth, 0, halfWidth, p.height);
  p.pop();

  p.push();
  p.translate(halfWidth, halfHeight);
  p.strokeWeight(p.width * 0.0025);

  let I = 0;

  if (p.millis() - timestamp > 5000) {
    timestamp = p.millis();
    trig = trig === Math.cos ? Math.sin : Math.cos;
  }

  const scale = p.width / 30;
  const signalScale = p.width * 1.5;

  const max = p.height * 0.4;
  const amplitude = max / n;

  for (let curr = -halfWidth; curr < halfWidth; curr++) {
    const next = curr + 1;

    const currF = f(curr / signalScale);
    const nextF = f(next / signalScale);
    const currTrig = trig(2 * Math.PI * omega.current * (curr / scale));
    const nextTrig = trig(2 * Math.PI * omega.current * (next / scale));

    const y1 = currF * currTrig;
    const y2 = nextF * nextTrig;
    p.push();
    p.stroke(foreground1);
    p.line(curr, -y1 * amplitude, next, -y2 * amplitude);
    p.pop();

    if (Math.round(curr) % Math.round(p.width * 0.01) === 0) {
      p.push();
      p.stroke(green);
      p.line(curr, 0, curr, -y1 * amplitude);
      p.pop();
    }

    p.push();
    p.stroke(red);
    p.line(curr, -currTrig * amplitude, next, -nextTrig * amplitude);
    p.pop();

    p.push();
    p.stroke(blue);
    p.line(curr, -currF * amplitude, next, -nextF * amplitude);
    p.pop();

    I += y1;
  }

  text.I.position(p.width * 0.04, p.height * 0.89);
  text.I.style("color", green);
  katex.render(String.raw`I = ${Math.round(I)}`, text.I.elt);

  text.trig.position(p.width * 0.83, p.height * 0.02);
  text.trig.style("color", red).style("font-size", fontSize);
  katex.render(String.raw`y = ${trig === Math.cos ? "cos" : "sin"}(\omega t)`, text.trig.elt);

  text.f.position(p.width * 0.87, p.height * 0.09);
  text.f.style("color", blue).style("font-size", fontSize);
  katex.render(String.raw`y = f(t)`, text.f.elt);

  text.proj.position(p.width * 0.79, p.height * 0.17);
  text.proj.style("color", foreground1).style("font-size", fontSize);
  katex.render(String.raw`y = f(t)${trig === Math.cos ? "cos" : "sin"}(\omega t)`, text.proj.elt);

  p.pop();
};

const sketch = defaultSketch({ setup, draw });

export function Projection() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
      <RefSlider
        sharedRef={omega}
        label={
          <span>
            Omega, <Latex text="$\omega$" />
          </span>
        }
        min={0}
        step={0.01}
        max={5}
        map={(value) => value / 5}
        inverseMap={(value) => value * 5}
        display={(value) => value.toFixed(2).toString()}
      />
    </div>
  );
}
