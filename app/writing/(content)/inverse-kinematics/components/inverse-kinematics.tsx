"use client";

import { baseSketchWebGL, type DrawGL, type SetupGL } from "@/components/default-sketch-webgl3d";
import { StyledP5Container } from "@/components/p5-container";
import { BaseSlider } from "@/components/base-slider";
import { Latex } from "@/components/latex";
import { Fragment, useRef } from "react";

// const MAX_WIDTH = 641.52;
const setup: SetupGL = ({ p: p5 }) => {
  p5.colorMode(p5.HSL);
  p5.rectMode(p5.CORNERS);
  p5.debugMode(p5.GRID);
};

// These need to be long enough to reach the maximum offset position for the end effector.
const L2 = 60;
const L3 = 60;
const L4 = 60;

const defaultTargetX = 30;
const defaultTargetY = 30;
const defaultTargetZ = 30;
const defaultEndEffectorAngleDegrees = -30;

let targetEndEffectorAngleDegrees = defaultEndEffectorAngleDegrees;
let targetX = defaultTargetX;
let targetY = defaultTargetY;
let targetZ = defaultTargetZ;

let currentEndEffectorAngleDegrees = defaultEndEffectorAngleDegrees;
let currentX = defaultTargetX;
let currentY = defaultTargetY;
let currentZ = defaultTargetZ;

const decay = 1;
const expDecay = (a: number, b: number, decay: number, deltaTime: number) => {
  return b + (a - b) * Math.exp(-decay * deltaTime);
};

const inverseKinematics = (x: number, y: number, z: number, gamma: number) => {
  const theta1 = Math.atan2(z, x);
  const xl4 = Math.sqrt(x * x + z * z);
  const y4 = y;
  const xl3 = xl4 - L4 * Math.cos(gamma);
  const y3 = y4 - L4 * Math.sin(gamma);

  const L23 = Math.sqrt(xl3 * xl3 + y3 * y3);

  const alpha3 = Math.acos(Math.max(Math.min((L2 * L2 + L3 * L3 - L23 * L23) / (2 * L2 * L3), 1), -1));
  const alpha2 = Math.acos(Math.max(Math.min((L2 * L2 + L23 * L23 - L3 * L3) / (2 * L2 * L23), 1), -1));
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
    targetEndEffectorAngleDegrees,
    decay,
    deltaTimeSeconds,
  );

  currentX = expDecay(currentX, targetX, decay, deltaTimeSeconds);
  currentY = expDecay(currentY, targetY, decay, deltaTimeSeconds);
  currentZ = expDecay(currentZ, targetZ, decay, deltaTimeSeconds);

  const { points } = inverseKinematics(currentX, currentY, currentZ, p.radians(currentEndEffectorAngleDegrees));

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
      p.line(point[0], point[1], point[2], nextPoint[0], nextPoint[1], nextPoint[2]);
    }
    p.pop();
  }
  p.pop();
};

const sketch = baseSketchWebGL({ draw, setup });

export function InverseKinematics() {
  const endEffector = useRef<HTMLSpanElement>(null);
  const X = useRef<HTMLSpanElement>(null);
  const Y = useRef<HTMLSpanElement>(null);
  const Z = useRef<HTMLSpanElement>(null);

  const sliders = [
    {
      key: "X",
      ref: X,
      default: defaultTargetX,
      onValueChange: ([value]: number[]) => {
        targetX = value;
        if (X.current) {
          X.current.innerText = `${value}`;
        }
      },
    },
    {
      key: "Y",
      ref: Y,
      default: defaultTargetY,
      onValueChange: ([value]: number[]) => {
        targetY = value;
        if (Y.current) {
          Y.current.innerText = `${value}`;
        }
      },
    },
    {
      key: "Z",
      ref: Z,
      default: defaultTargetZ,
      onValueChange: ([value]: number[]) => {
        targetZ = value;
        if (Z.current) {
          Z.current.innerText = `${value}`;
        }
      },
    },
  ];

  return (
    <div>
      <StyledP5Container sketch={sketch} />
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4">
        {sliders.map((slider) => {
          return (
            <Fragment key={slider.key}>
              <span className="text-center">
                <Latex text={`$${slider.key}$`} />
              </span>
              <BaseSlider
                min={-100}
                max={100}
                defaultValue={[slider.default]}
                step={1}
                onValueChange={slider.onValueChange}
              />
              <span className="min-w-[5ch]">
                <span ref={slider.ref} className="tabular-nums">
                  {slider.default}
                </span>
              </span>
            </Fragment>
          );
        })}
        <span className="flex max-w-[10ch] items-center">Angle</span>
        <BaseSlider
          min={-50}
          max={50}
          defaultValue={[0]}
          step={1}
          onValueChange={([value]) => {
            targetEndEffectorAngleDegrees = value;
            if (endEffector.current) {
              endEffector.current.innerText = `${value}`;
            }
          }}
        />
        <span className="min-w-[5ch]">
          <span ref={endEffector} className="tabular-nums">
            {targetEndEffectorAngleDegrees}
            <Latex text="$\degree$" />
          </span>
        </span>
      </div>
    </div>
  );
}
