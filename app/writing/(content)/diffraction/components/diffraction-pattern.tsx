"use client";

import { baseSketch, type Setup, type Draw } from "@/components/base-sketch";
import { StyledP5Container } from "@/components/p5-container";

const setup: Setup = ({ p5 }) => {
  p5.colorMode(p5.HSL)
  p5.rectMode(p5.CORNERS)
}

const draw: Draw = ({ p5 }) => {
  p5.clear()
  p5.noStroke()

  const documentStyle = getComputedStyle(document.documentElement)
  const fringeColor = documentStyle.getPropertyValue("--visual-red")
  const screenHeight = p5.height

  const halfWidth = p5.width * 0.5
  const halfScreenHeight = screenHeight * 0.5
  p5.translate(p5.width * 0.5, p5.height * 0.5)
  p5.strokeWeight(p5.width * 0.0015)

  const color = p5.color(fringeColor)
  for (let x = -halfWidth; x <= halfWidth; x++) {
    const frac = x / halfWidth
    const intensity = p5.pow(p5.cos(x * 0.04), 4) * (1 - frac * frac)
    color.setAlpha(intensity)
    p5.stroke(color)
    p5.line(x, -halfScreenHeight + p5.height * 0., x, halfScreenHeight)
  }
}

const sketch = baseSketch({ draw, setup })

export function DiffractionPattern() {
  return <div>
    <StyledP5Container sketch={sketch} />
  </div>
}

