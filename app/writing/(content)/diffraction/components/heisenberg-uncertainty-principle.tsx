"use client";

import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { arrow } from "@/utils/sketch-utils";
import P5 from "p5";
import katex from "katex";

let labels: {
  [k: string]: P5.Element;
};

let initialVelocity: P5.Vector;
let diameter: number;

const alpha = 0.1;
const photonCount = 2;
const ghostPhotonCount = 5;
const photons: Photon[] = [];

const zigzagIndex = (k: number) => {
  return Math.pow(-1, k + 1) * Math.floor((k + 1) / 2);
};

class Photon {
  p: P5;
  position: P5.Vector;
  velocity: P5.Vector;
  diameter: number;

  pastGrating: boolean;
  collapsed: boolean;

  constructor(p: P5, position: P5.Vector, velocity: P5.Vector, diameter: number) {
    this.p = p;
    this.position = position;
    this.velocity = velocity;
    this.diameter = diameter;

    this.pastGrating = false;
    this.collapsed = false;
  }

  drawUncertainty(count: number, spacing: number) {
    for (let i = 0; i < count; i++) {
      this.p.circle(this.position.x, this.position.y + zigzagIndex(i) * spacing, this.diameter);
    }
  }

  drawPhoton() {
    this.p.circle(this.position.x, this.position.y, this.diameter);
  }
}

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);

  initialVelocity = p.createVector(p.width * 0.3, 0);
  diameter = p.width * 0.03;

  for (let i = 0; i < photonCount; i++) {
    const position = p.createVector(0, 0);
    const velocity = p.createVector(p.width * 0.2, 0);
    const photon = new Photon(p, position, velocity, diameter);
    photons.push(photon);
  }

  const labelIdentifiers = ["deltaX1", "deltaX2", "deltaP1", "deltaP2"];
  labels = Object.fromEntries(
    labelIdentifiers.map((identifier) => {
      const paragraph = p.createP();
      paragraph.style("font-size: 1rem");
      return [identifier, paragraph];
    }),
  );
};

const draw: Draw = ({ p }) => {
  p.clear();
  p.noStroke();

  const seconds = p.millis() * 0.001;
  const deltaTimeSeconds = p.deltaTime / 1000;
  const documentStyle = getComputedStyle(document.documentElement);
  const foreground = documentStyle.getPropertyValue("--foreground-100");
  const gold = documentStyle.getPropertyValue("--visual-gold");
  const green = documentStyle.getPropertyValue("--visual-green");

  // Style
  const strokeWeight = p.width * 0.005;
  // Sizes

  const slitGap = p.height * 0.25;
  const slitSeparation = p.height * 0.1;
  const gratingDistance = p.width * 0.5;

  // Count
  const ghostPhotonSpacing = diameter / 2;
  const firstSlitHeight = (p.height - slitSeparation - slitGap) * 0.5;
  const secondSlitHeight = (p.height + slitSeparation + slitGap) * 0.5;

  initialVelocity.set(p.width * 0.3, 0);
  diameter = p.width * 0.03;

  for (let i = 0; i < photons.length; i++) {
    const j = zigzagIndex(i + 1);
    const y = p.height * 0.5 + j * (slitSeparation + slitGap) * 0.5;
    const photon = photons[i];

    photon.velocity.x = p.width * 0.3;
    photon.position.x += photon.velocity.x * deltaTimeSeconds;
    photon.position.y += photon.velocity.y * deltaTimeSeconds;

    const radius = photon.diameter / 2;

    if (
      photon.position.x < radius ||
      photon.position.x > p.width - radius ||
      photon.position.y < radius ||
      photon.position.y > p.height - radius
    ) {
      photon.position.x = radius;
      photon.position.y = p.height * 0.5 + j * (slitSeparation + slitGap) * 0.5;
      photon.velocity.set(initialVelocity);
      photon.pastGrating = false;
      photon.collapsed = false;
    }

    if (photon.position.x > gratingDistance) {
      photon.pastGrating = true;
    }

    if (photon.pastGrating && !photon.collapsed) {
      photon.collapsed = true;
      const k = zigzagIndex(Math.floor(Math.random() * (ghostPhotonCount + 1)));
      photon.position.y = y + k * ghostPhotonSpacing;
      const ySpeed = p.height * 0.2;
      photon.velocity.y = -ySpeed + Math.random() * 2 * ySpeed;
    }

    if (photon.collapsed) {
      p.push();
      p.fill(gold);
      photon.drawPhoton();
      p.pop();
    } else {
      p.push();
      const color = p.color(gold);
      color.setAlpha(0.2);
      p.fill(color);
      photon.drawUncertainty(ghostPhotonCount, ghostPhotonSpacing);
      p.pop();
    }
  }

  const photonUncertaintyArrow = (height: number, element: P5.Element) => {
    p.push();
    p.translate(gratingDistance, height);
    p.strokeWeight(strokeWeight);
    p.fill(gold);
    p.stroke(gold);
    arrow(p, -p.width * 0.025, slitGap * 0.5, -p.width * 0.025, -slitGap * 0.5, undefined, true);
    p.pop();

    element.position(gratingDistance - p.width * 0.1, height - p.height * 0.06);
    element.style("color", gold);
    katex.render(String.raw`\Delta x`, element.elt);
  };

  photonUncertaintyArrow(firstSlitHeight, labels.deltaX1);
  photonUncertaintyArrow(secondSlitHeight, labels.deltaX2);

  const arrowLength = p.width * 0.1;
  const maximumAngle = Math.atan2(slitGap * 0.5, arrowLength);
  const headPosition = p.createVector(arrowLength, 0).rotate(maximumAngle * p.sin(seconds * 2));

  const momentumUncertaintyArrow = (height: number, element: P5.Element) => {
    p.push();
    p.translate(gratingDistance, height);
    p.strokeWeight(strokeWeight);
    p.fill(green);
    p.stroke(green);
    arrow(p, 0, 0, headPosition.x, headPosition.y);
    p.pop();

    element.position(gratingDistance + headPosition.x + p.width * 0.025, height + headPosition.y - p.height * 0.06);
    element.style("color", green);
    katex.render(String.raw`\Delta p`, element.elt);
  };

  momentumUncertaintyArrow(firstSlitHeight, labels.deltaP1);
  momentumUncertaintyArrow(secondSlitHeight, labels.deltaP2);

  // Diffraction Grating
  const color = p.color(foreground);
  p.push();
  p.stroke(color);
  p.strokeWeight(p.width * 0.0078);
  p.translate(gratingDistance, 0);
  p.line(0, 0, 0, (p.height - slitSeparation) * 0.5 - slitGap);
  p.line(0, (p.height - slitSeparation) * 0.5, 0, (p.height + slitSeparation) * 0.5);
  p.line(0, (p.height + slitSeparation) * 0.5 + slitGap, 0, p.height);
  p.pop();
};

const sketch = defaultSketch({ draw, setup });

export function HeisenbergUncertaintyPrinciple() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
    </div>
  );
}
