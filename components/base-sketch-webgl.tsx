"use client";
import { type P5ContainerRef, type P5Sketch } from "@/components/p5-container";
import P5Types, { type Renderer } from "p5";

export type DrawGL = (params: {
  p5: P5Types;
  parentRef: P5ContainerRef;
  canvas: Renderer;
  camera: P5Types.Camera;
  parentStyle: CSSStyleDeclaration;
  canvasWidth: number;
  canvasHeight: number;
}) => void;

export type SetupGL = (params: {
  p5: P5Types;
  parentRef: P5ContainerRef;
  canvas: Renderer;
  camera: P5Types.Camera;
  parentStyle: CSSStyleDeclaration;
  canvasWidth: number;
  canvasHeight: number;
}) => void;

export const baseSketchWebGL = ({ draw, setup }: { draw?: DrawGL; setup?: SetupGL }) => {
  const sketch: P5Sketch = (p5, parentRef) => {
    let parentStyle: CSSStyleDeclaration;
    let canvasWidth: number;
    let canvasHeight: number;
    let canvas: Renderer;
    let camera: P5Types.Camera;

    p5.setup = () => {
      parentStyle = getComputedStyle(parentRef);
      canvasWidth = parseFloat(parentStyle.width);
      canvasHeight = parseFloat(parentStyle.height);
      canvas = p5.createCanvas(canvasWidth, canvasHeight, p5.WEBGL).parent(parentRef);
      canvas.style("position: absolute");
      canvas.style("top: 0");
      canvas.style("left: 0");
      canvas.style("width: 100%");
      canvas.style("height: 100%");

      camera = p5.createCamera();

      if (setup) {
        setup({
          p5,
          parentRef,
          canvas,
          camera,
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
        draw({ p5, parentRef, canvas, camera, parentStyle, canvasWidth, canvasHeight });
      }
    };
  };
  return sketch;
};
