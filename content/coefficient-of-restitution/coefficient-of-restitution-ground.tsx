"use client";
import {
  defaultSketch,
  type Draw,
  type Setup,
} from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import P5 from "p5";
import { RefSlider } from "@/components/ref-slider";
import { Latex } from "@/components/latex";

const coefficientRef = { current: 1 };

let position: P5.Vector;
let velocity: P5.Vector;

const setup: Setup = ({ p, renderer }) => {
  p.colorMode(p.HSL);
  position = p.createVector(p.width * 0.5, p.height * 0.5);
  velocity = p.createVector(0, 0);

  renderer.mouseClicked(() => {
    position.set(p.width * 0.5, p.height * 0.5);
    velocity.set(0, 0);
  });
};

const fixedDeltaTime = 16.6;

const draw: Draw = ({ p }) => {
  p.clear();

  const documentStyle = getComputedStyle(document.documentElement);
  const foreground1 = documentStyle.getPropertyValue("--foreground-100");

  const diameter = p.width * 0.05;
  const gravity = 600;

  velocity.y += (gravity * fixedDeltaTime) / 1000;
  position.y += (velocity.y * fixedDeltaTime) / 1000;

  if (position.y > p.height - diameter / 2) {
    velocity.y = -coefficientRef.current * velocity.y;
    position.y = p.height - diameter / 2;
  }

  p.push();
  p.fill(foreground1);
  p.circle(position.x, position.y, diameter);
  p.pop();
};

const sketch = defaultSketch({ setup, draw });

export function CoefficientOfRestitutionGround() {
  return (
    <>
      <StyledP5Container sketch={sketch} />
      <span className="text-foreground-200 text-sm select-none">
        Press to reset the ball
      </span>
      <RefSlider
        sharedRef={coefficientRef}
        label={<Latex text="$e$" />}
        step={0.01}
        min={0}
        max={1}
        display={(value) => value.toFixed(2)}
      />
    </>
  );
}
