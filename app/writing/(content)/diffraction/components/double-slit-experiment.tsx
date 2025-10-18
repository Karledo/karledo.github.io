"use client";

import { defaultSketch, type Setup, type Draw } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { RefSlider } from "@/components/base-slider";
import { Latex } from "@/components/latex";
import { marque as whiteMask } from "@/utils/sketch-utils";
import P5 from "p5";

const slitSeperationRef = { current: 0.4 };
const gratingDistanceRef = { current: 0.25 };

const minimumSlitSeparationFactor = 0.05;
const maximumSlitSeparationFactor = 0.75;

const maximumGratingDistanceFactor = 0.75;
const minimumGratingDistanceFactor = 0.2;

let waveletA: P5.Graphics;
let waveletB: P5.Graphics;

const calculateMaximaDistance = (
  order: number,
  wavelength: number,
  distanceToScreen: number,
  slitDistanceFromGratingCentre: number,
) => {
  const klambdaSquared = order * order * wavelength * wavelength;
  const numerator =
    klambdaSquared *
    (klambdaSquared -
      4 * (slitDistanceFromGratingCentre * slitDistanceFromGratingCentre + distanceToScreen * distanceToScreen));
  const denominator = 4 * (klambdaSquared - 4 * slitDistanceFromGratingCentre * slitDistanceFromGratingCentre);
  return Math.sqrt(numerator / denominator);
};

const otherCalculateMaximaDistance = (
  wavelength: number,
  distanceFromGratingToScreen: number,
  distanceAlongScreen: number,
  slitDistanceFromCentre: number,
) => {
  const D = distanceFromGratingToScreen;
  const d = distanceAlongScreen;
  // const r = Math.sqrt(D * D + d * d);
  const lambda = wavelength;
  const x = slitDistanceFromCentre;
  const r = Math.sqrt(D * D + Math.pow(d - x, 2));

  const result = (Math.sqrt(r * r + 4 * d * x) - r) / lambda;
  // const result = (-r * lambda + Math.sqrt(lambda * (r * r + 4 * lambda * d * x))) / (lambda * lambda);

  return result;
};

const wavelet = (
  p: P5,
  x: number,
  y: number,
  radius: number,
  wavelength: number,
  speed: number,
  timeSeconds: number,
) => {
  p.push();
  p.noFill();

  const maxDistance = radius;
  const numWavelengths = Math.round(maxDistance / wavelength);

  for (let i = 1; i <= numWavelengths; i++) {
    const frac = i / numWavelengths;
    const distance = (maxDistance * frac + timeSeconds * speed) % maxDistance;
    p.circle(x, y, distance * 2);
  }

  p.pop();
};

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CORNERS);

  waveletA = p.createGraphics(p.width, p.height);
  waveletB = p.createGraphics(p.width, p.height);

  waveletA.colorMode(waveletA.HSL);
  waveletA.rectMode(waveletA.CORNERS);
  waveletB.colorMode(waveletB.HSL);
  waveletB.rectMode(waveletB.CORNERS);
};

const draw: Draw = ({ p, container }) => {
  p.clear();

  waveletA.clear();
  waveletB.clear();
  waveletA.resizeCanvas(p.width, p.height, true);
  waveletB.resizeCanvas(p.width, p.height, true);

  const style = window.getComputedStyle(container);
  const background = style.getPropertyValue("--background-300");
  const foreground = style.getPropertyValue("--foreground-100");
  const red = style.getPropertyValue("--visual-red");

  const halfHeight = p.height * 0.5;
  // const halfWidth = p.width * 0.5;

  const gratingDistance = p.width * gratingDistanceRef.current;
  const slitSeparation = p.height * slitSeperationRef.current;

  const screenDistance = p.width * 0.97;
  const screenThickness = p.width * 0.01;

  const slitGap = p.height * 0.075;
  const slitDistanceFromGratingCentre = (slitSeparation + slitGap) * 0.5;
  const firstSlitHeight = halfHeight - slitDistanceFromGratingCentre;
  const secondSlitHeight = halfHeight + slitDistanceFromGratingCentre;

  const wavespeed = p.width * 0.045;
  const wavelength = p.width * 0.0625;
  const seconds = p.millis() / 1000;

  const distanceFromGratingToScreen = screenDistance - gratingDistance;

  p.push();
  p.stroke(red);
  wavelet(p, 0, waveletA.height * 0.5, p.width, wavelength, wavespeed, seconds);
  whiteMask(p, 0, 0, gratingDistance, p.height);
  p.pop();

  waveletA.push();
  waveletA.stroke(red);
  wavelet(waveletA, gratingDistance, firstSlitHeight * 0.5, waveletA.width, wavelength, wavespeed, seconds);
  whiteMask(waveletA, gratingDistance, 0, screenDistance, p.height);
  waveletA.pop();

  p.image(waveletA, 0, 0);

  waveletB.push();
  waveletB.stroke(red);
  wavelet(waveletB, gratingDistance, secondSlitHeight, waveletB.width, wavelength, wavespeed, seconds);
  whiteMask(waveletB, gratingDistance, 0, screenDistance, p.height);
  waveletB.pop();

  p.image(waveletB, 0, 0);

  // Diffraction Grating
  p.push();
  p.stroke(foreground);
  p.strokeWeight(p.width * 0.007);
  p.translate(gratingDistance, 0);
  p.line(0, 0, 0, (p.height - slitSeparation) * 0.5 - slitGap);
  p.line(0, (p.height - slitSeparation) * 0.5, 0, (p.height + slitSeparation) * 0.5);
  p.line(0, (p.height + slitSeparation) * 0.5 + slitGap, 0, p.height);
  p.pop();

  // Screen
  p.push();
  p.noStroke();
  p.fill(background);
  p.rect(screenDistance, 0, screenDistance + screenThickness, p.height);
  p.pop();

  // Fringe Pattern
  p.push();
  p.strokeWeight(p.width * 0.0048);
  p.fill(red);
  p.translate(screenDistance, p.height * 0.5);

  const color = p.color(red);
  // const distanceBetweenOrders = calculateMaximaDistance(
  //   1,
  //   wavelength,
  //   distanceFromGratingToScreen,
  //   slitDistanceFromGratingCentre,
  // );
  // const firstMaximaDistance = otherCalculateMaximaDistance(0, wavelength, distanceFromGratingToScreen);

  // for (let i = -p.height * 0.5; i <= p.height * 0.5; i++) {
  //   const intensity = Math.pow(Math.cos((i * Math.PI) / distanceBetweenOrders), 4);
  //   color.setAlpha(intensity);
  //   p.stroke(color);
  //   p.line(-screenThickness * 0.5, i, screenThickness * 0.5, i);
  // }

  for (let d = 0; d <= p.height * 0.5; d++) {
    const n = otherCalculateMaximaDistance(wavelength, distanceFromGratingToScreen, d, slitDistanceFromGratingCentre);
    const intensity = Math.pow(Math.cos(Math.PI * (n - Math.round(n))), 2);
    color.setAlpha(intensity);
    p.stroke(color);
    p.line(0, d, screenThickness, d);
    p.line(0, -d, screenThickness, -d);
  }

  p.pop();
};

const sketch = defaultSketch({ setup, draw });

export function DoubleSlitExperiment() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
      <RefSlider
        sharedRef={slitSeperationRef}
        label={
          <span>
            Slit Seperation, <Latex text="$d$" />
          </span>
        }
        step={maximumSlitSeparationFactor * 0.01}
        defaultValue={[gratingDistanceRef.current]}
        min={minimumSlitSeparationFactor}
        max={maximumSlitSeparationFactor}
        display={(value) => `${(value * 100).toFixed(0)}%`}
      />
      <RefSlider
        sharedRef={gratingDistanceRef}
        label={
          <span>
            Grating Distance, <Latex text="$L$" />{" "}
          </span>
        }
        step={maximumGratingDistanceFactor * 0.01}
        defaultValue={[gratingDistanceRef.current]}
        min={minimumGratingDistanceFactor}
        max={maximumGratingDistanceFactor}
        display={(value) => `${(value * 100).toFixed(0)}%`}
      />
    </div>
  );
}
