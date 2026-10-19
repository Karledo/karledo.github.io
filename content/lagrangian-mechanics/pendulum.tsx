"use client";

import { StyledP5Container } from "@/components/p5-container";
import type P5 from "p5";
import { P5Sketch } from "@/components/p5-container"
import { arrow } from "@/utils/sketch-utils";
import katex from "katex";


const sketch: P5Sketch = (p, container) => {
  const p5 = p.constructor as unknown as typeof P5
  let position: P5.Vector

  const fixedDeltaTime = 1 / 60;

  let th1 = 0;
  let th1_dot = 0;

  let theta_elt: P5.Element;

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

    theta_elt = p.createElement("div").style("translate", "-50% 0").position(0, p.height * 0.65)
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
    const red = documentStyle.getPropertyValue("--visual-red");
    const green = documentStyle.getPropertyValue("--visual-green");
    const fontSize = `${p.width * 0.025}px`;

    const strokeWeight = p.width * 0.0025;

    p.push()
    p.stroke(background3)
    p.strokeWeight(strokeWeight)
    p.line(0, -p.height * 0.5, 0, p.height * 0.5)
    p.pop()

    if (p.mouseIsPressed && p.mouseButton == p.LEFT) {
      if (p.mouseX >= 0 && p.mouseX <= p.width &&
        p.mouseY >= 0 && p.mouseY <= p.height) {

        const x = p.mouseX - p.width * 0.5
        const y = p.mouseY
        th1 = Math.atan2(x, y)
        th1_dot = 0
      }
    }

    const L = p.height * 0.65;

    T += Math.min(p.deltaTime / 1000, 0.1);
    while (T > fixedDeltaTime) {
      if (!(p.mouseIsPressed && p.mouseButton == p.LEFT && p.mouseX >= 0 && p.mouseX <= p.width &&
        p.mouseY >= 0 && p.mouseY <= p.height)) {
        const th1_ddot = -(g / L) * Math.sin(th1);
        th1_dot = th1_dot + th1_ddot * fixedDeltaTime;
        th1 = th1 + th1_dot * fixedDeltaTime;
      }
      T -= fixedDeltaTime;
    }

    const th1_ddot = -(g / L) * Math.sin(th1);
    const x_ddot = -L * (th1_ddot * Math.cos(th1) - th1_dot * th1_dot * Math.sin(th1))
    const y_ddot = -L * (th1_ddot * Math.sin(th1) + th1_dot * th1_dot * Math.cos(th1))
    const x = L * Math.sin(th1)
    const y = L * Math.cos(th1)

    p.translate(0, -p.height * 0.5)
    p.push()
    p.stroke(foreground3)
    p.strokeWeight(strokeWeight)
    p.line(0, 0, x, y)
    p.pop()

    p.push();
    p.noFill()
    p.strokeWeight(p.width * 0.0025)
    p.stroke(foreground3)
    const r = p.width * 0.04
    const angle = p.PI / 2 - th1
    p.arc(0, 0, r * 2, r * 2, Math.min(p.PI / 2, angle), Math.max(p.PI / 2, angle))
    p.pop()

    p.push()
    const text_r = r + p.width * 0.005
    theta_elt.position(text_r * Math.sin(th1 * 0.5) + p.width * 0.5, text_r * Math.cos(th1 * 0.5))
    theta_elt.style("font-size", fontSize)
    katex.render(String.raw`\theta`, theta_elt.elt)
    p.pop()


    const radius = p.width * 0.025;
    p.push()
    p.fill(foreground1)
    p.circle(x, y, radius * 2)
    p.pop()

    p.push()
    p.strokeWeight(strokeWeight)
    p.fill(red)
    p.stroke(red)
    const scale = 0.075;
    let red_x1 = x + Math.sign(x_ddot) * radius
    let red_x2 = red_x1 + x_ddot * scale
    arrow(p, red_x1, y, red_x2, y)
    p.fill(green)
    p.stroke(green)
    let green_y1 = y + Math.sign(y_ddot) * radius
    let green_y2 = green_y1 + y_ddot * scale
    arrow(p, x, green_y1, x, green_y2)
    p.pop()
  }
}

export function Pendulum() {
  return <div className="w-full aspect-video">
    <StyledP5Container sketch={sketch} />
    <span className="text-sm text-foreground-300">Press to set the angle of the pendulum</span>
  </div>
}
