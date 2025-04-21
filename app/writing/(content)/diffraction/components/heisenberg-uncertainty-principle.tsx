"use client";

import { baseSketch, Draw, Setup } from "@/components/base-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { arrow } from "@/utils/p5-helper";
import P5Types from "p5";

const slitSeparationFactor = 0.1;
const gratingDistanceFactor = 0.5;
const slitGapFactor = 0.25;

let graphicsBuffer: P5Types.Graphics;

const setup: Setup = ({ p5, canvasWidth, canvasHeight }) => {
  p5.colorMode(p5.HSL);

  graphicsBuffer = p5.createGraphics(canvasWidth, canvasHeight);
  graphicsBuffer.colorMode(graphicsBuffer.HSL);
};

let photonVelocityY1 = 0;
let timeSinceReachingGrating1 = 0;
let photonVelocityY2 = 0;
let timeSinceReachingGrating2 = 0;

const draw: Draw = ({ p5, parentStyle, canvasWidth, canvasHeight }) => {
  const seconds = p5.millis() * 0.001;
  const documentStyle = getComputedStyle(document.documentElement);
  p5.clear();
  p5.noStroke();
  graphicsBuffer.resizeCanvas(canvasWidth, canvasHeight);
  graphicsBuffer.clear();
  graphicsBuffer.noStroke();

  // Styles
  const diffractionGratingColor = parentStyle.getPropertyValue("--foreground-100");
  const photonColor = documentStyle.getPropertyValue("--visual-gold");
  const momentumColor = documentStyle.getPropertyValue("--visual-green");
  const fontSize = p5.width * 0.032;
  const font = "KaTex_Main";
  const strokeWeight = p5.width * 0.0048;

  // Sizes
  const arrowHeadSize = p5.width * 0.018;
  const photonDiameter = p5.width * 0.04;
  const slitGap = p5.height * slitGapFactor;
  const slitSeparation = p5.height * slitSeparationFactor;
  const gratingDistance = p5.width * gratingDistanceFactor;

  // Count
  const numPhotons = 3;
  const firstSlitHeight = (p5.height - slitSeparation - slitGap) * 0.5;
  const secondSlitHeight = (p5.height + slitSeparation + slitGap) * 0.5;
  const alpha = 0.1;

  // Photons
  {
    p5.push();
    const photonPositionX = (p5.width * 0.3 * seconds) % p5.width;
    if (photonPositionX > gratingDistance) {
      if (photonVelocityY1 === 0 && timeSinceReachingGrating1 === 0)
        photonVelocityY1 = p5.random(-p5.height * 0.2, p5.height * 0.2);
      timeSinceReachingGrating1 += p5.deltaTime * 0.001;
    } else {
      if (photonVelocityY1 !== 0) {
        photonVelocityY1 = 0;
      }
      if (timeSinceReachingGrating1 !== 0) {
        timeSinceReachingGrating1 = 0;
      }
    }
    const photonPosition = p5.createVector(
      photonPositionX,
      firstSlitHeight + photonVelocityY1 * timeSinceReachingGrating1,
    );

    const localPhotonColor = p5.color(photonColor);
    p5.fill(localPhotonColor);
    p5.circle(photonPosition.x, photonPosition.y, photonDiameter);
    const halfNumPhotons = p5.floor(numPhotons * 0.5);
    localPhotonColor.setAlpha(alpha);
    p5.fill(localPhotonColor);
    for (let i = -halfNumPhotons; i <= halfNumPhotons; i++) {
      p5.circle(photonPosition.x, photonPosition.y + i * photonDiameter, photonDiameter);
    }
    p5.pop();
  }

  {
    p5.push();
    const photonPositionX = (p5.width * 0.3 * seconds) % p5.width;
    if (photonPositionX > gratingDistance) {
      if (photonVelocityY2 === 0 && timeSinceReachingGrating2 === 0)
        photonVelocityY2 = p5.random(-p5.height * 0.2, p5.height * 0.2);
      timeSinceReachingGrating2 += p5.deltaTime * 0.001;
    } else {
      if (photonVelocityY2 !== 0) {
        photonVelocityY2 = 0;
      }
      if (timeSinceReachingGrating2 !== 0) {
        timeSinceReachingGrating2 = 0;
      }
    }

    const photonPosition = p5.createVector(
      photonPositionX,
      secondSlitHeight + photonVelocityY2 * timeSinceReachingGrating2,
    );

    const localPhotonColor = p5.color(photonColor);
    p5.fill(localPhotonColor);
    p5.circle(photonPosition.x, photonPosition.y, photonDiameter);
    const halfNumPhotons = p5.floor(numPhotons * 0.5);
    localPhotonColor.setAlpha(alpha);
    p5.fill(localPhotonColor);
    for (let i = -halfNumPhotons; i <= halfNumPhotons; i++) {
      p5.circle(photonPosition.x, photonPosition.y + i * photonDiameter, photonDiameter);
    }
    p5.pop();
  }

  // Photon Uncertainty
  {
    p5.push();

    p5.textFont(font);
    p5.textSize(fontSize);
    p5.textAlign(p5.RIGHT);
    p5.fill(photonColor);

    p5.push();
    p5.translate(gratingDistance, firstSlitHeight);
    p5.text("Δx", -p5.width * 0.05, 0);
    p5.strokeWeight(strokeWeight);
    p5.stroke(photonColor);
    arrow({
      p5,
      tailX: -p5.width * 0.025,
      tailY: slitGap * 0.5 - arrowHeadSize,
      headX: -p5.width * 0.025,
      headY: -slitGap * 0.5 + arrowHeadSize,
      doubleSided: true,
      arrowHeadSize,
    });
    p5.pop();

    p5.push();
    p5.translate(gratingDistance, secondSlitHeight);
    p5.text("Δx", -p5.width * 0.05, 0);
    p5.strokeWeight(strokeWeight);
    p5.stroke(photonColor);
    arrow({
      p5,
      tailX: -p5.width * 0.025,
      tailY: slitGap * 0.5 - arrowHeadSize,
      headX: -p5.width * 0.025,
      headY: -slitGap * 0.5 + arrowHeadSize,
      doubleSided: true,
      arrowHeadSize,
    });
    p5.pop();

    p5.pop();
  }

  // Momentum Uncetainty
  {
    p5.push();

    p5.textFont(font);
    p5.textSize(fontSize);
    p5.fill(momentumColor);

    p5.push();
    p5.translate(gratingDistance, firstSlitHeight);
    const arrowLength = p5.width * 0.1;
    const maximumAngle = p5.atan2(slitGap * 0.5, arrowLength);
    const headPosition = p5.createVector(arrowLength, 0).rotate(maximumAngle * p5.sin(seconds * 2));
    p5.text("Δp", headPosition.x + p5.width * 0.025, headPosition.y);
    p5.strokeWeight(strokeWeight);
    p5.stroke(momentumColor);
    arrow({
      p5: p5,
      tailX: 0,
      tailY: 0,
      headX: headPosition.x,
      headY: headPosition.y,
      arrowHeadSize,
    });
    p5.pop();

    p5.push();
    p5.translate(gratingDistance, secondSlitHeight);
    p5.text("Δp", headPosition.x + p5.width * 0.025, headPosition.y);
    p5.strokeWeight(strokeWeight);
    p5.stroke(momentumColor);
    arrow({
      p5: p5,
      tailX: 0,
      tailY: 0,
      headX: headPosition.x,
      headY: headPosition.y,
      arrowHeadSize,
    });
    p5.pop();

    p5.pop();
  }

  // Diffraction Grating
  p5.stroke(p5.color(diffractionGratingColor));
  p5.push();
  p5.strokeWeight(p5.width * 0.0078);
  p5.translate(gratingDistance, 0);
  p5.line(0, 0, 0, (p5.height - slitSeparation) * 0.5 - slitGap);
  p5.line(0, (p5.height - slitSeparation) * 0.5, 0, (p5.height + slitSeparation) * 0.5);
  p5.line(0, (p5.height + slitSeparation) * 0.5 + slitGap, 0, p5.height);
  p5.pop();
};

const sketch = baseSketch({ draw, setup });

export function HeisenbergUncertaintyPrinciple() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
    </div>
  );
}
