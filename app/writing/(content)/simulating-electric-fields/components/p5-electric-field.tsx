"use client"

import { baseSketch, type Draw, type Setup } from "@/components/base-sketch"
import { BaseSlider } from "@/components/base-slider"
import { StyledP5Container } from "@/components/p5-container"
import { arrow } from "@/utils/p5-helper"
import P5 from "p5"
import { Fragment, useRef } from "react"

type Charge = {
  position: P5.Vector
  magnitude: number
}

const MAX_WIDTH = 641.52
const MAX_HEIGHT = (9 / 16) * MAX_WIDTH
const numCharges = 2
let charges: Array<Charge>
let mouseInCanvas = false;
let selectedCharge: Charge | null
let dragging = false

const setup: Setup = ({ p5, canvas }) => {
  p5.colorMode(p5.HSL)

  charges = Array.from({ length: numCharges }).map((_, i) => {
    return { position: p5.createVector(p5.width * 0.25 + i * p5.width * 0.1, p5.height * 0.4), magnitude: 1 }
  })

  canvas.mouseOut(() => {
    mouseInCanvas = false
  })

  canvas.mouseOver(() => {
    mouseInCanvas = true
  })

  canvas.mousePressed(() => {
    mouseInCanvas = true
    dragging = true
  })

  canvas.mouseReleased(() => {
    mouseInCanvas = false
    dragging = false
  })
}

const draw: Draw = ({ p5 }) => {
  p5.clear()
  p5.noStroke()
  p5.noFill()

  const documentStyle = getComputedStyle(document.documentElement)
  const numArrows = { x: 8, y: 4 }
  const arrowColor = "white"
  const arrowLength = p5.width * 0.03
  const arrowHeadSize = p5.width * 0.02

  const mousePosition = p5.createVector(p5.mouseX, p5.mouseY)
  const chargeRadius = p5.width * 0.02
  const chargeDiameter = chargeRadius * 2

  const positiveChargeColor = p5.color(documentStyle.getPropertyValue("--visual-blue"))
  const negativeChargeColor = p5.color(documentStyle.getPropertyValue("--visual-red"))
  const fontSize = p5.width * 0.035


  const scaledCharges = charges.map((charge) => {
    return { position: charge.position.copy().mult(p5.width / MAX_WIDTH), magnitude: charge.magnitude }
  })

  if (p5.mouseIsPressed && mouseInCanvas) {
    for (let i = 0; i < charges.length; i++) {
      if (mousePosition.dist(scaledCharges[i].position) < chargeRadius && !selectedCharge && dragging) {
        selectedCharge = charges[i]
        break
      }
    }
  }

  const scaledMousePosition = mousePosition.copy().mult(MAX_WIDTH / p5.width)
  if (selectedCharge) {
    if (dragging) {
      selectedCharge.position.x = p5.min(p5.max(0, scaledMousePosition.x), MAX_WIDTH)
      selectedCharge.position.y = p5.min(p5.max(0, scaledMousePosition.y), MAX_HEIGHT)
    } else {
      selectedCharge = null
    }
  }


  p5.push()
  p5.translate(0.5 * p5.width / numArrows.x, 0.5 * p5.height / numArrows.y)
  p5.fill(arrowColor)
  p5.stroke(arrowColor)
  p5.strokeWeight(p5.width * 0.0049)
  for (let x = 0; x < numArrows.x; x++) {
    for (let y = 0; y < numArrows.y; y++) {
      const tailX = x / numArrows.x * p5.width
      const tailY = y / numArrows.y * p5.height

      const tail = p5.createVector(tailX, tailY)

      const resultantForce = p5.createVector(0, 0)
      for (const charge of scaledCharges) {
        const distance = tail.dist(charge.position)
        const forceMagnitude = equation(1, charge.magnitude, distance)
        const displacement = tail.copy().sub(charge.position)
        const force = displacement.setMag(forceMagnitude)
        resultantForce.add(force)
      }

      const arrowVector = resultantForce.copy().setMag(arrowLength)

      const headX = tailX + arrowVector.x
      const headY = tailY + arrowVector.y

      arrow({
        p5,
        tailX,
        tailY,
        headX,
        headY,
        arrowHeadSize
      })
    }
  }
  p5.pop()

  p5.push()
  p5.textFont("KaTex_Main")
  p5.textSize(fontSize)
  p5.textAlign(p5.CENTER)
  for (let i = 0; i < scaledCharges.length; i++) {
    p5.push()
    const charge = scaledCharges[i]
    const lerpFactor = (charge.magnitude + 1) * 0.5
    p5.fill(p5.lerpColor(negativeChargeColor, positiveChargeColor, lerpFactor))
    p5.circle(charge.position.x, charge.position.y, chargeDiameter)
    p5.fill("white")
    p5.translate(0, fontSize * 0.30)
    p5.text(`${i + 1}`, charge.position.x, charge.position.y)
    p5.pop()
  }
  p5.pop()
}

const sketch = baseSketch({ draw, setup })

export function P5ElectricField() {
  const chargeDisplay1 = useRef<HTMLSpanElement>(null)
  const chargeDisplay2 = useRef<HTMLSpanElement>(null)

  const chargeDisplays = [chargeDisplay1, chargeDisplay2]

  return <div>
    <StyledP5Container sketch={sketch} />
    <div className="grid items-center grid-cols-[auto_1fr_auto] gap-x-4">
      {
        Array.from({ length: numCharges }).map((_, i) => {
          return <Fragment key={i}>
            <span>Charge {i + 1}</span>
            <BaseSlider
              step={0.01}
              min={-1}
              max={1}
              defaultValue={[1]}
              onValueChange={([value]) => {
                if (chargeDisplays[i].current) {
                  chargeDisplays[i].current.innerText = `${value}`
                }
                if (charges[i]) { charges[i].magnitude = value }
              }}
            />
            <span ref={chargeDisplays[i]} className="min-w-12">1</span>
          </Fragment>
        })
      }
    </div>
  </div>
}

const EPSILON_ZERO = 8.8 * 10e-12
const equation = (q1: number, q2: number, r: number) => {
  return q1 * q2 / (4 * Math.PI * EPSILON_ZERO * r * r)
}
