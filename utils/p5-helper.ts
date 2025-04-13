import { type P5ContainerRef } from "@/components/p5-container";
import P5Types from "p5";

export type P5Params = { p5: P5Types; parentRef?: P5ContainerRef };

export const sub = (v1: P5Types.Vector, v2: P5Types.Vector) => {
  return v1.copy().sub(v2);
};

export const add = (v1: P5Types.Vector, v2: P5Types.Vector) => {
  return v1.copy().add(v2);
};

type ArrowParams = {
  tailX: number;
  tailY: number;
  headX: number;
  headY: number;
  arrowHeadSize?: number;
  doubleSided?: boolean;
};

export const arrow = ({
  p5,
  tailX,
  tailY,
  headX,
  headY,
  arrowHeadSize,
  doubleSided = false,
}: P5Params & ArrowParams) => {
  if (!arrowHeadSize) {
    arrowHeadSize = p5.width * 0.021;
  }
  p5.push();

  const tail = p5.createVector(tailX, tailY);
  const head = p5.createVector(headX, headY);
  const direction = sub(head, tail).normalize();
  const directionPerpendicular = direction.copy().rotate(p5.PI * 0.5);

  p5.line(tail.x, tail.y, head.x, head.y);

  const headPoint1 = add(head, directionPerpendicular.copy().mult(arrowHeadSize * 0.5));
  const headPoint2 = add(head, directionPerpendicular.copy().mult(-arrowHeadSize * 0.5));
  const headTip = add(head, direction.copy().mult(arrowHeadSize));

  p5.noStroke();
  p5.triangle(headPoint1.x, headPoint1.y, headPoint2.x, headPoint2.y, headTip.x, headTip.y);
  if (doubleSided) {
    const tailPoint1 = add(tail, directionPerpendicular.copy().mult(arrowHeadSize * 0.5));
    const tailPoint2 = add(tail, directionPerpendicular.copy().mult(-arrowHeadSize * 0.5));
    const tailTip = add(tail, direction.copy().mult(-arrowHeadSize));
    p5.triangle(tailPoint1.x, tailPoint1.y, tailPoint2.x, tailPoint2.y, tailTip.x, tailTip.y);
  }
  p5.pop();
};

type MarqueParams = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export const marque = ({ p5, x1, y1, x2, y2 }: P5Params & MarqueParams) => {
  p5.push();
  p5.rectMode(p5.CORNERS);
  p5.erase();
  p5.rect(0, 0, p5.width, y1);
  p5.rect(0, y1, x1, y2);
  p5.rect(0, y2, p5.width, p5.height);
  p5.rect(x2, y1, p5.width, y2);
  p5.noErase();
  p5.pop();
};
