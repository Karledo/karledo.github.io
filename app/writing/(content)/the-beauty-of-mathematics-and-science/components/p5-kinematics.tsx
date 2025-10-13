"use client";

import { RefSlider } from "@/components/base-slider";
import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import P5 from "p5";

const xVelocityRef = { current: 0 };
const yVelocityRef = { current: 0 };
const gravityRef = { current: 300 };

type BallContext = {
  p: P5;
  diameter: number | (() => number);
  position: P5.Vector;
  velocity: P5.Vector;
};

class Ball {
  p: P5;
  diameter: number | (() => number);
  position: P5.Vector;
  velocity: P5.Vector;

  constructor({ p, diameter, position, velocity }: BallContext) {
    this.p = p;
    this.diameter = diameter;
    this.position = position;
    this.velocity = velocity;
  }

  update() {
    this.position.add(this.velocity.copy().mult(this.p.deltaTime / 1000));
    const diameter = typeof this.diameter === "function" ? this.diameter() : this.diameter;
    const radius = diameter / 2;

    if (
      this.position.x < 0 ||
      this.position.x > this.p.width ||
      this.position.y < 0 ||
      this.position.y > this.p.height
    ) {
      this.position.set(50, this.p.height - radius);
      this.velocity.set(xVelocityRef.current, -yVelocityRef.current);
    }
  }

  drawPath() {
    const diameter = typeof this.diameter == "function" ? this.diameter() : this.diameter;
    const u = this.p.createVector(xVelocityRef.current, yVelocityRef.current);
    const duration = (-2 * u.y) / -gravityRef.current;
    const pathResolution = 10;

    for (let i = 0; i <= pathResolution; i++) {
      const t = (i / pathResolution) * duration;
      const x = u.x * t;
      const y = u.y * t + (-gravityRef.current * t * t) / 2;

      const color = getComputedStyle(document.documentElement).getPropertyValue("--foreground-300");

      this.p.push();
      this.p.fill(color);
      this.p.translate(50, this.p.height - diameter / 2);
      this.p.circle(x, -y, diameter * 0.2);
      this.p.pop();
    }
  }

  draw() {
    const documentStyle = getComputedStyle(document.documentElement);
    const foreground = documentStyle.getPropertyValue("--foreground-100");

    const diameter = typeof this.diameter === "function" ? this.diameter() : this.diameter;

    this.p.push();
    this.p.fill(foreground);
    this.p.circle(this.position.x, this.position.y, diameter);
    this.p.pop();
  }
}

type State = {
  ball: Ball;
};

const setup: Setup<State> = ({ p, state }) => {
  p.colorMode(p.HSL);

  const diameter = () => p.width * 0.035;
  const position = p.createVector(50, p.height - 50);
  const velocity = p.createVector(xVelocityRef.current, -yVelocityRef.current);

  const ball = new Ball({
    p,
    diameter,
    position,
    velocity,
  });

  state.ball = ball;
};

const draw: Draw<State> = ({ p, state }) => {
  p.clear();
  p.noStroke();

  const ball = state.ball as Ball;

  ball.velocity.y += (gravityRef.current * p.deltaTime) / 1000;
  ball.update();
  ball.draw();
  ball.drawPath();
};

const sketch = defaultSketch<State>({ setup, draw });

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
        defaultValue={[0]}
        mapFn={(value) => value * 100}
        displayFn={(value) => value.toFixed(2)}
      />
      <RefSlider
        sharedRef={yVelocityRef}
        label="Vertical Velocity"
        min={0}
        step={0.01}
        max={5}
        defaultValue={[0]}
        mapFn={(value) => value * 100}
        displayFn={(value) => value.toFixed(2)}
      />
    </div>
  );
}
