import { type P5Container } from "@/components/p5-container";
import P5 from "p5";

export type P5Params = { p: P5; containerRef?: P5Container };

export const sub = (v1: P5.Vector, v2: P5.Vector) => {
  return v1.copy().sub(v2);
};

export const add = (v1: P5.Vector, v2: P5.Vector) => {
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
  p,
  tailX,
  tailY,
  headX,
  headY,
  arrowHeadSize,
  doubleSided = false,
}: P5Params & ArrowParams) => {
  if (!arrowHeadSize) {
    arrowHeadSize = p.width * 0.021;
  }
  p.push();

  const tail = p.createVector(tailX, tailY);
  const head = p.createVector(headX, headY);
  const direction = sub(head, tail).normalize();
  const directionPerpendicular = direction.copy().rotate(p.PI * 0.5);

  p.line(tail.x, tail.y, head.x, head.y);

  const headPoint1 = add(head, directionPerpendicular.copy().mult(arrowHeadSize * 0.5));
  const headPoint2 = add(head, directionPerpendicular.copy().mult(-arrowHeadSize * 0.5));
  const headTip = add(head, direction.copy().mult(arrowHeadSize));

  p.noStroke();
  p.triangle(headPoint1.x, headPoint1.y, headPoint2.x, headPoint2.y, headTip.x, headTip.y);
  if (doubleSided) {
    const tailPoint1 = add(tail, directionPerpendicular.copy().mult(arrowHeadSize * 0.5));
    const tailPoint2 = add(tail, directionPerpendicular.copy().mult(-arrowHeadSize * 0.5));
    const tailTip = add(tail, direction.copy().mult(-arrowHeadSize));
    p.triangle(tailPoint1.x, tailPoint1.y, tailPoint2.x, tailPoint2.y, tailTip.x, tailTip.y);
  }
  p.pop();
};

type MarqueParams = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export const marque = ({ p, x1, y1, x2, y2 }: P5Params & MarqueParams) => {
  p.push();
  p.rectMode(p.CORNERS);
  p.erase();
  p.rect(0, 0, p.width, y1);
  p.rect(0, y1, x1, y2);
  p.rect(0, y2, p.width, p.height);
  p.rect(x2, y1, p.width, y2);
  p.noErase();
  p.pop();
};

type ArrowContext = {
  p: P5;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  size: number;
  color: P5.Color;
  doubleSided: boolean;
};

export class Arrow {
  context: ArrowContext;

  constructor(
    context: Omit<ArrowContext, "size" | "color" | "doubleSided"> &
      Pick<Partial<ArrowContext>, "size" | "color" | "doubleSided">,
  ) {
    const p = context.p;
    if (context.size === undefined) context.size = p.width * 0.017;
    if (context.doubleSided === undefined) context.doubleSided = false;
    this.context = context as typeof this.context;
  }

  updateContext(context: Partial<ArrowContext>) {
    Object.assign(this.context, context);
  }

  draw() {
    const { p, x1, y1, x2, y2, size, color, doubleSided } = this.context;

    const tail = p.createVector(x1, y1);
    const head = p.createVector(x2, y2);
    const direction = sub(head, tail).normalize();
    const directionPerpendicular = direction.copy().rotate(p.PI * 0.5);

    p.push();

    if (color) {
      p.fill(color);
      p.stroke(color);
    }

    p.line(tail.x, tail.y, head.x, head.y);

    p.noStroke();
    const headPoint1 = add(add(head, direction.copy().mult(-size)), directionPerpendicular.copy().mult(size * 0.5));
    const headPoint2 = add(add(head, direction.copy().mult(-size)), directionPerpendicular.copy().mult(-size * 0.5));
    p.triangle(headPoint1.x, headPoint1.y, headPoint2.x, headPoint2.y, head.x, head.y);

    if (doubleSided) {
      const tailPoint1 = add(add(tail, direction.copy().mult(size)), directionPerpendicular.copy().mult(size * 0.5));
      const tailPoint2 = add(add(tail, direction.copy().mult(size)), directionPerpendicular.copy().mult(-size * 0.5));
      p.triangle(tailPoint1.x, tailPoint1.y, tailPoint2.x, tailPoint2.y, tail.x, tail.y);
    }
    p.pop();
  }
}
