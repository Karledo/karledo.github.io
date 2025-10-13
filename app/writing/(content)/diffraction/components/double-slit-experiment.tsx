"use client";

import { useRef } from "react";
import { defaultSketch, type Setup, type Draw } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { BaseSlider } from "@/components/base-slider";
import { Latex } from "@/components/latex";
import { marque } from "@/utils/p5-helper";
import P5 from "p5";

const defaultSlitSeparationFactor = 0.4;
const minimumSlitSeparationFactor = 0.05;
const maximumSlitSeparationFactor = 0.75;
let slitSeparationFactor = defaultSlitSeparationFactor;

const defaultGratingDistanceFactor = 0.25;
const maximumGratingDistanceFactor = 0.75;
const minimumGratingDistanceFactor = 0.2;
let gratingDistanceFactor = defaultGratingDistanceFactor;

let waveletA: P5.Graphics;
let waveletB: P5.Graphics;

const setup: Setup = ({ p, width, height }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CORNERS);
  waveletA = p.createGraphics(width, height);
  waveletB = p.createGraphics(width, height);

  waveletA.rectMode(p.CORNERS);
  waveletB.rectMode(p.CORNERS);
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

interface WaveletParams {
  p: P5;
  x: number;
  y: number;
  radius: number;
  wavelength: number;
  waveSpeed: number;
  seconds: number;
  color: string;
};

const wavelet = ({ p, x, y, wavelength, radius, waveSpeed, seconds, color }: WaveletParams) => {
  p.push();

  p.noFill();
  p.strokeWeight(p.width * 0.0031);
  p.stroke(color);

  const maxDistance = radius;
  const numWavelengths = Math.round(maxDistance / wavelength);

  for (let i = 1; i <= numWavelengths; i++) {
    const frac = i / numWavelengths;
    const distance = (maxDistance * frac + seconds * waveSpeed) % maxDistance;
    p.circle(x, y, distance * 2);
  }

  p.pop();
};

const draw: Draw = ({ p, containerStyle, width, height }) => {
  waveletA.resizeCanvas(width, height);
  waveletB.resizeCanvas(width, height);
  p.clear();
  waveletA.clear();
  waveletB.clear();

  const gratingDistance = p.width * gratingDistanceFactor;
  const slitSeparation = p.height * slitSeparationFactor;
  const screenDistance = p.width * 0.97;
  const slitGap = p.height * 0.075;
  const screenThickness = p.width * 0.01;

  const seconds = p.millis() * 0.001;
  const waveSpeed = p.width * 0.045;
  const wavelength = p.width * 0.0625;

  const distanceToScreen = screenDistance - gratingDistance;
  const slitDistanceFromGratingCentre = (slitSeparation + slitGap) * 0.5;

  const screenColor = containerStyle.getPropertyValue("--background-300");
  const diffractionGratingColor = containerStyle.getPropertyValue("--foreground-100");
  const waveletColor = containerStyle.getPropertyValue("--visual-red");

  waveletA.push();
  wavelet({
    p: waveletA,
    x: 0,
    y: waveletA.height * 0.5,
    radius: p.width,
    waveSpeed,
    wavelength,
    seconds,
    color: waveletColor,
  });
  marque({
    p: waveletA,
    x1: 0,
    y1: 0,
    x2: gratingDistance,
    y2: p.height,
  });
  waveletA.pop();

  waveletB.push();
  wavelet({
    p: waveletB,
    x: gratingDistance,
    y: (p.height - slitSeparation - slitGap) * 0.5,
    radius: p.width,
    waveSpeed,
    wavelength,
    seconds,
    color: waveletColor,
  });
  wavelet({
    p: waveletB,
    x: gratingDistance,
    y: (p.height + slitSeparation + slitGap) * 0.5,
    radius: p.width,
    waveSpeed,
    wavelength,
    seconds,
    color: waveletColor,
  });
  marque({
    p: waveletB,
    x1: gratingDistance,
    y1: 0,
    x2: screenDistance,
    y2: p.height,
  });
  waveletB.pop();

  p.image(waveletA, 0, 0);
  p.image(waveletB, 0, 0);

  // Diffraction Grating
  p.push();
  p.stroke(p.color(diffractionGratingColor));
  p.strokeWeight(p.width * 0.0078);
  p.translate(gratingDistance, 0);
  p.line(0, 0, 0, (p.height - slitSeparation) * 0.5 - slitGap);
  p.line(0, (p.height - slitSeparation) * 0.5, 0, (p.height + slitSeparation) * 0.5);
  p.line(0, (p.height + slitSeparation) * 0.5 + slitGap, 0, p.height);
  p.pop();

  // Screen
  p.push();
  p.strokeWeight(screenThickness);
  p.stroke(screenColor);
  p.line(screenDistance, 0, screenDistance, p.height);
  p.pop();

  p.push();
  p.strokeWeight(p.width * 0.0048);
  p.fill(waveletColor);
  p.translate(screenDistance, p.height * 0.5);

  const color = p.color(waveletColor);
  const distanceBetweenOrders = calculateMaximaDistance({
    order: 1,
    wavelength,
    distanceToScreen,
    slitDistanceFromGratingCentre,
  });
  for (let i = -p.height * 0.5; i <= p.height * 0.5; i++) {
    const intensity = Math.pow(Math.cos((i * Math.PI) / distanceBetweenOrders), 4);
    color.setAlpha(intensity);
    p.stroke(color);
    p.line(-screenThickness * 0.5, i, screenThickness * 0.5, i);
  }

  p.pop();
};

const sketch = defaultSketch({ draw, setup });

export function DoubleSlitExperiment() {
  const slitSeparationDisplay = useRef<HTMLSpanElement>(null);
  const gratingDistanceDisplay = useRef<HTMLSpanElement>(null);

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
              slitSeparationDisplay.current.innerText = `${`${Math.round(value * 100)}`.padStart(2)}%`;
            }
          }}
        />
        <span ref={slitSeparationDisplay} className="min-w-[5ch] tabular-nums">
          {`${Math.round(defaultSlitSeparationFactor * 100)}`.padStart(2)}%
        </span>
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
              gratingDistanceDisplay.current.innerText = `${`${Math.round(value * 100)}`.padStart(2)}%`;
            }
          }}
        />
        <span ref={gratingDistanceDisplay} className="tabular-nums">
          {`${Math.round(defaultGratingDistanceFactor * 100)}`.padStart(2)}%
        </span>
      </div>
    </div>
  );
}
