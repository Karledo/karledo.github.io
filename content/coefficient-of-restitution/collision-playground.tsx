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
import { arrow } from "@/utils/sketch-utils";
import katex from "katex";
import { RefSwitch } from "@/components/ref-switch";

const fixedDeltaTime = 16.6;
const coefficientRef = { current: 1 };
const gravityRef = { current: 500 };
const showVelocitiesRef = { current: false };
const velocityScale = 50;

interface Object {
  draw: () => void;
}

class Rect extends Object {
  p: P5;
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  right: number;
  bottom: number;
  top: number;

  constructor(p: P5, x: number, y: number, width: number, height: number) {
    super();
    this.p = p;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.left = x;
    this.right = x + width;
    this.top = y;
    this.bottom = y + height;
  }

  draw() {
    this.p.rect(this.x, this.y, this.width, this.height);
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function calculateReboundVelocity(e: number, u1: number, u2: number) {
  const v1 = (u1 * (1 - e) + u2 * (1 + e)) / 2;
  const v2 = (u1 * (1 + e) + u2 * (1 - e)) / 2;
  return { v1, v2 };
}

class Ball extends Object {
  p: P5;
  position: P5.Vector;
  velocity: P5.Vector;
  diameter: number;

  constructor(
    p: P5,
    position: P5.Vector,
    velocity: P5.Vector,
    diameter: number,
  ) {
    super();
    this.p = p;
    this.position = position;
    this.velocity = velocity;
    this.diameter = diameter;
  }

  update() {
    const radius = this.diameter / 2;
    this.position.x += (this.velocity.x * fixedDeltaTime) / 1000;
    this.position.y += (this.velocity.y * fixedDeltaTime) / 1000;
  }

  draw() {
    this.p.push();
    this.p.fill("red");
    this.p.circle(this.position.x, this.position.y, this.p.width * 0.05);
    this.p.pop();
  }
}

const pathResolution = 10;
let objects: Object[] = [];
let balls: Ball[] = [];
let ballTags: P5.Element[] = [];
let clickPosition: P5.Vector | undefined = undefined;

function calculateProjectionVelocity(p: P5, position: P5.Vector) {
  return p.createVector(position.x - p.mouseX, position.y - p.mouseY).mult(3);
}

const setup: Setup = ({ p, renderer }) => {
  p.colorMode(p.HSL);
  const diameter = p.width * 0.05;

  p.mousePressed = () => {
    if (
      p.mouseX < 0 ||
      p.mouseX > p.width ||
      p.mouseY < 0 ||
      p.mouseY > p.height
    ) {
      return;
    }
    clickPosition = p.createVector(p.mouseX, p.mouseY);
  };

  p.mouseReleased = () => {
    if (clickPosition === undefined) {
      return;
    }
    const velocity = calculateProjectionVelocity(p, clickPosition);
    const ball = new Ball(p, clickPosition, velocity, diameter);
    const tag = p.createP().style("font-size", "0.9rem");
    balls.push(ball);
    ballTags.push(tag);
    objects.push(ball);
    clickPosition = undefined;
  };
};

const draw: Draw = ({ p }) => {
  p.clear();
  p.noStroke();

  // const halfWidth = p.width * 0.5;
  // const halfHeight = p.height * 0.5;
  //
  // const fontSize = `${p.width * 0.025}px`;
  const documentStyle = getComputedStyle(document.documentElement);
  // const background2 = documentStyle.getPropertyValue("--background-200");
  const background3 = documentStyle.getPropertyValue("--background-300");
  const foreground1 = documentStyle.getPropertyValue("--foreground-100");
  // const foreground2 = documentStyle.getPropertyValue("--foreground-200");
  const foreground3 = documentStyle.getPropertyValue("--foreground-300");

  // const diameter = p.width * 0.05;
  // const radius = diameter / 2;

  p.push();
  p.fill(foreground1);

  p.push();
  p.fill(background3);
  if (clickPosition !== undefined) {
    const u = p
      .createVector(clickPosition.x - p.mouseX, clickPosition.y - p.mouseY)
      .mult(3);
    const duration = 0.75;
    for (let i = 0; i <= pathResolution; i++) {
      const t = (i / pathResolution) * duration;
      const x = u.x * t;
      const y = u.y * t + 0.5 * gravityRef.current * t * t;
      p.circle(clickPosition.x + x, clickPosition.y + y, p.width * 0.01);
    }
  }
  p.pop();

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ball.velocity.y += (gravityRef.current * fixedDeltaTime) / 1000;

    ball.update();

    if (
      ball.position.x < ball.diameter / 2 ||
      ball.position.x > p.width - ball.diameter / 2
    ) {
      ball.position.x = clamp(
        ball.position.x,
        ball.diameter / 2,
        p.width - ball.diameter / 2,
      );
      ball.velocity.x *= -coefficientRef.current;
    }

    if (
      ball.position.y < ball.diameter / 2 ||
      ball.position.y > p.height - ball.diameter / 2
    ) {
      ball.position.y = clamp(
        ball.position.y,
        ball.diameter / 2,
        p.height - ball.diameter / 2,
      );
      ball.velocity.y *= -coefficientRef.current;
    }

    for (const other of balls) {
      if (ball == other) {
        continue;
      }

      const displacement = p.createVector(
        other.position.x - ball.position.x,
        other.position.y - ball.position.y,
      );
      const direction = displacement.copy().normalize();
      const distance = displacement.mag();

      if (distance < ball.diameter / 2 + other.diameter / 2) {
        const overlap = ball.diameter / 2 + other.diameter / 2 - distance;
        ball.position.add(displacement.copy().normalize().mult(-overlap));
        other.position.add(displacement.copy().normalize().mult(overlap));

        const normalBallVelocity = direction.dot(ball.velocity);
        const tangentialBallVelocity = ball.velocity
          .copy()
          .sub(direction.copy().mult(normalBallVelocity));

        const normalOtherVelocity = direction.dot(other.velocity);
        const tangentialOtherVelocity = other.velocity
          .copy()
          .sub(direction.copy().mult(normalOtherVelocity));

        const { v1, v2 } = calculateReboundVelocity(
          coefficientRef.current,
          normalBallVelocity,
          normalOtherVelocity,
        );

        ball.velocity = direction.copy().mult(v1).add(tangentialBallVelocity);
        other.velocity = direction.copy().mult(v2).add(tangentialOtherVelocity);
      }
    }

    if (showVelocitiesRef.current) {
      const scale = 0.2;
      p.push();
      p.stroke(foreground3);
      p.strokeWeight(p.width * 0.0025);
      const head = ball.position.copy().add(ball.velocity.copy().mult(scale));
      const point = ball.position.copy().add(
        ball.velocity
          .copy()
          .normalize()
          .mult(ball.diameter / 2),
      );
      arrow(p, ball.position.x, ball.position.y, head.x, head.y);
      const midpoint = head.copy().add(point).div(2);
      const tag = ballTags[i];
      tag.style("display", "block");
      tag.position(
        midpoint.x +
          p.width * 0.02 * Math.sign(ball.velocity.x) -
          (ball.velocity.x < 0 ? tag.elt.offsetWidth : 0),
        midpoint.y,
      );
      katex.render(
        String.raw`${(ball.velocity.mag() / velocityScale).toFixed(1)}`,
        tag.elt,
      );
      p.pop();
    } else {
      const tag = ballTags[i];
      tag.style("display", "none");
    }

    ball.draw();
  }
  p.pop();
};

const sketch = defaultSketch({ setup, draw });

export function CollisionPlayground() {
  return (
    <div>
      <StyledP5Container className="mb-0" sketch={sketch} />
      <span className="text-foreground-200 text-sm select-none"></span>
      <RefSlider
        sharedRef={coefficientRef}
        label={<Latex text="$e$" />}
        step={0.01}
        min={0}
        max={1}
        display={(value) => value.toFixed(2)}
      />
      <RefSlider
        sharedRef={gravityRef}
        label={<Latex text="$g$" />}
        step={0.1}
        min={0}
        map={(value) => value * velocityScale}
        inverseMap={(value) => value / velocityScale}
        max={20}
        display={(value) => value.toFixed(1)}
      />
      <RefSwitch
        sharedRef={showVelocitiesRef}
        label={<span>Show Velocities</span>}
      />
    </div>
  );
}
