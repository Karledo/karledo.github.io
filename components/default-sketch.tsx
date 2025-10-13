"use client";

import { P5Container, type P5Sketch } from "@/components/p5-container";
import P5 from "p5";

export type P5Context<T> = {
  p: P5;
  container: P5Container;
  containerStyle: CSSStyleDeclaration;
  width: number;
  height: number;
  renderer: P5.Renderer;
  state: T;
};

export type Setup<T = undefined> = (context: P5Context<T>) => void;
export type Draw<T = undefined> = (context: P5Context<T>) => void;

interface DefaultSketch<T> {
  setup: Setup<T>;
  draw: Draw<T>;
}

export const defaultSketch = <T,>({ setup, draw }: DefaultSketch<T>) => {
  const sketch: P5Sketch = (p, container) => {
    const context = { p, container, state: {} } as P5Context<T>;

    const updateContext = () => {
      context.containerStyle = window.getComputedStyle(container);
      context.width = parseFloat(context.containerStyle.getPropertyValue("width"));
      context.height = parseFloat(context.containerStyle.getPropertyValue("height"));
    };

    const updateRendererStyle = () => {
      if (context.renderer) {
        context.renderer
          .style("position", "absolute")
          .style("top", "0px")
          .style("left", "0px")
          .style("width", "100%")
          .style("height", "100%");
        context.renderer.attribute("width", `${context.width}`);
        context.renderer.attribute("height", `${context.height}`);
      }
    };

    p.setup = () => {
      updateContext();
      const { width, height } = context;
      context.renderer = p.createCanvas(width, height).parent(container);
      updateRendererStyle();

      if (setup) setup(context as P5Context<T>);
    };

    p.draw = () => {
      updateContext();
      updateRendererStyle();
      const { width, height } = context;
      if (width && height) p.resizeCanvas(width, height, true);

      if (draw) draw(context as P5Context<T>);
    };
  };

  return sketch;
};

export const defaultSketchWebGL2D = <T,>({ setup, draw }: DefaultSketch<T>) => {
  const sketch: P5Sketch = (p, container) => {
    const context = { p } as P5Context<T>;

    let font: P5.Font;

    const updateContext = () => {
      context.containerStyle = window.getComputedStyle(container);
      context.width = parseFloat(context.containerStyle.getPropertyValue("width"));
      context.height = parseFloat(context.containerStyle.getPropertyValue("height"));
    };

    const updateRendererStyle = () => {
      if (context.renderer) {
        context.renderer
          .style("position", "absolute")
          .style("top", "0px")
          .style("left", "0px")
          .style("width", "100%")
          .style("height", "100%");
        context.renderer.attribute("width", `${context.width}`);
        context.renderer.attribute("height", `${context.height}`);
      }
    };

    p.preload = () => {
      font = p.loadFont("/Roboto-Regular.ttf");
    };

    p.setup = () => {
      updateContext();
      const { width, height } = context;
      context.renderer = p.createCanvas(width!, height!, p.WEBGL).parent(container);
      updateRendererStyle();
      p.textFont(font);

      if (setup) setup(context as P5Context<T>);
    };

    p.draw = () => {
      updateContext();
      updateRendererStyle();
      const { width, height } = context;
      if (width && height) p.resizeCanvas(width, height, true);

      if (draw) draw(context as P5Context<T>);
    };
  };

  return sketch;
};
