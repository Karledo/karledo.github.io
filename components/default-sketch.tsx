"use client";

import { P5Container, type P5Sketch } from "@/components/p5-container";
import P5 from "p5";

export type P5Context = {
  p: P5;
  container: P5Container;
  containerStyle: CSSStyleDeclaration;
  width: number;
  height: number;
  renderer: P5.Renderer;
  state: Record<string, unknown>;
};

export type Setup = (context: P5Context) => void;
export type Draw = (context: P5Context) => void;

type P5SketchParams = {
  setup?: (context: P5Context) => void;
  draw?: (context: P5Context) => void;
};

export const defaultSketch = ({ setup, draw }: P5SketchParams) => {
  const sketch: P5Sketch = (p, container) => {
    const context: Partial<P5Context> = {
      p,
      state: {},
    };

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
      context.renderer = p.createCanvas(width!, height!).parent(container);
      updateRendererStyle();

      if (setup) setup(context as P5Context);
    };

    p.draw = () => {
      updateContext();
      updateRendererStyle();
      const { width, height } = context;
      if (width && height) p.resizeCanvas(width, height, true);

      if (draw) draw(context as P5Context);
    };
  };

  return sketch;
};

export const defaultSketchWebGL2D = ({ setup, draw }: P5SketchParams) => {
  const sketch: P5Sketch = (p, container) => {
    const context: Partial<Omit<P5Context, "state">> & Pick<P5Context, "state"> = {
      p,
      state: {},
    };

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

      if (setup) setup(context as P5Context);
    };

    p.draw = () => {
      updateContext();
      updateRendererStyle();
      const { width, height } = context;
      if (width && height) p.resizeCanvas(width, height, true);

      if (draw) draw(context as P5Context);
    };
  };

  return sketch;
};
