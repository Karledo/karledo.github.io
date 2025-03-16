"use client";

import { LazyMotionProvider } from "@/components/lazy-motion-provider";
import { MotionValue } from "motion";
import { m, useAnimationFrame } from "motion/react";
import { Vector2 } from "@/utils/vector2";
import useMeasure from "react-use-measure";

const GRAVITATION_CONSTANT = 1000;

function getVectorFromMotionValue({
  x,
  y,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return new Vector2(x.get(), y.get());
}

export function Gravitation({}) {
  const [ref, bounds] = useMeasure();
  const sunPosition = {
    x: new MotionValue(bounds.width * 0.5),
    y: new MotionValue(bounds.height * 0.5),
  };

  const { displacement: planetPosition, acceleration } = useGravitation();

  const PLANET_MASS = 1;
  const SUN_MASS = 10000;
  useAnimationFrame(() => {
    const planetPos = getVectorFromMotionValue(planetPosition);
    const sunPos = getVectorFromMotionValue(sunPosition);

    const displacement = sunPos.sub(planetPos);
    const distance = displacement.magnitude();
    const force = equation(PLANET_MASS, SUN_MASS, distance);
    console.log(force);

    const direction = displacement.normalize();
    const newAcceleration = direction.scale(force / PLANET_MASS);

    acceleration.x.set(newAcceleration.x);
    acceleration.y.set(newAcceleration.y);
  });

  return (
    <LazyMotionProvider>
      <div className="bg-background-200 relative mb-4 aspect-video rounded-xl px-8 py-12">
        <div ref={ref} aria-label="Canvas" className="relative size-full">
          <Sun x={sunPosition.x} y={sunPosition.y} />
          <div className="absolute inset-0">
            <Planet
              x={planetPosition.x}
              y={planetPosition.y}
              className="bg-white"
            />
          </div>
        </div>
      </div>
    </LazyMotionProvider>
  );
}

function Sun({
  x,
  y,
  ...props
}: { x: MotionValue<number>; y: MotionValue<number> } & Omit<
  typeof m.div,
  "className" | "$$typeof"
>) {
  return (
    <m.div
      aria-label="Sun"
      style={{ x, y }}
      {...props}
      className="absolute size-12 -translate-6 rounded-full bg-amber-400"
    />
  );
}

function Planet({
  x,
  y,
  className,
  ...props
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  className?: string;
} & Omit<typeof m.div, "$$typeof">) {
  return (
    <m.div
      aria-label="Planet"
      style={{ x, y }}
      {...props}
      className={`size-8 rounded-full ${className}`}
    />
  );
}

function useGravitation() {
  const acceleration = { x: new MotionValue(0), y: new MotionValue(0) };
  const displacement = { x: new MotionValue(0), y: new MotionValue(0) };
  const velocity = { x: new MotionValue(0), y: new MotionValue(100) };

  useAnimationFrame((globalMilliseconds, deltaTimeMilliseconds) => {
    const deltaTime = deltaTimeMilliseconds / 1000;
    velocity.x.set(velocity.x.get() + acceleration.x.get() * deltaTime);
    velocity.y.set(velocity.y.get() + acceleration.y.get() * deltaTime);
    displacement.x.set(displacement.x.get() + velocity.x.get() * deltaTime);
    displacement.y.set(displacement.y.get() + velocity.y.get() * deltaTime);
  });

  return { displacement, velocity, acceleration };
}

function equation(m1: number, m2: number, r: number) {
  return (GRAVITATION_CONSTANT * m1 * m2) / Math.max(1e-6, r ** 2);
}
