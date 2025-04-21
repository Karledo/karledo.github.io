"use client";

import { StyledP5Container, type P5Sketch } from "@/components/p5-container";
import { arrow } from "@/utils/p5-helper";

const sketch: P5Sketch = (p5, parentRef) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasWidth: number;
  let canvasHeight: number;

  p5.setup = () => {
    parentStyle = getComputedStyle(parentRef);
    canvasHeight = parseFloat(parentStyle.width);
    canvasWidth = parseFloat(parentStyle.height);
    const canvas = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    canvas.style("position: absolute");
    canvas.style("top: 0");
    canvas.style("left: 0");
    canvas.style("width: 100%");
    canvas.style("height: 100%");
  };

  const drawGrid = (width: number, height: number, spacing: number) => {
    p5.push();
    const gridColor = getComputedStyle(parentRef).getPropertyValue("--color-background-300");
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const gridLinesX = p5.ceil(width / spacing);
    const gridLinesY = p5.ceil(height / spacing);

    p5.translate(p5.width * 0.5, p5.height * 0.5);
    p5.stroke(gridColor);
    p5.strokeWeight(p5.width * 0.0031);

    for (let i = -gridLinesY; i < gridLinesY; i++) {
      const frac = i / gridLinesY;
      p5.line(-halfWidth, height * frac, halfWidth, height * frac);
    }

    for (let i = -gridLinesX; i < gridLinesX; i++) {
      const frac = i / gridLinesX;
      p5.line(width * frac, -halfHeight, width * frac, halfHeight);
    }

    p5.pop();
  };

  p5.draw = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    parentStyle = getComputedStyle(parentRef);
    canvasWidth = parseFloat(parentStyle.width);
    canvasHeight = parseFloat(parentStyle.height);
    p5.resizeCanvas(canvasWidth, canvasHeight);
    p5.clear();

    const fontSize = p5.round(p5.width * 0.032);
    const spacing = p5.width * (1 / 15);
    const length = spacing * 3;
    const unit = (number: number) => number * spacing;
    const arrowHeadSize = p5.width * 0.025;
    const font = "KaTex_Main";

    drawGrid(p5.width, p5.height, spacing);

    p5.translate(p5.width * 0.5, p5.height * 0.5);
    p5.strokeWeight(p5.width * 0.0078);

    // Blue Line
    const blue = documentStyle.getPropertyValue("--visual-blue");
    p5.stroke(blue);
    p5.fill(blue);
    arrow({
      p5,
      tailX: 0,
      tailY: 0,
      headX: length - arrowHeadSize,
      headY: -length + arrowHeadSize,
      arrowHeadSize,
    });

    // Red Line
    const red = documentStyle.getPropertyValue("--visual-red");
    p5.stroke(red);
    p5.fill(red);
    arrow({
      p5,
      tailX: 0,
      tailY: 0,
      headX: length - arrowHeadSize,
      headY: 0,
    });

    //  Green Line
    const green = documentStyle.getPropertyValue("--visual-green");
    p5.stroke(green);
    p5.fill(green);
    arrow({
      p5,
      tailX: length,
      tailY: 0,
      headX: length,
      headY: -length + arrowHeadSize,
    });

    // Text
    p5.textAlign(p5.CENTER);
    p5.textFont(font);
    p5.textSize(fontSize);
    p5.noStroke();

    p5.fill("#58C4DD");
    p5.text("1", length * 0.5 - unit(0.5), -length * 0.5 - unit(0.5));

    p5.fill("#FC6255");
    p5.text("√(1/2)", length * 0.5, unit(0.75));

    p5.fill("#83C167");
    p5.text("√(1/2)", length + unit(1), -length * 0.5 + unit(0.25));
  };
};

export function SplittingWaveComponents() {
  return (
    <StyledP5Container sketch={sketch} />
  );
}
