"use client";

import { defaultSketch, Draw, Setup } from "@/components/default-sketch";
import { StyledP5Container, type P5Sketch } from "@/components/p5-container";
import { Arrow, arrow } from "@/utils/p5-helper";
import katex from "katex";
import P5 from "p5";

type GridContext = {
  p: P5;
  width: number;
  height: number;
  spacing: number;
  gridColor: P5.Color;
};

class Grid {
  context: Partial<GridContext>;

  constructor(context: Partial<GridContext>) {
    this.context = context;
  }

  updateContext(newContext: Partial<GridContext>) {
    Object.assign(this.context, newContext);
  }

  draw() {
    const { p, spacing, gridColor } = this.context as GridContext;

    const halfWidth = p.width * 0.5;
    const halfHeight = p.height * 0.5;
    const gridLinesX = Math.round(halfWidth / spacing);
    const gridLinesY = Math.round(halfWidth / spacing);

    p.push();
    p.translate(halfWidth, halfHeight);
    p.stroke(gridColor);
    p.strokeWeight(p.width * 0.0031);

    for (let i = -gridLinesX; i <= gridLinesX; i++) {
      const x = i * spacing;
      p.line(x, -halfHeight, x, halfHeight);
    }

    for (let i = -gridLinesY; i <= gridLinesY; i++) {
      const y = i * spacing;
      p.line(-halfWidth, y, halfWidth, y);
    }

    p.pop();
  }
}

const setup: Setup = ({ p, width, height, state }) => {
  p.colorMode(p.HSL);
  const documentStyle = getComputedStyle(document.documentElement);
  const background = documentStyle.getPropertyValue("--background-300");
  const red = documentStyle.getPropertyValue("--visual-red");
  const green = documentStyle.getPropertyValue("--visual-green");
  const blue = documentStyle.getPropertyValue("--visual-blue");

  const spacing = p.width / 15;
  const grid = new Grid({ p, width, height, spacing, gridColor: p.color(background) });
  state.grid = grid;

  const redArrow = new Arrow({
    p,
    x1: p.width * 0.5,
    y1: p.height * 0.5,
    x2: p.width * 0.5 + spacing * 3,
    y2: p.height * 0.5 - spacing * 3,
    color: p.color(red),
  });

  const greenArrow = new Arrow({
    p,
    x1: p.width * 0.5,
    y1: p.height * 0.5,
    x2: p.width * 0.5 + spacing * 3,
    y2: p.height * 0.5 - spacing * 3,
    color: p.color(green),
  });

  const blueArrow = new Arrow({
    p,
    x1: p.width * 0.5,
    y1: p.height * 0.5,
    x2: p.width * 0.5,
    y2: p.height * 0.5,
    color: p.color(blue),
  });

  state.arrows = { red: redArrow, green: greenArrow, blue: blueArrow };

  const arrowLabelNames = ["green", "red", "blue"];
  const arrowLabels = Object.fromEntries(
    arrowLabelNames.map((value) => {
      const paragraph = p.createP();
      return [value, paragraph];
    }),
  );

  state.labels = arrowLabels;
};

const draw: Draw = ({ p, state }) => {
  p.clear();

  const spacing = p.width / 15;

  const documentStyle = getComputedStyle(document.documentElement);
  const background = documentStyle.getPropertyValue("--background-300");
  const red = documentStyle.getPropertyValue("--visual-red");
  const green = documentStyle.getPropertyValue("--visual-green");
  const blue = documentStyle.getPropertyValue("--visual-blue");

  const grid = state.grid as Grid;
  grid.updateContext({ spacing, gridColor: p.color(background) });
  grid.draw();

  const { red: redArrow, green: greenArrow, blue: blueArrow } = state.arrows as Record<string, Arrow>;

  p.push();
  p.strokeWeight(0.0055 * p.width);
  blueArrow.updateContext({
    x1: p.width * 0.5,
    y1: p.height * 0.5,
    x2: p.width * 0.5 + spacing * 3,
    y2: p.height * 0.5 - spacing * 3,
    color: p.color(blue),
  });
  blueArrow.draw();

  redArrow.updateContext({
    x1: p.width * 0.5,
    y1: p.height * 0.5,
    x2: p.width * 0.5 + spacing * 3,
    y2: p.height * 0.5,
    color: p.color(red),
  });
  redArrow.draw();

  greenArrow.updateContext({
    x1: p.width * 0.5 + spacing * 3,
    y1: p.height * 0.5,
    x2: p.width * 0.5 + spacing * 3,
    y2: p.height * 0.5 - spacing * 3,
    color: p.color(green),
  });
  greenArrow.draw();
  p.pop();

  const labels = state.labels as Record<string, P5.Element>;

  labels.red.style("font-size", "1.125rem").style("color", red);
  labels.red.position(p.width * 0.59, p.height * 0.53);
  katex.render(String.raw`\frac{1}{\sqrt{2}}`, labels.red.elt);

  labels.green.style("font-size", "1.125rem").style("color", green);
  labels.green.position(p.width * 0.73, p.height * 0.31);
  katex.render(String.raw`\frac{1}{\sqrt{2}}`, labels.green.elt);

  labels.blue.style("font-size", "1.125rem").style("color", blue);
  labels.blue.position(p.width * 0.57, p.height * 0.24);
  katex.render(String.raw`1`, labels.blue.elt);
  // p5.translate(p5.width * 0.5, p5.height * 0.5);
  // p5.strokeWeight(p5.width * 0.0078);

  // Blue Line
  // const blue = documentStyle.getPropertyValue("--visual-blue");
  // p5.stroke(blue);
  // p5.fill(blue);
  // arrow({
  //   p: p5,
  //   tailX: 0,
  //   tailY: 0,
  //   headX: length - arrowHeadSize,
  //   headY: -length + arrowHeadSize,
  //   arrowHeadSize,
  // });

  // Red Line
  // const red = documentStyle.getPropertyValue("--visual-red");
  // p5.stroke(red);
  // p5.fill(red);
  // arrow({
  //   p: p5,
  //   tailX: 0,
  //   tailY: 0,
  //   headX: length - arrowHeadSize,
  //   headY: 0,
  // });

  // //  Green Line
  // const green = documentStyle.getPropertyValue("--visual-green");
  // p5.stroke(green);
  // p5.fill(green);
  // arrow({
  //   p: p5,
  //   tailX: length,
  //   tailY: 0,
  //   headX: length,
  //   headY: -length + arrowHeadSize,
  // });
};

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
      p: p5,
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
      p: p5,
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
      p: p5,
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

const otherSketch = defaultSketch({ setup, draw });

export function SplittingWaveComponents() {
  return <StyledP5Container sketch={otherSketch} />;
}
