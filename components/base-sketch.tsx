"use client";

import { type P5ContainerRef, type P5Sketch } from "@/components/p5-container";
import P5Types, { type Renderer } from "p5";

export type Draw = (params: {
  p5: P5Types;
  parentRef: P5ContainerRef;
  canvas: Renderer;
  parentStyle: CSSStyleDeclaration;
  canvasWidth: number;
  canvasHeight: number;
}) => void;

export type Setup = (params: {
  p5: P5Types;
  parentRef: P5ContainerRef;
  canvas: Renderer;
  parentStyle: CSSStyleDeclaration;
  canvasWidth: number;
  canvasHeight: number;
}) => void;

export const baseSketch = ({ draw, setup }: { draw?: Draw; setup?: Setup }) => {
  const sketch: P5Sketch = (p5, parentRef) => {
    let parentStyle: CSSStyleDeclaration;
    let canvasWidth: number;
    let canvasHeight: number;
    let canvas: Renderer;

    p5.setup = () => {
      parentStyle = getComputedStyle(parentRef);
      canvasWidth = parseFloat(parentStyle.width);
      canvasHeight = parseFloat(parentStyle.height);
      canvas = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
      canvas.style("position: absolute");
      canvas.style("top: 0");
      canvas.style("left: 0");
      canvas.style("width: 100%");
      canvas.style("height: 100%");

      if (setup) {
        setup({
          p5,
          parentRef,
          canvas,
          parentStyle,
          canvasWidth,
          canvasHeight,
        });
      }
    };

    p5.draw = () => {
      parentStyle = getComputedStyle(parentRef);
      canvasWidth = parseFloat(parentStyle.width);
      canvasHeight = parseFloat(parentStyle.height);
      p5.resizeCanvas(canvasWidth, canvasHeight);

      if (draw) {
        draw({ p5, parentRef, canvas, parentStyle, canvasWidth, canvasHeight });
      }
    };
  };
  return sketch;
};
