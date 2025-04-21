"use client";

import { baseSketch, type Setup, type Draw } from "@/components/base-sketch";
import { StyledP5Container } from "@/components/p5-container";

const MAX_WIDTH = 641.52
const setup: Setup = ({ p5 }) => {
  p5.colorMode(p5.HSL)
  p5.rectMode(p5.CORNERS)
}

const draw: Draw = ({ p5 }) => {
  p5.clear()
  p5.noStroke()

  const documentStyle = getComputedStyle(document.documentElement)
  const noiseHeight = p5.height * 0.5
  const seconds = p5.millis() * 0.001
  const noiseScale = 0.002
  const timeScale = 0.3

  p5.fill(documentStyle.getPropertyValue("--foreground-100"))
  p5.textSize(18 * p5.width / MAX_WIDTH)
  p5.textFont("KaTeX_Math")
  p5.text("|Ψ(x, t)|²", p5.width * 0.52, p5.height * 0.07)
  p5.text("x", p5.width * 0.97, p5.height * 0.47)


  p5.stroke(documentStyle.getPropertyValue("--background-300"))
  p5.strokeWeight(2 * p5.width / MAX_WIDTH)
  p5.line(0, p5.height * 0.5, p5.width, p5.height * 0.5)
  p5.line(p5.width * 0.5, 0, p5.width * 0.5, p5.height)

  p5.translate(0, p5.height * 0.5)
  p5.strokeWeight(3 * p5.width / MAX_WIDTH)
  p5.stroke(documentStyle.getPropertyValue("--foreground-100"))
  for (let x = 0; x < p5.width; x++) {
    const noiseX = x * noiseScale
    const nextNoiseX = (x + 1) * noiseScale

    p5.line(
      x,
      -p5.noise(noiseX, seconds * timeScale) * noiseHeight,
      x + 1,
      -p5.noise(nextNoiseX, seconds * timeScale) * noiseHeight
    )
  }
}

const sketch = baseSketch({ draw, setup })

export function WaveFunction() {
  return <div>
    <StyledP5Container sketch={sketch} />
  </div>
}

