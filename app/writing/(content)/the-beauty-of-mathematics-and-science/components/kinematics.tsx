"use client";

import { RefSlider } from "@/components/base-slider";
import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import P5 from "p5";

const xVelocityRef = { current: 200 };
const yVelocityRef = { current: 350 };
const gravity = 300;
const alpha = 0.2;
const pathResolution = 15;

let ball: Ball;

class Ball {
  p: P5;
  position: P5.Vector;
  velocity: P5.Vector;
  diameter: number;

  constructor(p: P5, position: P5.Vector, velocity: P5.Vector, diameter: number) {
    this.p = p;
    this.position = position;
    this.velocity = velocity;
    this.diameter = diameter;
  }

  reset() {
    this.position.set(this.diameter, this.p.height - this.diameter);
    this.velocity.set(xVelocityRef.current, -yVelocityRef.current);
  }

  drawPath() {
    const duration = (-2 * -yVelocityRef.current) / gravity;

    for (let i = 0; i <= pathResolution; i++) {
      const frac = i / pathResolution;
      const t = frac * duration;
      const x = xVelocityRef.current * t;
      const y = -yVelocityRef.current * t + 0.5 * gravity * t * t;

      this.p.circle(this.diameter + x, this.p.height - this.diameter + y, this.diameter * 0.2);
    }
  }

  draw() {
    this.p.circle(this.position.x, this.position.y, this.diameter);
  }
}

const setup: Setup = ({ p }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CORNERS);

  const diameter = p.width * 0.05;
  const position = p.createVector(diameter, p.height - diameter);
  const velocity = p.createVector(0, 0);

  ball = new Ball(p, position, velocity, diameter);
};

const draw: Draw = ({ p }) => {
  p.clear();
  p.noStroke();

  const documentStyle = getComputedStyle(document.documentElement);
  const foreground = documentStyle.getPropertyValue("--foreground-100");
  const foreground3 = documentStyle.getPropertyValue("--foreground-300");
  const deltaTimeSeconds = p.deltaTime * 0.001;

  ball.diameter = p.width * 0.05;
  ball.velocity.y += gravity * deltaTimeSeconds;
  ball.position.x += ball.velocity.x * deltaTimeSeconds;
  ball.position.y += ball.velocity.y * deltaTimeSeconds;

  const radius = ball.diameter / 2;
  if (ball.position.x < radius || ball.position.y > p.height - radius) {
    ball.reset();
  }

  p.push();
  const color = p.color(foreground3);
  color.setAlpha(alpha);
  p.fill(color);
  ball.drawPath();
  p.pop();

  p.push();
  p.fill(foreground);
  ball.draw();
  p.pop();
};

const sketch = defaultSketch({ setup, draw });

export function Kinematics() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
      <RefSlider
        sharedRef={xVelocityRef}
        label="Horizontal Velocity"
        min={0}
        step={0.01}
        max={5}
        map={(value) => value * 100}
        inverseMap={(value) => value * 0.01}
        display={(value) => value.toFixed(2)}
      />
      <RefSlider
        sharedRef={yVelocityRef}
        label="Vertical Velocity"
        min={0}
        step={0.01}
        max={5}
        map={(value) => value * 100}
        inverseMap={(value) => value * 0.01}
        display={(value) => value.toFixed(2)}
      />
    </div>
  );
}
