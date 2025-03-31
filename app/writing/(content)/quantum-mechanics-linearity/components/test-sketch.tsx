"use client";

import { P5Container, type P5Sketch } from "@/components/p5-container";
import * as Slider from "@radix-ui/react-slider";
import { Renderer } from "p5";

const defaultFrequency = 1;
let frequency = defaultFrequency;

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

  function drawWave(
    waveNumber: number,
    frequency: number,
    amplitude: number,
    resolution: number,
  ) {
    const angularWaveNumber = 2 * p5.PI * waveNumber;
    const angularFrequency = 2 * p5.PI * frequency;

    for (let i = 0; i <= resolution; i++) {
      const frac = i / resolution;
      const nextFrac = Math.min(1, (i + 1) / resolution);

      const x1 = p5.width * frac;
      const x2 = p5.width * nextFrac;
      const y1 =
        amplitude * p5.sin(frac * angularWaveNumber + angularFrequency * time);
      const y2 =
        amplitude *
        p5.sin(nextFrac * angularWaveNumber + angularFrequency * time);
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

    const waveNumber = 8;
    const amplitude = p5.height * 0.1;
    const resolution = 200;
    // const angularWaveNumber = 2 * Math.PI * waveNumber;
    // const angularFrequency = 2 * Math.PI * frequency;

    p5.fill("white");

    p5.strokeWeight(5);
    p5.stroke("#58C4DD");
    time += p5.deltaTime / 1000;

    drawWave(waveNumber, frequency, amplitude * 1.5, resolution);
    p5.stroke("#FC6255");
    drawWave(waveNumber, frequency, amplitude * 2.5, resolution);
    p5.stroke("#83C167");
    drawWave(waveNumber, frequency, amplitude * 4, resolution);
  };
};

export function TestSketch() {
  return (
    <div>
      <P5Container
        className="bg-background-200 relative mb-4 aspect-video h-full w-full rounded-xl"
        sketch={sketch}
      />
      <Slider.Root
        min={0}
        max={10}
        defaultValue={[defaultFrequency]}
        step={0.01}
        onValueChange={([value]) => {
          frequency = value;
        }}
        className="group relative flex h-3 grow cursor-grab touch-none items-center transition-transform duration-300 select-none active:cursor-grabbing"
      >
        <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full transition-transform duration-300 group-hover:scale-y-150 group-active:scale-y-150">
          <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
        </Slider.Track>
        <Slider.Thumb className="bg-red aspect-square w-4" />
      </Slider.Root>
    </div>
  );
}
