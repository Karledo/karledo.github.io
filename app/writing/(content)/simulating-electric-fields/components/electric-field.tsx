"use client";

import {
  defaultSketch,
  type Draw,
  type Setup,
} from "@/components/default-sketch";
import { BaseSlider } from "@/components/base-slider";
import { StyledP5Container } from "@/components/p5-container";
import { arrow } from "@/utils/sketch-utils";
import P5 from "p5";
import { Fragment, useRef } from "react";

type Charge = {
  position: P5.Vector;
  magnitude: number;
};

const MAX_WIDTH = 641.52;
const MAX_HEIGHT = (9 / 16) * MAX_WIDTH;
const numCharges = 2;
let charges: Array<Charge>;
let selectedCharge: Charge | null;

const setup: Setup = ({ p: p5 }) => {
  p5.colorMode(p5.HSL);

  function stopTouchScrolling(canvas: unknown) {
    document.body.addEventListener(
      "touchstart",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
    document.body.addEventListener(
      "touchend",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false },
    );

    document.body.addEventListener(
      "touchmove",
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
  }

  stopTouchScrolling(document.getElementById("defaultCanvas0"));

  charges = Array.from({ length: numCharges }).map((_, i) => {
    return {
      position: p5.createVector(
        p5.width * 0.25 + i * p5.width * 0.1,
        p5.height * 0.4,
      ),
      magnitude: 1,
    };
  });
};

const draw: Draw = ({ p }) => {
  p.clear();
  p.noStroke();
  p.noFill();

  const documentStyle = getComputedStyle(document.documentElement);
  const numArrows = { x: 8, y: 4 };
  const arrowColor = documentStyle.getPropertyValue("--foreground-100");
  const arrowLength = p.width * 0.05;

  const mousePosition = p.createVector(p.mouseX, p.mouseY);
  const chargeRadius = p.width * 0.025;
  const chargeDiameter = chargeRadius * 2;

  const positiveChargeColor = p.color(
    documentStyle.getPropertyValue("--visual-blue"),
  );
  const negativeChargeColor = p.color(
    documentStyle.getPropertyValue("--visual-red"),
  );
  const fontSize = p.width * 0.035;

  const scaledCharges = charges.map((charge) => {
    return {
      position: charge.position.copy().mult(p.width / MAX_WIDTH),
      magnitude: charge.magnitude,
    };
  });

  if (p.mouseIsPressed) {
    for (let i = 0; i < charges.length; i++) {
      if (
        mousePosition.dist(scaledCharges[i].position) < chargeRadius &&
        !selectedCharge
      ) {
        selectedCharge = charges[i];
        break;
      }
    }
  }

  const scaledMousePosition = mousePosition.copy().mult(MAX_WIDTH / p.width);
  if (selectedCharge) {
    if (p.mouseIsPressed) {
      selectedCharge.position.x = p.min(
        p.max(0, scaledMousePosition.x),
        MAX_WIDTH,
      );
      selectedCharge.position.y = p.min(
        p.max(0, scaledMousePosition.y),
        MAX_HEIGHT,
      );
    } else {
      selectedCharge = null;
    }
  }

  p.push();
  p.translate((0.5 * p.width) / numArrows.x, (0.5 * p.height) / numArrows.y);
  p.fill(arrowColor);
  p.stroke(arrowColor);
  p.strokeWeight(p.width * 0.0049);

  for (let x = 0; x < numArrows.x; x++) {
    for (let y = 0; y < numArrows.y; y++) {
      const tailX = (x / numArrows.x) * p.width;
      const tailY = (y / numArrows.y) * p.height;

      const tail = p.createVector(tailX, tailY);

      const resultantForce = p.createVector(0, 0);
      for (const charge of scaledCharges) {
        const distance = tail.dist(charge.position);
        const forceMagnitude = equation(1, charge.magnitude, distance);
        const displacement = tail.copy().sub(charge.position);
        const force = displacement.setMag(forceMagnitude);
        resultantForce.add(force);
      }

      const arrowVector = resultantForce.copy().setMag(arrowLength);

      const headX = tailX + arrowVector.x;
      const headY = tailY + arrowVector.y;

      arrow(p, tailX, tailY, headX, headY);
    }
  }
  p.pop();

  p.push();
  p.textFont("KaTex_Main");
  p.textSize(fontSize);
  p.textAlign(p.CENTER);
  for (let i = 0; i < scaledCharges.length; i++) {
    p.push();
    const charge = scaledCharges[i];
    const lerpFactor = (charge.magnitude + 1) * 0.5;
    p.fill(p.lerpColor(negativeChargeColor, positiveChargeColor, lerpFactor));
    p.circle(charge.position.x, charge.position.y, chargeDiameter);
    p.fill(documentStyle.getPropertyValue("--foreground-100"));
    p.translate(0, fontSize * 0.3);
    p.text(`${i + 1}`, charge.position.x, charge.position.y);
    p.pop();
  }
  p.pop();
};

const sketch = defaultSketch({ draw, setup });

export function ElectricField() {
  const chargeDisplay1 = useRef<HTMLSpanElement>(null);
  const chargeDisplay2 = useRef<HTMLSpanElement>(null);

  const chargeDisplays = [chargeDisplay1, chargeDisplay2];

  return (
    <div>
      <StyledP5Container sketch={sketch} />
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4">
        {Array.from({ length: numCharges }).map((_, i) => {
          return (
            <Fragment key={i}>
              <span>Charge {i + 1}</span>
              <BaseSlider
                step={0.01}
                min={-1}
                max={1}
                defaultValue={[1]}
                onValueChange={([value]) => {
                  if (chargeDisplays[i].current) {
                    chargeDisplays[i].current.innerText = `${value}`;
                  }
                  if (charges[i]) {
                    charges[i].magnitude = value;
                  }
                }}
              />
              <span ref={chargeDisplays[i]} className="min-w-12">
                1
              </span>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

const EPSILON_ZERO = 8.8 * 10e-12;
const equation = (q1: number, q2: number, r: number) => {
  return (q1 * q2) / (4 * Math.PI * EPSILON_ZERO * r * r);
};
