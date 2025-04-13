"use client";

import { StyledP5Container, type P5Sketch } from "@/components/p5-container";
import { Fragment, useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Latex } from "@/components/latex";

const defaultPhaseDifference = 0;
const defaultAmplitude = 1;
let phaseDifference = 0;
let amplitudeOne = defaultAmplitude;
let amplitudeTwo = defaultAmplitude;

const sketch: P5Sketch = (p5, parentRef) => {
  let time = 0;

  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseFloat(parentStyle.width);
    canvasHeight = parseFloat(parentStyle.height);
    const canvas = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    canvas.style("position: absolute");
    canvas.style("top: 0");
    canvas.style("left: 0");
    canvas.style("width: 100%");
    canvas.style("height: 100%");
  };

  function drawFunction(f: (x: number) => number, resolution: number) {
    for (let i = 0; i <= resolution; i++) {
      const frac = i / resolution;
      const nextFrac = Math.min(1, (i + 1) / resolution);

      const x1 = p5.width * frac;
      const x2 = p5.width * nextFrac;
      const y1 = f(x1);
      const y2 = f(x2);
      const halfHeight = p5.height * 0.5;
      p5.line(x1, halfHeight - y1, x2, halfHeight - y2);
    }
  }

  p5.draw = () => {
    parentStyle = getComputedStyle(parentRef);
    canvasWidth = parseFloat(parentStyle.width);
    canvasHeight = parseFloat(parentStyle.height);
    p5.resizeCanvas(canvasWidth, canvasHeight);
    p5.clear();
    p5.noStroke();

    const frequency = 1;
    const waveNumber = 8;
    const baseAmplitude = p5.height * 0.1;
    const resolution = 200;

    const angularWaveNumber = 2 * Math.PI * waveNumber;
    const angularFrequency = 2 * Math.PI * frequency;

    p5.fill("white");

    p5.strokeWeight(p5.width * 0.0078);
    p5.stroke("#58C4DD");
    time += p5.deltaTime / 1000;

    const waveFunctionOne = (x: number) =>
      baseAmplitude *
      amplitudeOne *
      p5.sin(
        (x / p5.width) * angularWaveNumber +
        angularFrequency * time +
        phaseDifference * p5.PI,
      );

    const waveFunctionTwo = (x: number) =>
      baseAmplitude *
      amplitudeTwo *
      p5.sin((x / p5.width) * angularWaveNumber + angularFrequency * time);

    drawFunction(waveFunctionOne, resolution);

    p5.stroke("#FC6255");
    drawFunction(waveFunctionTwo, resolution);

    p5.stroke("#83C167");
    drawFunction(
      (x: number) => waveFunctionOne(x) + waveFunctionTwo(x),
      resolution,
    );
  };
};

export function Superposition() {
  const phaseDifferenceDisplay = useRef<HTMLSpanElement>(null)
  const amplitudeDisplay1 = useRef<HTMLSpanElement>(null)
  const amplitudeDisplay2 = useRef<HTMLSpanElement>(null)

  const sliders = [
    {
      key: "amplitudeOne",
      onValueChange: ([value]: number[]) => {
        amplitudeOne = value;
        if (amplitudeDisplay1.current) {
          amplitudeDisplay1.current.innerText = `${value}`
        }
      },
      ref: amplitudeDisplay1,
      color: "blue",
    },
    {
      key: "amplitudeTwo",
      onValueChange: ([value]: number[]) => {
        amplitudeTwo = value;
        if (amplitudeDisplay2.current) {
          amplitudeDisplay2.current.innerText = `${value}`
        }
      },
      ref: amplitudeDisplay2,
      color: "red",
    },
  ];

  return (
    <div>
      <StyledP5Container
        sketch={sketch}
      />
      <div className="grid items-center grid-cols-[auto_1fr_auto] gap-x-4">
        <span>
          Phase Difference, <Latex text="$\phi$" />
        </span>
        <Slider.Root
          min={0}
          max={2}
          defaultValue={[defaultAmplitude]}
          step={0.01}
          onValueChange={([value]) => {
            phaseDifference = value;
            if (phaseDifferenceDisplay.current) {
              phaseDifferenceDisplay.current.innerText = `${value}`
            }
          }}
          className="group relative flex h-3 grow cursor-grab touch-none items-center transition-transform duration-300 select-none active:cursor-grabbing"
        >
          <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full transition-transform duration-300 group-hover:scale-y-150 group-active:scale-y-150">
            <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Root>
        <span className="min-w-[5ch]">
          <span ref={phaseDifferenceDisplay} className="tabular-nums">{defaultPhaseDifference}</span><Latex text="$\pi$" />
        </span>
        {sliders.map((slider) => {
          return (
            <Fragment key={slider.key}>
              <span>
                Amplitude, <Latex text="$A$" />
              </span>
              <Slider.Root
                min={0}
                max={3}
                defaultValue={[defaultAmplitude]}
                step={0.01}
                onValueChange={slider.onValueChange}
                className="group relative flex h-3 grow cursor-grab touch-none items-center transition-transform duration-300 select-none active:cursor-grabbing"
              >
                <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full transition-transform duration-300 group-hover:scale-y-150 group-active:scale-y-150">
                  <Slider.Range
                    style={{ backgroundColor: `var(--visual-${slider.color})` }}
                    className={`absolute h-full rounded-full`}
                  />
                </Slider.Track>
                <Slider.Thumb />
              </Slider.Root>
              <span ref={slider.ref} className="tabular-nums">{defaultAmplitude}</span>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
