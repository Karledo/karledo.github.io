"use client";
import { type P5Container, type P5Sketch } from "@/components/p5-container";
import P5 from "p5";

export type P5ContextGL = {
  p: P5;
  camera: P5.Camera;
  container: P5Container;
  containerStyle: CSSStyleDeclaration;
  renderer: P5.Renderer;
  width: number;
  height: number;
  state: Record<string, unknown>;
};

export type DrawGL = (context: P5ContextGL) => void;
export type SetupGL = (context: P5ContextGL) => void;

export const baseSketchWebGL = ({ draw, setup }: { draw?: DrawGL; setup?: SetupGL }) => {
  const sketch: P5Sketch = (p, container) => {
    const context: Partial<P5ContextGL> = {
      p,
      state: {},
    };

    const updateContext = () => {
      context.containerStyle = getComputedStyle(container);
      context.width = parseFloat(context.containerStyle.width);
      context.height = parseFloat(context.containerStyle.height);
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
      context.renderer = p.createCanvas(context.width!, context.height!, p.WEBGL).parent(container);
      updateRendererStyle();
      context.camera = p.createCamera();

      if (setup) {
        setup(context as P5ContextGL);
      }
    };

    p.draw = () => {
      updateContext();
      updateRendererStyle();

      const { width, height } = context;
      if (width && height) {
        p.resizeCanvas(width, height);
      }

      if (draw) {
        draw(context as P5ContextGL);
      }
    };
  };

  return sketch;
};
