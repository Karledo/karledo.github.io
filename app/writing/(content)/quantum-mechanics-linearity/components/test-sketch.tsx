"use client";

import { P5Container, type P5Sketch } from "@/components/p5-container";
import type { Renderer } from "p5";
import { useState } from "react";
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
  let canvas: Renderer;

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseFloat(parentStyle.width);
    canvasHeight = parseFloat(parentStyle.height);
    canvas = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    canvas.style(`width:${canvasWidth}`);
    canvas.style(`height:${canvasHeight}`);
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
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseFloat(parentStyle.width);
    canvasHeight = parseFloat(parentStyle.height);
    p5.resizeCanvas(canvasWidth, canvasHeight);
    p5.clear();
    p5.strokeWeight(0);

    const frequency = 1;
    const waveNumber = 8;
    const baseAmplitude = p5.height * 0.1;
    const resolution = 200;

    const angularWaveNumber = 2 * Math.PI * waveNumber;
    const angularFrequency = 2 * Math.PI * frequency;

    p5.fill("white");

    p5.strokeWeight(5);
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

export function TestSketch() {
  const [localPhaseDifference, setLocalPhaseDifference] = useState(
    defaultPhaseDifference,
  );
  const [localAmplitudeOne, setLocalAmplitudeOne] = useState(defaultAmplitude);
  const [localAmplitudeTwo, setLocalAmplitudeTwo] = useState(defaultAmplitude);

  const sliders = [
    {
      key: "amplitudeOne",
      onValueChange: ([value]: number[]) => {
        amplitudeOne = value;
        setLocalAmplitudeOne(value);
      },
      value: localAmplitudeOne,
      color: "#58C4DD",
    },
    {
      key: "amplitudeTwo",
      onValueChange: ([value]: number[]) => {
        amplitudeTwo = value;
        setLocalAmplitudeTwo(value);
      },
      value: localAmplitudeTwo,
      color: "#FC6255",
    },
  ];

  return (
    <div>
      <P5Container
        className="bg-background-200 relative mb-4 aspect-video h-full w-full rounded-xl"
        sketch={sketch}
      />
      <div className="flex items-center gap-x-4">
        <span className="min-w-36">
          Phase Difference, <Latex text="$\phi$" />
        </span>
        <Slider.Root
          min={0}
          max={2}
          defaultValue={[defaultAmplitude]}
          step={0.01}
          onValueChange={([value]) => {
            phaseDifference = value;
            setLocalPhaseDifference(value);
          }}
          className="group relative flex h-3 grow cursor-grab touch-none items-center transition-transform duration-300 select-none active:cursor-grabbing"
        >
          <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full transition-transform duration-300 group-hover:scale-y-150 group-active:scale-y-150">
            <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Root>
        <span className="min-w-12 tabular-nums">
          {localPhaseDifference}
          <Latex text="$\pi$" />
        </span>
      </div>

      {sliders.map((slider) => {
        return (
          <div key={slider.key} className="flex items-center gap-x-4">
            <span className="min-w-36">
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
                  style={{ backgroundColor: slider.color }}
                  className="absolute h-full rounded-full"
                />
              </Slider.Track>
              <Slider.Thumb />
            </Slider.Root>
            <span className="min-w-12 tabular-nums">{slider.value}</span>
          </div>
        );
      })}
    </div>
  );
}
