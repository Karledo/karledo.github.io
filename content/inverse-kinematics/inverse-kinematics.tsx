"use client";

import katex from "katex";
import {
  defaultSketchWebGL,
  type DrawGL,
  type SetupGL,
} from "@/components/default-sketch";
import { StyledP5Container } from "@/components/p5-container";
import { RefSlider } from "@/components/ref-slider";
import { Latex } from "@/components/latex";

// These need to be long enough to reach the maximum offset position for the end effector.
const L2 = 60;
const L3 = 60;
const L4 = 60;

const defaultTargetX = 30;
const defaultTargetY = 30;
const defaultTargetZ = 30;
const defaultEndEffectorAngleDegrees = -30;

let targetEndEffectorAngleDegrees = { current: defaultEndEffectorAngleDegrees };
let targetX = { current: defaultTargetX };
let targetY = { current: defaultTargetY };
let targetZ = { current: defaultTargetZ };

let currentEndEffectorAngleDegrees = targetEndEffectorAngleDegrees.current;
let currentX = targetX.current;
let currentY = targetY.current;
let currentZ = targetZ.current;

const decay = 1;
const expDecay = (a: number, b: number, decay: number, deltaTime: number) =>
  b + (a - b) * Math.exp(-decay * deltaTime);

function inverseKinematics(x: number, y: number, z: number, gamma: number) {
  const theta1 = Math.atan2(z, x);
  const xl4 = Math.sqrt(x * x + z * z);
  const y4 = y;
  const xl3 = xl4 - L4 * Math.cos(gamma);
  const y3 = y4 - L4 * Math.sin(gamma);

  const L23 = Math.sqrt(xl3 * xl3 + y3 * y3);

  const alpha3 = Math.acos(
    Math.max(Math.min((L2 * L2 + L3 * L3 - L23 * L23) / (2 * L2 * L3), 1), -1),
  );
  const alpha2 = Math.acos(
    Math.max(Math.min((L2 * L2 + L23 * L23 - L3 * L3) / (2 * L2 * L23), 1), -1),
  );
  const beta2 = Math.atan2(y3, xl3);

  const theta2 = alpha2 + beta2;
  const theta3 = Math.PI - alpha3;
  const theta4 = theta2 - theta3 - gamma;

  const xl2 = L2 * Math.cos(theta2);
  const y2 = L2 * Math.sin(theta2);

  const x2 = xl2 * Math.cos(theta1);
  const z2 = x2 * Math.tan(theta1);
  const x3 = xl3 * Math.cos(theta1);
  const z3 = x3 * Math.tan(theta1);

  const points = [
    [0, 0, 0],
    [x2, y2, z2],
    [x3, y3, z3],
    [x, y, z],
  ];

  const angles = [theta1, theta2, theta3, theta4];

  return { points, angles };
}

const setup: SetupGL = ({ p }) => {
  p.colorMode(p.HSL);
  p.rectMode(p.CORNERS);
  p.debugMode(p.GRID);
};

const draw: DrawGL = ({ p }) => {
  p.clear();
  p.noStroke();
  p.lights();
  p.orbitControl();

  const documentStyle = getComputedStyle(document.documentElement);
  const foreground = documentStyle.getPropertyValue("--foreground-100");

  const deltaTimeSeconds = p.deltaTime / 1000;
  currentEndEffectorAngleDegrees = expDecay(
    currentEndEffectorAngleDegrees,
    targetEndEffectorAngleDegrees.current,
    decay,
    deltaTimeSeconds,
  );

  currentX = expDecay(currentX, targetX.current, decay, deltaTimeSeconds);
  currentY = expDecay(currentY, targetY.current, decay, deltaTimeSeconds);
  currentZ = expDecay(currentZ, targetZ.current, decay, deltaTimeSeconds);

  const { points } = inverseKinematics(
    currentX,
    currentY,
    currentZ,
    p.radians(currentEndEffectorAngleDegrees),
  );

  p.rotateX(p.PI);

  p.push();
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    p.push();
    p.translate(point[0], point[1], point[2]);
    p.sphere(5);
    p.pop();

    p.push();
    p.strokeWeight(2);
    p.stroke(foreground);
    if (i < points.length - 1) {
      const nextPoint = points[i + 1];
      p.line(
        point[0],
        point[1],
        point[2],
        nextPoint[0],
        nextPoint[1],
        nextPoint[2],
      );
    }
    p.pop();
  }
  p.pop();
};

const sketch = defaultSketchWebGL({ draw, setup });

export function InverseKinematics() {
  return (
    <div>
      <StyledP5Container sketch={sketch} />
      <RefSlider
        sharedRef={targetEndEffectorAngleDegrees}
        label="End Effector Angle"
        min={-50}
        max={50}
        step={1}
        display={(value) =>
          `${value}${katex.renderToString(String.raw`\degree`)}`
        }
      />
      <RefSlider
        sharedRef={targetX}
        label={<Latex text="$X$" />}
        min={-100}
        max={100}
        step={1}
      />
      <RefSlider
        sharedRef={targetY}
        label={<Latex text="$Y$" />}
        min={-100}
        max={100}
        step={1}
      />
      <RefSlider
        sharedRef={targetZ}
        label={<Latex text="$Z$" />}
        min={-100}
        max={100}
        step={1}
      />
    </div>
  );
}
