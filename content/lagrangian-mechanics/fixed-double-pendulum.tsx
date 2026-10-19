"use client";
import { StyledP5Container } from "@/components/p5-container";
import type P5 from "p5";
import { P5Sketch } from "@/components/p5-container"
import { arrow } from "@/utils/sketch-utils";
import katex from "katex";

const sketch: P5Sketch = (p, container) => {
  const p5 = p.constructor as unknown as typeof P5
  let position: P5.Vector

  let th1 = 0;
  let th2 = 0;

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

  let dragging: 1 | 2 | null = null;

  p.draw = () => {
    if (p.width !== container.clientWidth || p.height !== container.clientHeight) {
      p.resizeCanvas(container.clientWidth, container.clientHeight)
    }
    p.clear()
    p.noStroke()

    const documentStyle = getComputedStyle(document.documentElement);
    const background3 = documentStyle.getPropertyValue("--background-300")
    const foreground1 = documentStyle.getPropertyValue("--foreground-100");
    const foreground3 = documentStyle.getPropertyValue("--foreground-300");
    // const blue = documentStyle.getPropertyValue("--visual-blue");
    const red = documentStyle.getPropertyValue("--visual-red");
    const green = documentStyle.getPropertyValue("--visual-green");
    const fontSize = `${p.width * 0.025}px`;

    const strokeWeight = p.width * 0.0025;

    const L1 = p.height * 0.4;
    const L2 = L1;
    const radius = p.width * 0.025;


    if (p.mouseIsPressed && p.mouseButton == p.LEFT) {
      if (p.mouseX >= 0 && p.mouseX <= p.width &&
        p.mouseY >= 0 && p.mouseY <= p.height) {

        const x = p.mouseX - p.width * 0.5
        const y = p.mouseY

        const x1 = L1 * Math.sin(th1)
        const y1 = L1 * Math.cos(th1)
        const x2 = x1 + L2 * Math.sin(th2)
        const y2 = y1 + L2 * Math.cos(th2)

        const activeRadius = radius * 6 * (2 - p.width / 641.51)
        const distanceSqTo1 = (x1 - x) ** 2 + (y1 - y) ** 2
        const distanceSqTo2 = (x2 - x) ** 2 + (y2 - y) ** 2
        const smaller = Math.min(distanceSqTo1, distanceSqTo2);

        if (dragging == 1) {
          th1 = Math.atan2(x, y)
        } else if (dragging == 2) {
          th2 = Math.atan2(x - x1, y - y1)
        }

        if (smaller <= activeRadius * activeRadius && dragging == null) {
          if (smaller == distanceSqTo1) {
            dragging = 1
            th1 = Math.atan2(x, y)
          } else {
            dragging = 2
            th2 = Math.atan2(x - x1, y - y1)
          }
        }
      }
    } else {
      dragging = null;
    };


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

    p.push()
    p.translate(-p.width * 0.5 + p.height * 0.05, -p.height * 0.45)
    p.fill(red)
    p.stroke(red)
    arrow(p, 0, 0, p.width * 0.05, 0)
    p.fill(green)
    p.stroke(green)
    arrow(p, 0, 0, 0, p.width * 0.05)
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


    p.push();
    p.fill(foreground1);
    p.translate(0, -p.height * 0.5)
    p.circle(x1, y1, radius * 2);
    p.circle(x2, y2, radius * 2);
    p.pop();
  }
}

export function FixedDoublePendulum() {
  return <div className="w-full aspect-video">
    <StyledP5Container sketch={sketch} />
    <span className="text-sm text-foreground-300">Press to set the angles of the pendulums</span>
  </div>
}
