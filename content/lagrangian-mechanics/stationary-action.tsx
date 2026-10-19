"use client";

import { StyledP5Container } from "@/components/p5-container";
import type P5 from "p5";
import katex from "katex";
import { arrow } from "@/utils/sketch-utils";
import { P5Sketch } from "@/components/p5-container"


const sketch: P5Sketch = (p, container) => {
  const p5 = p.constructor as unknown as typeof P5

  const tRange = [-1, 5]
  const yRange = [-1, 5]

  let xLabels: P5.Element[] = []
  let yLabels: P5.Element[] = []
  let zeroLabel: P5.Element;
  let etaLabel: P5.Element;
  let pathLabel: P5.Element;

  let yAxisLabel: P5.Element;
  let tAxisLabel: P5.Element;

  p.setup = () => {
    p.colorMode(p.HSL)
    p.createCanvas(container.clientWidth, container.clientHeight, p.WEBGL)
      .style("position", "absolute")
      .style("touch-action", "none")
      .style("top", "0px")
      .style("left", "0px")
      .style("width", "100%")
      .style("height", "100%");

    const createLabel = () => p.createElement("div").style("translate", "-50% 0")
      .style("position", "absolute")
      .style("user-select", "none")
      .style("pointer-events", "none")
      .style("color", "var(--foreground-300)")
      .style("cursor", "pointer")

    zeroLabel = createLabel()

    tAxisLabel = createLabel().style("color", "var(--foreground-200)")
    yAxisLabel = createLabel().style("color", "var(--foreground-200)")

    etaLabel = createLabel()
    pathLabel = createLabel().style("color", "var(--foreground-100)")

    for (let x = tRange[0]; x <= tRange[1]; x++) {
      if (x == 0) continue;
      xLabels.push(createLabel())
    }

    for (let y = yRange[0]; y <= yRange[1]; y++) {
      if (y == 0) continue;
      yLabels.push(createLabel())
    }
  }

  const f = (t: number) => {
    return -0.5 * (t - 3.5) ** 2 + 4
  }

  const minT = 0.75
  const maxT = 4
  function eta(t: number, m: number = 1) {
    const envelope = (t - minT) * (maxT - t);         // zero at t = 0 and t = T
    const n = p.noise(m + t * 0.5) - 0.5;       // Perlin noise, centred on 0
    return 2 * envelope * n;
  }

  const px = (x: number) => p.map(x, tRange[0], tRange[1], -p.width * 0.5, p.width * 0.5)
  const py = (y: number) => -p.map(y, yRange[0], yRange[1], -p.height * 0.5, p.height * 0.5)

  let pointX: number = 3

  p.draw = () => {
    if (p.width !== container.clientWidth || p.height !== container.clientHeight) {
      p.resizeCanvas(container.clientWidth, container.clientHeight)
    }
    p.clear()
    p.noStroke()

    const documentStyle = getComputedStyle(document.documentElement);
    const background3 = documentStyle.getPropertyValue("--background-300")
    const background2 = documentStyle.getPropertyValue("--background-200")
    const foreground1 = documentStyle.getPropertyValue("--foreground-100");
    const foreground2 = documentStyle.getPropertyValue("--foreground-200")
    const foreground3 = documentStyle.getPropertyValue("--foreground-300");
    const blue = documentStyle.getPropertyValue("--visual-blue");
    const red = documentStyle.getPropertyValue("--visual-red");
    const green = documentStyle.getPropertyValue("--visual-green");
    const fontSize = `${p.width * 0.020}px`;

    const strokeWeight = p.width * 0.0025;

    if (p.mouseIsPressed && p.mouseButton == p.LEFT) {
      if (p.mouseX >= 0 && p.mouseX <= p.width &&
        p.mouseY >= 0 && p.mouseY <= p.height) {

        pointX = p.map(p.mouseX, 0, p.width, tRange[0], tRange[1])
      }
    }


    p.push()
    p.stroke(background3)
    p.strokeWeight(strokeWeight)
    const originX = px(0)
    const originY = py(0)
    p.line(originX, -p.height * 0.5, originX, p.height * 0.5)
    p.line(-p.width * 0.5, originY, p.width * 0.5, originY)
    p.pop()

    zeroLabel.position(originX + p.width * 0.48, originY + p.height * 0.5)
    zeroLabel.style("font-size", fontSize)
    katex.render(String.raw`0`, zeroLabel.elt)

    tAxisLabel.position(px(tRange[1]) + p.width * 0.5 - p.height * 0.03, py(0) + p.height * 0.42)
    tAxisLabel.style("font-size", fontSize)
    katex.render(String.raw`t`, tAxisLabel.elt)

    yAxisLabel.position(px(0) + p.width * 0.53, py(yRange[1]) + p.height * 0.50)
    yAxisLabel.style("font-size", fontSize)
    katex.render(String.raw`y(t)`, yAxisLabel.elt)


    let i = 0
    for (let x = tRange[0]; x <= tRange[1]; x++) {
      if (x == 0) continue;
      const label = xLabels[i];
      label.position(px(x) + p.width * 0.5, originY + p.height * 0.5)
      label.style("font-size", fontSize)
      katex.render(String.raw`${x}`, label.elt);
      i++
    }

    i = 0
    for (let y = yRange[0]; y <= yRange[1]; y++) {
      if (y == 0) continue;
      const label = yLabels[i];
      label.position(originX + p.width * 0.48, py(y) + p.height * 0.5)
      label.style("font-size", fontSize)
      katex.render(String.raw`${y}`, label.elt);
      i++
    }

    p.push()
    p.noFill()

    p.strokeWeight(strokeWeight * 0.5)
    p.stroke(foreground3)
    for (let m = 1; m < 10; m++) {
      p.beginShape();
      for (let t = minT; t <= maxT; t += 0.01) {
        p.vertex(px(t), py(f(t) + eta(t, m)));
      }
      p.endShape();
    }

    etaLabel.position(px(3) + p.width * 0.48, py(2) + p.height * 0.5)
    etaLabel.style("font-size", fontSize)
    katex.render(String.raw`y(t) + \eta(t)`, etaLabel.elt);

    p.strokeWeight(strokeWeight)
    p.stroke(foreground1)
    p.beginShape();
    for (let t = minT; t <= maxT; t += 0.01) {
      p.vertex(px(t), py(f(t)));
    }
    p.endShape();
    p.pop()

    pathLabel.position(px(maxT) + p.width * 0.52, py(f(maxT)) + p.height * 0.5)
    pathLabel.style("font-size", fontSize)
    katex.render(String.raw`y(t)`, pathLabel.elt);

  }
}

export function StationaryAction() {
  return <div className="w-full aspect-video">
    <StyledP5Container sketch={sketch} />
    <span className="text-sm text-foreground-300">A graph showing some of possible paths of the ball</span>
  </div>
}
