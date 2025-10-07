"use client";

import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { arrow } from "@/utils/p5-helper";
import P5 from "p5";
import katex from "katex";

const slitSeparationFactor = 0.1;
const gratingDistanceFactor = 0.5;
const slitGapFactor = 0.25;

const setup: Setup = ({ p, width, height, state }) => {
  p.colorMode(p.HSL);

  const graphicsBuffer = p.createGraphics(width, height);
  graphicsBuffer.colorMode(graphicsBuffer.HSL);

  const labelIdentifiers = ["deltaX1", "deltaX2", "deltaP1", "deltaP2"];
  const labels = Object.fromEntries(
    labelIdentifiers.map((identifier) => {
      const paragraph = p.createP();
      paragraph.style("font-size: 1rem");
      return [identifier, paragraph];
    }),
  );

  state.graphicsBuffer = graphicsBuffer;
  state.labels = labels;
};

let photonVelocityY1 = 0;
let timeSinceReachingGrating1 = 0;
let photonVelocityY2 = 0;
let timeSinceReachingGrating2 = 0;

const draw: Draw = ({ p, containerStyle, width, height, state }) => {
  p.clear();
  p.noStroke();

  const graphicsBuffer = state.graphicsBuffer as P5.Graphics;

  graphicsBuffer.resizeCanvas(width, height);
  graphicsBuffer.clear();
  graphicsBuffer.noStroke();

  const labels = state.labels as { [k: string]: P5.Element };

  const seconds = p.millis() * 0.001;
  const documentStyle = getComputedStyle(document.documentElement);

  const foreground = containerStyle.getPropertyValue("--foreground-100");
  const gold = documentStyle.getPropertyValue("--visual-gold");
  const green = documentStyle.getPropertyValue("--visual-green");

  // Style
  const strokeWeight = p.width * 0.005;

  // Sizes
  const arrowHeadSize = p.width * 0.018;
  const photonDiameter = p.width * 0.04;
  const slitGap = p.height * slitGapFactor;
  const slitSeparation = p.height * slitSeparationFactor;
  const gratingDistance = p.width * gratingDistanceFactor;

  // Count
  const numPhotons = 3;
  const firstSlitHeight = (p.height - slitSeparation - slitGap) * 0.5;
  const secondSlitHeight = (p.height + slitSeparation + slitGap) * 0.5;
  const alpha = 0.1;

  // Photons
  {
    p.push();
    const photonPositionX = (p.width * 0.3 * seconds) % p.width;
    if (photonPositionX > gratingDistance) {
      if (photonVelocityY1 === 0 && timeSinceReachingGrating1 === 0)
        photonVelocityY1 = p.random(-p.height * 0.2, p.height * 0.2);
      timeSinceReachingGrating1 += p.deltaTime * 0.001;
    } else {
      if (photonVelocityY1 !== 0) {
        photonVelocityY1 = 0;
      }
      if (timeSinceReachingGrating1 !== 0) {
        timeSinceReachingGrating1 = 0;
      }
    }
    const photonPosition = p.createVector(
      photonPositionX,
      firstSlitHeight + photonVelocityY1 * timeSinceReachingGrating1,
    );

    const localPhotonColor = p.color(gold);
    p.fill(localPhotonColor);
    p.circle(photonPosition.x, photonPosition.y, photonDiameter);
    const halfNumPhotons = p.floor(numPhotons * 0.5);
    localPhotonColor.setAlpha(alpha);
    p.fill(localPhotonColor);
    for (let i = -halfNumPhotons; i <= halfNumPhotons; i++) {
      p.circle(photonPosition.x, photonPosition.y + i * photonDiameter, photonDiameter);
    }
    p.pop();
  }

  {
    p.push();
    const photonPositionX = (p.width * 0.3 * seconds) % p.width;
    if (photonPositionX > gratingDistance) {
      if (photonVelocityY2 === 0 && timeSinceReachingGrating2 === 0)
        photonVelocityY2 = p.random(-p.height * 0.2, p.height * 0.2);
      timeSinceReachingGrating2 += p.deltaTime * 0.001;
    } else {
      if (photonVelocityY2 !== 0) {
        photonVelocityY2 = 0;
      }
      if (timeSinceReachingGrating2 !== 0) {
        timeSinceReachingGrating2 = 0;
      }
    }

    const photonPosition = p.createVector(
      photonPositionX,
      secondSlitHeight + photonVelocityY2 * timeSinceReachingGrating2,
    );

    const localPhotonColor = p.color(gold);
    p.fill(localPhotonColor);
    p.circle(photonPosition.x, photonPosition.y, photonDiameter);
    const halfNumPhotons = p.floor(numPhotons * 0.5);
    localPhotonColor.setAlpha(alpha);
    p.fill(localPhotonColor);
    for (let i = -halfNumPhotons; i <= halfNumPhotons; i++) {
      p.circle(photonPosition.x, photonPosition.y + i * photonDiameter, photonDiameter);
    }
    p.pop();
  }

  // Photon Uncertainty
  {
    p.push();
    p.translate(gratingDistance, firstSlitHeight);
    p.strokeWeight(strokeWeight);
    p.fill(gold);
    p.stroke(gold);
    arrow({
      p: p,
      tailX: -p.width * 0.025,
      tailY: slitGap * 0.5 - arrowHeadSize,
      headX: -p.width * 0.025,
      headY: -slitGap * 0.5 + arrowHeadSize,
      doubleSided: true,
      arrowHeadSize,
    });
    p.pop();

    p.push();
    p.translate(gratingDistance, secondSlitHeight);
    p.strokeWeight(strokeWeight);
    p.fill(gold);
    p.stroke(gold);
    arrow({
      p: p,
      tailX: -p.width * 0.025,
      tailY: slitGap * 0.5 - arrowHeadSize,
      headX: -p.width * 0.025,
      headY: -slitGap * 0.5 + arrowHeadSize,
      doubleSided: true,
      arrowHeadSize,
    });
    p.pop();

    labels.deltaX1.position(gratingDistance - p.width * 0.1, firstSlitHeight - p.height * 0.06);
    labels.deltaX1.style("color", gold);
    katex.render(String.raw`\Delta x`, labels.deltaX1.elt);

    labels.deltaX2.position(gratingDistance - p.width * 0.1, secondSlitHeight - p.height * 0.06);
    labels.deltaX2.style("color", gold);
    katex.render(String.raw`\Delta x`, labels.deltaX2.elt);
  }

  // Momentum Uncetainty
  {
    const arrowLength = p.width * 0.1;
    const maximumAngle = Math.atan2(slitGap * 0.5, arrowLength);
    const headPosition = p.createVector(arrowLength, 0).rotate(maximumAngle * p.sin(seconds * 2));

    p.push();
    p.translate(gratingDistance, firstSlitHeight);
    p.strokeWeight(strokeWeight);
    p.fill(green);
    p.stroke(green);
    arrow({
      p: p,
      tailX: 0,
      tailY: 0,
      headX: headPosition.x,
      headY: headPosition.y,
      arrowHeadSize,
    });
    p.pop();

    p.push();
    p.translate(gratingDistance, secondSlitHeight);
    p.strokeWeight(strokeWeight);
    p.fill(green);
    p.stroke(green);
    arrow({
      p: p,
      tailX: 0,
      tailY: 0,
      headX: headPosition.x,
      headY: headPosition.y,
      arrowHeadSize,
    });
    p.pop();

    labels.deltaP1.position(
      gratingDistance + headPosition.x + p.width * 0.025,
      firstSlitHeight + headPosition.y - p.height * 0.06,
    );
    labels.deltaP1.style("color", green);
    katex.render(String.raw`\Delta p`, labels.deltaP1.elt);

    labels.deltaP2.position(
      gratingDistance + headPosition.x + p.width * 0.025,
      secondSlitHeight + headPosition.y - p.height * 0.06,
    );
    labels.deltaP2.style("color", green);
    katex.render(String.raw`\Delta p`, labels.deltaP2.elt);
  }

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
