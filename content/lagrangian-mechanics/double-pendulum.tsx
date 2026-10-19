"use client";
import { StyledP5Container } from "@/components/p5-container";
import type P5 from "p5";
import { P5Sketch } from "@/components/p5-container"
import { arrow } from "@/utils/sketch-utils";
import katex from "katex";


type LagrangeConstants = {
  L1: number,
  L2: number,
  g: number,
  m1: number,
  m2: number
}

const f = (s: number[], { L1, L2, m1, m2, g }: LagrangeConstants): number[] => {
  const [th1, th2, th1_dot, th2_dot] = s
  const th1_ddot = (-L1 * m2 * Math.pow(th1_dot, 2) * Math.sin(2 * th1 - 2 * th2) - 2 * L2 * m2 * Math.pow(th2_dot, 2) * Math.sin(th1 - th2) - 2 * g * m1 * Math.sin(th1) - g * m2 * Math.sin(th1) - g * m2 * Math.sin(th1 - 2 * th2)) / (L1 * (2 * m1 - m2 * Math.cos(2 * th1 - 2 * th2) + m2))
  const th2_ddot = (2 * L1 * m1 * Math.pow(th1_dot, 2) * Math.sin(th1 - th2) + 2 * L1 * m2 * Math.pow(th1_dot, 2) * Math.sin(th1 - th2) + L2 * m2 * Math.pow(th2_dot, 2) * Math.sin(2 * th1 - 2 * th2) - g * m1 * Math.sin(th2) + g * m1 * Math.sin(2 * th1 - th2) - g * m2 * Math.sin(th2) + g * m2 * Math.sin(2 * th1 - th2)) / (L2 * (2 * m1 - m2 * Math.cos(2 * th1 - 2 * th2) + m2))
  return [th1_dot, th2_dot, th1_ddot, th2_ddot]
}

const rk4 = (s: number[], dt: number, constants: LagrangeConstants): number[] => {
  const add = (a: number[], b: number[], k: number) => a.map((v, i) => v + b[i] * k)
  const k1 = f(s, constants)
  const k2 = f(add(s, k1, dt / 2), constants)
  const k3 = f(add(s, k2, dt / 2), constants)
  const k4 = f(add(s, k3, dt), constants)
  return s.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]))
}

const sketch: P5Sketch = (p, container) => {
  const p5 = p.constructor as unknown as typeof P5
  let position: P5.Vector

  const fixedDeltaTime = 1 / 60;

  let th1 = 0;
  let th1_dot = 0;
  let th2 = 0;
  let th2_dot = 0;

  let th1_elt: P5.Element;
  let th2_elt: P5.Element;

  p.setup = () => {
    p.colorMode(p.HSL)
    p.createCanvas(container.clientWidth, container.clientHeight, p.WEBGL)
      .style("position", "absolute")
      .style("touch-action", "none")
      .style("top", "0px")
      .style("left", "0px")
      .style("width", "100%")
      .style("height", "100%");
    position = p.createVector(0, 0);

    th1_elt = p.createElement("div").style("translate", "-50% 0")
      .style("user-select", "none")
      .style("pointer-events", "none")
      .style("cursor", "pointer")
    th2_elt = p.createElement("div").style("translate", "-50% 0")
      .style("user-select", "none")
      .style("pointer-events", "none")
      .style("cursor", "pointer")

  }

  let T = 0;

  p.draw = () => {
    if (p.width !== container.clientWidth || p.height !== container.clientHeight) {
      p.resizeCanvas(container.clientWidth, container.clientHeight)
    }
    p.clear()
    p.noStroke()

    const g = 750;
    const documentStyle = getComputedStyle(document.documentElement);
    const background3 = documentStyle.getPropertyValue("--background-300")
    const foreground1 = documentStyle.getPropertyValue("--foreground-100");
    const foreground3 = documentStyle.getPropertyValue("--foreground-300");
    // const blue = documentStyle.getPropertyValue("--visual-blue");
    // const red = documentStyle.getPropertyValue("--visual-red");
    // const green = documentStyle.getPropertyValue("--visual-green");
    const fontSize = `${p.width * 0.025}px`;

    const strokeWeight = p.width * 0.0025;

    if (p.mouseIsPressed && p.mouseButton == p.LEFT) {
      if (p.mouseX >= 0 && p.mouseX <= p.width &&
        p.mouseY >= 0 && p.mouseY <= p.height) {

        const x = p.mouseX - p.width * 0.5
        const y = p.mouseY

        th1 = Math.atan2(x, y)
        th1_dot = 0
        th2 = th1
        th2_dot = 0
      }
    }

    const L1 = p.height * 0.4;
    const L2 = L1;

    T += Math.min(p.deltaTime / 1000, 0.1);
    const constants: LagrangeConstants = { L1, L2, g, m1: 1, m2: 1 }
    while (T > fixedDeltaTime) {
      if (!(p.mouseIsPressed && p.mouseButton == p.LEFT &&
        p.mouseX >= 0 && p.mouseX <= p.width &&
        p.mouseY >= 0 && p.mouseY <= p.height
      )) {
        const s = [th1, th2, th1_dot, th2_dot];
        const [new_th1, new_th2, new_th1_dot, new_th2_dot] = rk4(s, fixedDeltaTime, constants)
        th1 = new_th1
        th2 = new_th2
        th1_dot = new_th1_dot
        th2_dot = new_th2_dot

      }
      T -= fixedDeltaTime;
    }

    const x1 = L1 * Math.sin(th1)
    const y1 = L1 * Math.cos(th1)
    const x2 = x1 + L2 * Math.sin(th2)
    const y2 = y1 + L2 * Math.cos(th2)


    p.push()
    p.stroke(background3)
    p.strokeWeight(strokeWeight)
    p.line(0, -p.height * 0.5, 0, p.height * 0.5)
    p.line(x1, -p.height * 0.5, x1, p.height * 0.5)
    p.pop()

    p.push()
    p.stroke(foreground3)
    p.strokeWeight(strokeWeight)
    p.translate(0, -p.height * 0.5)
    p.line(0, 0, x1, y1)
    p.line(x1, y1, x2, y2)
    p.pop()

    p.push();
    p.noFill()
    p.strokeWeight(p.width * 0.0025)
    p.stroke(foreground3)
    const r1 = p.width * 0.04
    const r2 = p.width * 0.06
    const angle1 = p.PI / 2 - th1;
    const angle2 = p.PI / 2 - th2;
    p.translate(0, -p.height * 0.5);
    p.arc(0, 0, r1 * 2, r1 * 2, Math.min(p.PI / 2, angle1), Math.max(p.PI / 2, angle1));
    p.arc(x1, y1, r2 * 2, r2 * 2, Math.min(p.PI / 2, angle2), Math.max(p.PI / 2, angle2));
    p.pop();

    p.push();
    const text_r = r1 + p.width * 0.005;
    const rel_x1 = text_r * Math.sin(th1 * 0.5);
    const rel_y1 = text_r * Math.cos(th1 * 0.5);
    th1_elt.position(p.width * 0.5 + rel_x1, rel_y1);
    th1_elt.style("font-size", fontSize);

    katex.render(String.raw`\theta_1`, th1_elt.elt);

    const text_r2 = r2 + p.width * 0.005;
    const rel_x2 = x1 + text_r2 * Math.sin(th2 * 0.5);
    const rel_y2 = y1 + text_r2 * Math.cos(th2 * 0.5);
    th2_elt.position(p.width * 0.5 + rel_x2, rel_y2);
    th2_elt.style("font-size", fontSize);
    katex.render(String.raw`\theta_2`, th2_elt.elt);
    p.pop();


    const radius = p.width * 0.025;
    p.push();
    p.fill(foreground1);
    p.translate(0, -p.height * 0.5)
    p.circle(x1, y1, radius * 2);
    p.circle(x2, y2, radius * 2);
    p.pop();
  }
}

export function DoublePendulum() {
  return <div className="w-full aspect-video">
    <StyledP5Container sketch={sketch} />
    <span className="text-sm text-foreground-300">Press to set the angle of the double pendulum</span>
  </div>
}
