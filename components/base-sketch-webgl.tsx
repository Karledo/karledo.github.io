"use client";
import { type P5ContainerRef, type P5Sketch } from "@/components/p5-container";
import p5Types from "p5";

export type DrawGL = (params: { p5: p5Types, parentRef: P5ContainerRef, camera: p5Types.Camera }) => void;

export const baseSketchWebGL = (draw: DrawGL) => {
  const sketch: P5Sketch = (p5, parentRef) => {
    let parentStyle: CSSStyleDeclaration;
    let canvasWidth: number;
    let canvasHeight: number;
    let camera: p5Types.Camera

    p5.setup = () => {
      parentStyle = getComputedStyle(parentRef);
      canvasWidth = parseFloat(parentStyle.width);
      canvasHeight = parseFloat(parentStyle.height);
      const canvas = p5
        .createCanvas(canvasWidth, canvasHeight, p5.WEBGL)
        .parent(parentRef);
      canvas.style("position: absolute");
      canvas.style("top: 0");
      canvas.style("left: 0");
      canvas.style("width: 100%");
      canvas.style("height: 100%");

      camera = p5.createCamera()
    };

    p5.draw = () => {
      parentStyle = getComputedStyle(parentRef);
      canvasWidth = parseFloat(parentStyle.width);
      canvasHeight = parseFloat(parentStyle.height);
      p5.resizeCanvas(canvasWidth, canvasHeight);

      draw({ p5, parentRef, camera });
    };
  };
  return sketch;
};
