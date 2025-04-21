"use client";

import { useRef } from "react";
import { baseSketch, type Setup, type Draw } from "@/components/base-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { BaseSlider } from "@/components/base-slider";
import { Latex } from "@/components/latex";
import { marque } from "@/utils/p5-helper";
import P5Types from "p5";

const defaultSlitSeparationFactor = 0.4;
const minimumSlitSeparationFactor = 0.05;
const maximumSlitSeparationFactor = 0.75;
let slitSeparationFactor = defaultSlitSeparationFactor;

const defaultGratingDistanceFactor = 0.25;
const maximumGratingDistanceFactor = 0.75;
const minimumGratingDistanceFactor = 0.2;
let gratingDistanceFactor = defaultGratingDistanceFactor;

let waveletA: P5Types.Graphics;
let waveletB: P5Types.Graphics;

const setup: Setup = ({ p5, canvasWidth, canvasHeight }) => {
  p5.colorMode(p5.HSL);
  p5.rectMode(p5.CORNERS);
  waveletA = p5.createGraphics(canvasWidth, canvasHeight);
  waveletB = p5.createGraphics(canvasWidth, canvasHeight);

  waveletA.rectMode(p5.CORNERS);
  waveletB.rectMode(p5.CORNERS);
};

type EquationParams = {
  order: number;
  wavelength: number;
  distanceToScreen: number;
  slitDistanceFromGratingCentre: number;
};

const calculateMaximaDistance = ({
  order,
  wavelength,
  distanceToScreen,
  slitDistanceFromGratingCentre,
}: EquationParams) => {
  const klambdaSquared = order * order * wavelength * wavelength;
  const numerator =
    klambdaSquared *
    (klambdaSquared -
      4 * (slitDistanceFromGratingCentre * slitDistanceFromGratingCentre + distanceToScreen * distanceToScreen));
  const denominator = 4 * (klambdaSquared - 4 * slitDistanceFromGratingCentre * slitDistanceFromGratingCentre);
  return Math.sqrt(numerator / denominator);
};

type WaveletOptions = {
  p5: P5Types;
  x: number;
  y: number;
  radius: number;
  wavelength: number;
  waveSpeed: number;
  seconds: number;
  color: string;
};

const wavelet = ({ p5, x, y, wavelength, radius, waveSpeed, seconds, color }: WaveletOptions) => {
  p5.push();

  p5.noFill();
  p5.strokeWeight(p5.width * 0.0031);
  p5.stroke(color);

  const maxDistance = radius;
  const numWavelengths = p5.round(maxDistance / wavelength, 0);

  for (let i = 1; i <= numWavelengths; i++) {
    const frac = i / numWavelengths;
    const distance = (maxDistance * frac + seconds * waveSpeed) % maxDistance;
    p5.circle(x, y, distance * 2);
  }

  p5.pop();
};

const draw: Draw = ({ p5, parentStyle, canvasWidth, canvasHeight }) => {
  waveletA.resizeCanvas(canvasWidth, canvasHeight);
  waveletB.resizeCanvas(canvasWidth, canvasHeight);
  p5.clear();
  waveletA.clear();
  waveletB.clear();

  const gratingDistance = p5.width * gratingDistanceFactor;
  const slitSeparation = p5.height * slitSeparationFactor;
  const screenDistance = p5.width * 0.97;
  const slitGap = p5.height * 0.075;
  const screenThickness = p5.width * 0.01

  const seconds = p5.millis() * 0.001;
  const waveSpeed = p5.width * 0.045;
  const wavelength = p5.width * 0.0625;

  const distanceToScreen = screenDistance - gratingDistance;
  const slitDistanceFromGratingCentre = (slitSeparation + slitGap) * 0.5;

  const screenColor = parentStyle.getPropertyValue("--background-300");
  const diffractionGratingColor = parentStyle.getPropertyValue("--foreground-100");
  const waveletColor = parentStyle.getPropertyValue("--visual-red");

  waveletA.push();
  wavelet({
    p5: waveletA,
    x: 0,
    y: waveletA.height * 0.5,
    radius: p5.width,
    waveSpeed,
    wavelength,
    seconds,
    color: waveletColor,
  });
  marque({
    p5: waveletA,
    x1: 0,
    y1: 0,
    x2: gratingDistance,
    y2: p5.height,
  });
  waveletA.pop();

  waveletB.push();
  wavelet({
    p5: waveletB,
    x: gratingDistance,
    y: (p5.height - slitSeparation - slitGap) * 0.5,
    radius: p5.width,
    waveSpeed,
    wavelength,
    seconds,
    color: waveletColor,
  });
  wavelet({
    p5: waveletB,
    x: gratingDistance,
    y: (p5.height + slitSeparation + slitGap) * 0.5,
    radius: p5.width,
    waveSpeed,
    wavelength,
    seconds,
    color: waveletColor,
  });
  marque({
    p5: waveletB,
    x1: gratingDistance,
    y1: 0,
    x2: screenDistance,
    y2: p5.height,
  });
  waveletB.pop();

  p5.image(waveletA, 0, 0);
  p5.image(waveletB, 0, 0);

  // Diffraction Grating
  p5.push();
  p5.stroke(p5.color(diffractionGratingColor));
  p5.strokeWeight(p5.width * 0.0078);
  p5.translate(gratingDistance, 0);
  p5.line(0, 0, 0, (p5.height - slitSeparation) * 0.5 - slitGap);
  p5.line(0, (p5.height - slitSeparation) * 0.5, 0, (p5.height + slitSeparation) * 0.5);
  p5.line(0, (p5.height + slitSeparation) * 0.5 + slitGap, 0, p5.height);
  p5.pop();

  // Screen
  p5.push();
  p5.strokeWeight(screenThickness);
  p5.stroke(screenColor);
  p5.line(screenDistance, 0, screenDistance, p5.height);
  p5.pop();

  p5.push();
  p5.strokeWeight(p5.width * 0.0048)
  p5.fill(waveletColor);
  p5.translate(screenDistance, p5.height * 0.5);

  const color = p5.color(waveletColor)
  const distanceBetweenOrders = calculateMaximaDistance({ order: 1, wavelength, distanceToScreen, slitDistanceFromGratingCentre })
  for (let i = -p5.height * 0.5; i <= p5.height * 0.5; i++) {
    const intensity = p5.pow(p5.cos(i * p5.PI / distanceBetweenOrders), 4)
    color.setAlpha(intensity)
    p5.stroke(color)
    p5.line(-screenThickness * 0.5, i, screenThickness * 0.5, i)
  }

  p5.pop();
};

const sketch = baseSketch({ draw, setup });

export function DoubleSlitExperiment() {
  const slitSeparationDisplay = useRef<HTMLSpanElement>(null)
  const gratingDistanceDisplay = useRef<HTMLSpanElement>(null)

  return (
    <div>
      <StyledP5Container sketch={sketch} />
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4">
        <span>
          Slit Separation, <Latex text="$d$" />
        </span>
        <BaseSlider
          step={maximumSlitSeparationFactor * 0.01}
          min={minimumSlitSeparationFactor}
          max={maximumSlitSeparationFactor}
          defaultValue={[defaultSlitSeparationFactor]}
          onValueChange={([value]) => {
            slitSeparationFactor = value;
            if (slitSeparationDisplay.current) {
              slitSeparationDisplay.current.innerText = `${`${Math.round(value * 100)}`.padStart(2)}%`
            }
          }}
        />
        <span ref={slitSeparationDisplay} className="min-w-[5ch] tabular-nums">{`${Math.round(defaultSlitSeparationFactor * 100)}`.padStart(2)}%</span>
        <span>
          Grating Distance, <Latex text="$L$" />
        </span>
        <BaseSlider
          step={(maximumGratingDistanceFactor - minimumGratingDistanceFactor) * 0.01}
          min={minimumGratingDistanceFactor}
          max={maximumGratingDistanceFactor}
          defaultValue={[defaultGratingDistanceFactor]}
          onValueChange={([value]) => {
            gratingDistanceFactor = value;
            if (gratingDistanceDisplay.current) {
              gratingDistanceDisplay.current.innerText = `${`${Math.round(value * 100)}`.padStart(2)}%`
            }
          }}
        />
        <span ref={gratingDistanceDisplay} className="tabular-nums">{`${Math.round(defaultGratingDistanceFactor * 100)}`.padStart(2)}%</span>
      </div>
    </div >
  );
}
