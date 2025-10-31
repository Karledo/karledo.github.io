import { P5Container, type P5Sketch } from "@/components/p5-container";
import P5 from "p5";

export type P5Context = {
  p: P5;
  container: P5Container;
  renderer: P5.Renderer;
};

export type P5ContextGL = P5Context & {
  camera: P5.Camera;
};

export type Setup = (context: P5Context) => void;
export type Draw = (context: P5Context) => void;
export type DrawGL = (context: P5ContextGL) => void;
export type SetupGL = (context: P5ContextGL) => void;

function calculateRendererSize(container: P5Container) {
  const style = window.getComputedStyle(container);
  const width = parseFloat(style.getPropertyValue("width"));
  const height = parseFloat(style.getPropertyValue("height"));
  return { width, height };
}

function updateRendererStyle(context: P5Context) {
  if (!context.renderer) return;

  const { width, height } = calculateRendererSize(context.container);

  context.renderer
    .style("position", "absolute")
    .style("top", "0px")
    .style("left", "0px")
    .style("width", "100%")
    .style("height", "100%");
  context.renderer.attribute("width", `${width}`);
  context.renderer.attribute("height", `${height}`);
}

function defaultSetup(context: P5Context) {
  const { p, container } = context;
  updateRendererStyle(context);
  const { width, height } = calculateRendererSize(container);
  p.resizeCanvas(width, height, true);
}

function defaultDraw(context: P5Context) {
  const { p, container } = context;
  updateRendererStyle(context);
  const { width, height } = calculateRendererSize(container);
  p.resizeCanvas(width, height, true);
}

export function defaultSketch({ setup, draw }: { setup: Setup; draw: Draw }) {
  const sketch: P5Sketch = (p, container) => {
    const context = { p, container } as P5Context;

    p.setup = () => {
      context.renderer = p.createCanvas(0, 0).parent(container);
      defaultSetup(context);
      if (setup) setup(context);
    };

    p.draw = () => {
      defaultDraw(context);
      if (draw) draw(context);
    };
  };

  return sketch;
}

export function defaultSketchWebGL({
  draw,
  setup,
}: {
  setup: SetupGL;
  draw: DrawGL;
}) {
  const sketch: P5Sketch = (p, container) => {
    const context = { p, container } as P5ContextGL;

    p.setup = () => {
      context.renderer = p.createCanvas(0, 0, p.WEBGL).parent(container);
      defaultSetup(context);
      context.camera = p.createCamera();
      if (setup) setup(context);
    };

    p.draw = () => {
      defaultDraw(context);
      if (draw) draw(context);
    };
  };

  return sketch;
}
