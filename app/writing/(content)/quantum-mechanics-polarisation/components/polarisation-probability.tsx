"use client";

import { baseSketchWebGL, type DrawGL } from "@/components/default-sketch-webgl3d";
import { StyledP5Container } from "@/components/p5-container";

const draw: DrawGL = ({ p: p5, camera }) => {
  p5.clear();
  p5.noStroke();
  p5.fill("white");
  p5.lights();

  const angle = p5.millis() * 0.001;
  const axis = p5.createVector(p5.mouseX - p5.width / 2, p5.mouseY - p5.height / 2, 0);

  const numParticles = 5;
  const distance = 1000;
  camera.setPosition(p5.cos(angle) * distance, -distance * 0.5, p5.sin(angle) * distance);
  camera.lookAt(0, 0, 0);

  for (let i = 0; i < numParticles; i++) {
    p5.push();
    p5.translate(i * 40, 0, 0);
    p5.box(20, 20, 20);
    p5.rotate(angle, axis);
    p5.pop();
  }
};
const sketch = baseSketchWebGL({ draw });
export function PolarisationProbability() {
  return <StyledP5Container sketch={sketch} />;
}
