"use client";

import { P5Container, type P5Sketch } from "@/components/p5-container";
import P5 from "p5";

export type P5Context = {
  p: P5;
  container: P5Container;
  renderer: P5.Renderer;
};

export type Setup = (context: P5Context) => void;
export type Draw = (context: P5Context) => void;

type DefaultSketch = {
  setup: Setup;
  draw: Draw;
};

export const defaultSketch = ({ setup, draw }: DefaultSketch) => {
  const sketch: P5Sketch = (p, container) => {
    const context = { p, container } as P5Context;

    const calculateRendererSize = () => {
      const style = window.getComputedStyle(container);
      const width = parseFloat(style.getPropertyValue("width"));
      const height = parseFloat(style.getPropertyValue("height"));
      return { width, height };
    };

    const updateRendererStyle = () => {
      if (!context.renderer) return;

      const { width, height } = calculateRendererSize();

      context.renderer
        .style("position", "absolute")
        .style("top", "0px")
        .style("left", "0px")
        .style("width", "100%")
        .style("height", "100%");
      context.renderer.attribute("width", `${width}`);
      context.renderer.attribute("height", `${height}`);
    };

    p.setup = () => {
      context.renderer = p.createCanvas(0, 0).parent(container);
      updateRendererStyle();
      const { width, height } = calculateRendererSize();
      p.resizeCanvas(width, height, true);

      if (setup) setup(context);
    };

    p.draw = () => {
      updateRendererStyle();
      const { width, height } = calculateRendererSize();
      p.resizeCanvas(width, height, true);

      if (draw) draw(context);
    };
  };

  return sketch;
};
