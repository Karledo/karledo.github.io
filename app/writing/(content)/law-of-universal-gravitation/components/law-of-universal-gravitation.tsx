"use client";

import { defaultSketch, Setup, type Draw } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { colors } from "@/utils/colors";
import P5Types from "p5";

const maxWidth = 641.52;

const sunDiameter = 50;
const planetDiameter = 25;
const sunMass = 100;

const planetMass = 1;

let planetPosition: P5Types.Vector;
let planetVelocity: P5Types.Vector;

let sunPosition: P5Types.Vector;

const setup: Setup = ({ p: p5 }) => {
  p5.colorMode(p5.HSL);
  sunPosition = p5.createVector(0, 0);
  planetPosition = p5.createVector(-100, 0);
  planetVelocity = p5.createVector(0, 300);
};

const draw: Draw = ({ p: p5 }) => {
  p5.noStroke();
  p5.translate(p5.width * 0.5, p5.height * 0.5);
  const deltaTime = p5.deltaTime * 0.001;
  const impulseFactor = 1000;

  // Create sun
  p5.push();
  p5.fill(p5.color(colors.gold));
  p5.circle(sunPosition.x, sunPosition.y, sunDiameter);
  p5.pop();

  // Create planet
  const distance = planetPosition.dist(sunPosition);
  const force = lawOfGravitationalAttraction(planetMass, sunMass, distance);
  const direction = sunPosition.copy().sub(planetPosition).normalize();
  const forceVector = direction.copy().mult(force);

  if (p5.mouseIsPressed) {
    const mousePosition = p5.createVector(p5.mouseX, p5.mouseY);
    const directionToMouse = mousePosition.copy().sub(planetPosition);
    const impulseForce = directionToMouse.copy().setMag(impulseFactor);
    forceVector.add(impulseForce);
  }

  const acceleration = direction.copy().mult(forceVector.mag() / planetMass);

  planetVelocity.add(acceleration.x * deltaTime, acceleration.y * deltaTime);
  planetPosition.add(planetVelocity.x * deltaTime, planetVelocity.y * deltaTime);

  // Handle Collision
  const boundaryDistance = (sunDiameter + planetDiameter) * 0.5;
  const isColliding = planetPosition.copy().sub(sunPosition).magSq() < boundaryDistance * boundaryDistance;
  if (isColliding) {
    const displacement = planetPosition.copy().sub(sunPosition);
    const boundaryDisplacement = displacement.copy().normalize().setMag(boundaryDistance);
    planetPosition.add(boundaryDisplacement.copy().sub(displacement));
  }

  const scalar = p5.width / maxWidth;
  p5.push();
  p5.fill(p5.color(colors.blue));
  p5.circle(planetPosition.x * scalar, planetPosition.y * scalar, planetDiameter);
  p5.pop();
};

const sketch = defaultSketch({ draw, setup });

export function LawOfUniversalGravitation() {
  return <StyledP5Container sketch={sketch} />;
}

const GRAVITATIONAL_CONSTANT = 100000;
const lawOfGravitationalAttraction = (m1: number, m2: number, r: number) => {
  return (GRAVITATIONAL_CONSTANT * m1 * m2) / Math.max(1e-6, r * r);
};
