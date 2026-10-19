"use client";

import { StyledP5Container } from "@/components/p5-container";
import type P5 from "p5";
import katex from "katex";
import { arrow } from "@/utils/sketch-utils";
import { Latex } from "@/components/latex";
import { P5Sketch } from "@/components/p5-container"



const sketch: P5Sketch = (p, container) => {
  const p5 = p.constructor as unknown as typeof P5

  const xRange = [2, 4]
  const yRange = [-1, 1]

  let xLabels: P5.Element[] = []
  let yLabels: P5.Element[] = []
  let zeroLabel: P5.Element;

  let yAxisLabel: P5.Element;
  let xAxisLabel: P5.Element;

  let toggleLabel: P5.Element;
  let epsilonLabel: P5.Element;

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

    xAxisLabel = createLabel().style("color", "var(--foreground-200)")
    yAxisLabel = createLabel().style("color", "var(--foreground-200)")

    toggleLabel = createLabel()
    epsilonLabel = createLabel().style("color", "var(--visual-blue)")

    for (let x = xRange[0]; x <= xRange[1]; x++) {
      if (x == 0) continue;
      xLabels.push(createLabel())
    }

    for (let y = yRange[0]; y <= yRange[1]; y++) {
      if (y == 0) continue;
      yLabels.push(createLabel())
    }
  }

  const f = (x: number) => {
    return x ** 3 - 6 * x ** 2 + 9 * x;
  }

  const grad = (x: number) => {
    return 3 * x ** 2 - 12 * x + 9
  }

  let blend = 0
  let target = 1

  p.mouseClicked = () => {
    if (p.mouseButton == p.LEFT) {
      if (p.mouseX >= 0 && p.mouseX <= p.width &&
        p.mouseY >= 0 && p.mouseY <= p.height) {
        target = target == 0 ? 1 : 0
      }
    }
  }


  const px = (x: number) => p.map(x, xRange[0], xRange[1], -p.width * 0.5, p.width * 0.5)
  const py = (y: number) => -p.map(y, yRange[0], yRange[1], -p.height * 0.5, p.height * 0.5)

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

    const stationary = p.createVector(3, 0)

    p.push()
    p.stroke(background3)
    p.strokeWeight(strokeWeight)
    const originX = px(0)
    const originY = py(0)
    const stationaryX = px(stationary.x)
    p.line(originX, -p.height * 0.5, originX, p.height * 0.5)
    p.line(stationaryX, -p.height * 0.5, stationaryX, p.height * 0.5)
    p.line(-p.width * 0.5, originY, p.width * 0.5, originY)

    zeroLabel.position(originX + p.width * 0.48, originY + p.height * 0.5)
    zeroLabel.style("font-size", fontSize)
    katex.render(String.raw`0`, zeroLabel.elt)

    xAxisLabel.position(px(xRange[1]) + p.width * 0.5 - p.height * 0.03, py(0) + p.height * 0.42)
    xAxisLabel.style("font-size", fontSize)
    katex.render(String.raw`x`, xAxisLabel.elt)

    yAxisLabel.position(px(0) + p.width * 0.52, py(yRange[1]) + p.height * 0.49)
    yAxisLabel.style("font-size", fontSize)
    katex.render(String.raw`y`, yAxisLabel.elt)

    let i = 0
    for (let x = xRange[0]; x <= xRange[1]; x++) {
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
    p.pop()

    p.push()
    p.noFill()
    p.stroke(foreground2)
    p.strokeWeight(strokeWeight)
    p.beginShape();
    for (let x = xRange[0]; x <= xRange[1]; x += 0.01) {
      p.vertex(px(x), py(f(x)));
    }
    p.endShape();
    p.pop()

    p.push()
    p.noFill()
    p.strokeWeight(strokeWeight)
    p.stroke(blue)


    const curve = (x: number) => {
      return f(x) - 0.1 * Math.abs(x - stationary.x)
    }

    const epsilon = 0.04
    const shiftedX = stationary.x + epsilon
    const shiftedY = f(shiftedX)
    const gradient = grad(shiftedX)
    const line = (x: number) => {
      return gradient * (x - shiftedX) + shiftedY
    }

    p.beginShape();
    for (let x = xRange[0]; x <= xRange[1]; x += 0.01) {
      const pointX = px(x)
      const pointY = py(p.lerp(line(x), curve(x), blend))
      p.vertex(pointX, pointY);
    }
    p.endShape();
    p.pop()

    p.push()
    p.stroke(blue)
    p.fill(blue)
    p.strokeWeight(strokeWeight * 0.75)
    arrow(p, px(stationary.x - epsilon * 3), py(0.3), px(stationary.x + epsilon * 3), py(0.3), p.width * 0.0125, true)
    epsilonLabel.position(px(stationary.x) + p.width * 0.5, p.height * 0.26)
    epsilonLabel.style("font-size", `${p.width * 0.025}px`)
    katex.render(String.raw`\epsilon`, epsilonLabel.elt);
    p.pop()

    blend = p.lerp(blend, target, 0.5);

    const text = target == 1 ? String.raw`\epsilon^2` : String.raw`\epsilon\phantom{{}^2}`
    toggleLabel.position(p.width * 0.04, p.height * 0.02)
    toggleLabel.style("font-size", `${p.width * 0.025}px`)
    katex.render(text, toggleLabel.elt);

  }
}

export function StationaryGraph() {
  return <div className="w-full aspect-video">
    <StyledP5Container sketch={sketch} />
    <span className="text-sm text-foreground-300">Press to switch between <Latex text="$\epsilon$" /> and <Latex text="$\epsilon^2$" /> </span>
  </div>
}
