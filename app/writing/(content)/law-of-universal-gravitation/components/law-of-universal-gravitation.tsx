"use client";

import { defaultSketch, Setup, type Draw } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import P5Types from "p5";

const maxWidth = 641.52;

const sunDiameter = 50;
const planetDiameter = 25;
const sunMass = 100;

const planetMass = 1;

let planetPosition: P5Types.Vector;
let planetVelocity: P5Types.Vector;

let sunPosition: P5Types.Vector;

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);
  sunPosition = p.createVector(0, 0);
  planetPosition = p.createVector(-100, 0);
  planetVelocity = p.createVector(0, 300);
};

const draw: Draw = ({ p }) => {
  p.clear()
  p.noStroke();
  p.translate(p.width * 0.5, p.height * 0.5);

  const deltaTime = p.deltaTime / 1000;
  const impulseFactor = 1000;

  const documentStyle = getComputedStyle(document.documentElement)
  const gold = documentStyle.getPropertyValue("--visual-gold")
  const blue = documentStyle.getPropertyValue("--visual-blue")


  p.push();
  p.fill(gold);
  p.circle(sunPosition.x, sunPosition.y, sunDiameter);
  p.pop();

  const distance = planetPosition.dist(sunPosition);
  const force = lawOfGravitationalAttraction(planetMass, sunMass, distance);
  const direction = sunPosition.copy().sub(planetPosition).normalize();
  const forceVector = direction.copy().mult(force);

  if (p.mouseIsPressed) {
    const mousePosition = p.createVector(p.mouseX, p.mouseY);
    const directionToMouse = mousePosition.copy().sub(planetPosition);
    const impulseForce = directionToMouse.copy().setMag(impulseFactor);
    forceVector.add(impulseForce);
  }

  const acceleration = direction.copy().mult(forceVector.mag() / planetMass);

  planetVelocity.add(acceleration.x * deltaTime, acceleration.y * deltaTime);
  planetPosition.add(planetVelocity.x * deltaTime, planetVelocity.y * deltaTime);

  const boundaryDistance = (sunDiameter + planetDiameter) * 0.5;
  const isColliding = planetPosition.copy().sub(sunPosition).magSq() < boundaryDistance * boundaryDistance;
  if (isColliding) {
    const displacement = planetPosition.copy().sub(sunPosition);
    const boundaryDisplacement = displacement.copy().normalize().setMag(boundaryDistance);
    planetPosition.add(boundaryDisplacement.copy().sub(displacement));
  }

  const scalar = p.width / maxWidth;
  p.push();
  p.fill(blue);
  p.circle(planetPosition.x * scalar, planetPosition.y * scalar, planetDiameter);
  p.pop();
};

const sketch = defaultSketch({ draw, setup });

export function LawOfUniversalGravitation() {
  return <StyledP5Container sketch={sketch} />;
}

const GRAVITATIONAL_CONSTANT = 100000;
const lawOfGravitationalAttraction = (m1: number, m2: number, r: number) => {
  return (GRAVITATIONAL_CONSTANT * m1 * m2) / Math.max(1e-6, r * r);
};
