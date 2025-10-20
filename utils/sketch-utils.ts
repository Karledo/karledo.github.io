import P5 from "p5";

export const arrow = (
  p: P5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  arrowHeadSize: number = p.width * 0.017,
  doubleSided: boolean = false,
) => {
  const point1 = p.createVector(x1, y1);
  const point2 = p.createVector(x2, y2);

  const dir = point2.copy().sub(point1).normalize();
  const perp = dir.copy().rotate(p.PI * 0.5);

  const tail = doubleSided ? point1.copy().add(dir.copy().mult(arrowHeadSize)) : point1;
  const head = point2.copy().add(dir.copy().mult(-arrowHeadSize));

  p.push();
  p.line(tail.x, tail.y, head.x, head.y);

  const headTrianglePoint1 = head.copy().add(perp.copy().mult(arrowHeadSize / 2));
  const headTrianglePoint2 = head.copy().add(perp.copy().mult(-arrowHeadSize / 2));

  p.noStroke();
  p.triangle(
    headTrianglePoint1.x,
    headTrianglePoint1.y,
    headTrianglePoint2.x,
    headTrianglePoint2.y,
    point2.x,
    point2.y,
  );

  if (doubleSided) {
    const tailTrianglePoint1 = tail.copy().add(perp.copy().mult(-arrowHeadSize / 2));
    const tailTrianglePoint2 = tail.copy().add(perp.copy().mult(arrowHeadSize / 2));

    p.triangle(
      tailTrianglePoint1.x,
      tailTrianglePoint1.y,
      tailTrianglePoint2.x,
      tailTrianglePoint2.y,
      point1.x,
      point1.y,
    );
  }
  p.pop();
};

export const marque = (p: P5, x1: number, y1: number, x2: number, y2: number) => {
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

export const grid = (p: P5, spacing: number) => {
  const halfWidth = p.width * 0.5;
  const halfHeight = p.height * 0.5;
  const gridLinesX = Math.round(halfWidth / spacing);
  const gridLinesY = Math.round(halfWidth / spacing);

  p.push();
  p.translate(halfWidth, halfHeight);

  for (let i = -gridLinesX; i <= gridLinesX; i++) {
    const x = i * spacing;
    p.line(x, -halfHeight, x, halfHeight);
  }

  for (let i = -gridLinesY; i <= gridLinesY; i++) {
    const y = i * spacing;
    p.line(-halfWidth, y, halfWidth, y);
  }

  p.pop();
};

export const createText = (p: P5, ...args: string[]) => {
  return Object.fromEntries(
    args.map((value) => {
      return [value, p.createP().style("font-size", "1rem")];
    }),
  );
};
