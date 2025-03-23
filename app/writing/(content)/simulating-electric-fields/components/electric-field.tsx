"use client";
import { LazyMotionProvider } from "@/components/lazy-motion-provider";
import { Vector2 } from "@/utils/vector2";
import {
  m,
  motion,
  MotionValue,
  PanInfo,
  useAnimationFrame,
  useSpring,
} from "motion/react";
import { useRef } from "react";
import useMeasure from "react-use-measure";
import * as Slider from "@radix-ui/react-slider";

const arrowColor = "#737373";
const arrowWidth = "4";
const arrowHeadSize = "3";
const arrowLength = 30;
const gridSize = 7;

const defaultCharge = 1;
const numChargedParticles = 2;

export function ElectricField() {
  const firstCharge = useSpring(defaultCharge);
  const secondCharge = useSpring(defaultCharge);

  const charges = [firstCharge, secondCharge];

  const dragContainer = useRef<HTMLDivElement>(null);
  const [ref, bounds] = useMeasure();

  const dragPositions = Array.from({ length: numChargedParticles }).map(() => {
    return {
      x: bounds.width * 0.5,
      y: bounds.height * 0.5,
    };
  });

  const arrows = Array.from({ length: gridSize * gridSize }).map((_, i) => {
    const x =
      (i % gridSize) * (bounds.width / gridSize) +
      (bounds.width * 0.5) / gridSize;
    const y =
      Math.floor(i / gridSize) * (bounds.height / gridSize) +
      (bounds.height * 0.5) / gridSize;

    return {
      x1: new MotionValue(x),
      y1: new MotionValue(y),
      x2: new MotionValue(x + arrowLength / Math.sqrt(2)),
      y2: new MotionValue(y + arrowLength / Math.sqrt(2)),
    };
  });

  function handleDragging(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    index: number,
  ) {
    if (dragContainer.current == null) return;
    const rect = dragContainer.current.getBoundingClientRect();

    dragPositions[index].x = info.point.x - (window.scrollX + rect.left);
    dragPositions[index].y = info.point.y - (window.scrollY + rect.top);
  }

  const k = 1;
  const q2 = 1;

  useAnimationFrame(() => {
    for (const arrow of arrows) {
      const tailPosition = new Vector2(arrow.x1.get(), arrow.y1.get());

      const forces = dragPositions.map((dragPosition, index) => {
        const chargePosition = new Vector2(dragPosition.x, dragPosition.y);
        const displacement = tailPosition.sub(chargePosition);

        const squaredDistance = tailPosition
          .sub(chargePosition)
          .squaredMagnitude();
        const force = equation(k, charges[index].get(), q2, squaredDistance);
        const forceVector = displacement.normalized().scale(force);
        return forceVector;
      });

      const averageDirection = forces
        .reduce((previousVector, currentVector) => {
          return previousVector.add(currentVector);
        })
        .normalized();

      const resultantForce = averageDirection.scale(arrowLength);
      const headPosition = tailPosition.add(resultantForce);

      arrow.x2.set(headPosition.x);
      arrow.y2.set(headPosition.y);
    }
  });

  return (
    <LazyMotionProvider>
      <div
        ref={ref}
        className="bg-background-200 relative mb-7 aspect-video rounded-xl"
      >
        <m.svg
          viewBox={`0 0 ${bounds.width} ${bounds.height}`}
          className="pointer-events-none absolute inset-0"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth={arrowHeadSize}
              markerHeight={arrowHeadSize}
              fill={arrowColor}
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {arrows.map(({ x1, y1, x2, y2 }, i) => {
            return <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </m.svg>
        <div ref={dragContainer} className="relative size-full">
          {charges.map((charge, index) => {
            return (
              <motion.div
                key={index}
                className={`absolute ${index == 0 ? "left-1/3" : "left-2/3"} top-1/2 flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-white`}
                drag
                dragMomentum={false}
                onDrag={(event, info) => handleDragging(event, info, index)}
                dragConstraints={dragContainer}
              >
                <span className="font-semibold text-neutral-700">
                  {index + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mb-7">
        {charges.map((charge, index) => {
          return (
            <div key={index} className="flex items-center gap-x-2">
              <span>Charge {index + 1}</span>
              <Slider.Root
                min={-1}
                max={1}
                step={0.01}
                defaultValue={[charge.get()]}
                onValueChange={([value]) => {
                  charge.set(value);
                }}
                className="group relative flex h-3 grow cursor-grab touch-none items-center transition-transform duration-300 select-none active:cursor-grabbing"
              >
                <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full transition-transform duration-300 group-hover:scale-y-150 group-active:scale-y-150">
                  <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
                </Slider.Track>
                <Slider.Thumb />
              </Slider.Root>
            </div>
          );
        })}
      </div>
    </LazyMotionProvider>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: MotionValue<number>;
  y1: MotionValue<number>;
  x2: MotionValue<number>;
  y2: MotionValue<number>;
}) {
  return (
    <m.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={arrowColor}
      strokeWidth={arrowWidth}
      markerEnd="url(#arrow)"
    />
  );
}

function equation(k: number, q1: number, q2: number, rSquared: number) {
  return (k * q1 * q2) / Math.max(0.00000001, rSquared);
}
