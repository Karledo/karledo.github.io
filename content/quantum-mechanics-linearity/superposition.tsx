"use client";

import { RefSlider } from "@/components/base-slider";
import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { Latex } from "@/components/latex";
import { StyledP5Container } from "@/components/p5-container";
import katex from "katex";

const phaseDifference = { current: 0 };
const amplitude1Scale = { current: 1 };
const amplitude2Scale = { current: 1 };

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);
};

const draw: Draw = ({ p }) => {
  p.clear();
  p.noStroke();

  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;
  const documentStyle = getComputedStyle(document.documentElement);
  const red = documentStyle.getPropertyValue("--visual-red");
  const blue = documentStyle.getPropertyValue("--visual-blue");
  const green = documentStyle.getPropertyValue("--visual-green");

  const drawGraph = (fn: (x: number) => number) => {
    for (let x = -halfWidth; x < halfWidth; x++) {
      const next = x + 1;
      p.line(x, fn(x / scale), next, fn(next / scale));
    }
  };

  const maxAmplitude = p.height * 0.2;
  const scale = 10;
  const amplitude1 = amplitude1Scale.current * maxAmplitude;
  const amplitude2 = amplitude2Scale.current * maxAmplitude;
  const timeScale = 3;

  const fn1 = Math.cos;
  const fn2 = Math.cos;

  const timeSeconds = p.millis() / 1000;
  p.push();
  p.translate(halfWidth, halfHeight);
  p.strokeWeight(p.width * 0.0025);
  p.stroke(red);
  drawGraph((x: number) => amplitude1 * fn1(x + timeSeconds * timeScale));
  p.stroke(blue);
  drawGraph((x: number) => amplitude2 * fn2(x + timeSeconds * timeScale + phaseDifference.current));
  p.stroke(green);
  drawGraph(
    (x: number) =>
      amplitude1 * fn2(x + timeSeconds * timeScale + phaseDifference.current) +
      amplitude2 * fn2(x + timeSeconds * timeScale),
  );
  p.pop();
};

const sketch = defaultSketch({ setup, draw });

export function Superposition() {
  const map = (value: number) => value / 5;
  const inverseMap = (value: number) => value * 5;
  const display = (value: number) => value.toFixed(2);

  return (
    <div>
      <StyledP5Container sketch={sketch} />
      <RefSlider
        sharedRef={phaseDifference}
        label={
          <span>
            Phase Difference, <Latex text="$\phi$" />
          </span>
        }
        min={0}
        max={2}
        step={0.01}
        map={(value) => value * Math.PI}
        inverseMap={(value) => value / Math.PI}
        display={(value) => `${value.toFixed(2)}${katex.renderToString(String.raw`\pi`)}`}
      />
      <RefSlider
        rangeStyle={{ backgroundColor: "var(--visual-red)" }}
        sharedRef={amplitude1Scale}
        label={
          <span>
            Amplitude, <Latex text="$A_1$" />
          </span>
        }
        min={0}
        max={5}
        step={0.01}
        map={map}
        inverseMap={inverseMap}
        display={display}
      />
      <RefSlider
        rangeStyle={{ backgroundColor: "var(--visual-blue)" }}
        sharedRef={amplitude2Scale}
        label={
          <span>
            Amplitude, <Latex text="$A_2$" />
          </span>
        }
        min={0}
        max={5}
        step={0.01}
        map={map}
        inverseMap={inverseMap}
        display={display}
      />
    </div>
  );
}
