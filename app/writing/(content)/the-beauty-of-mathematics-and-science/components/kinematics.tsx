"use client";
import {
  MotionValue,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useMotionValueEvent,
} from "motion/react";
import useMeasure from "react-use-measure";
import * as m from "motion/react-m";
import { useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import { LazyMotionProvider } from "@/components/lazy-motion-provider";

export function Kinematics() {
  const [ref, bounds] = useMeasure();
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const accelerationY = useMotionValue(500);

  const maxVerticalVelocityFactor = 1.38;
  const maxHorizontalVelocityFactor = 0.67;

  const duration = useTransform(
    () => (-2 * velocityY.get()) / accelerationY.get(),
  );

  useMotionValueEvent(duration, "change", (latestDuration) => {
    timerDuration.set(latestDuration);
  });

  const {
    time,
    start,
    stop,
    reset,
    duration: timerDuration,
  } = useTimer(duration.get());
  start();

  const { displacementX, displacementY } = useKinematic({
    time,
    velocityX,
    velocityY,
    accelerationY,
  });

  const controls: { action: () => void; text: string }[] = [
    { action: reset, text: "Reset" },
    { action: start, text: "Start" },
    { action: stop, text: "Stop" },
  ];

  const resolution = 10;

  const path = useRef<{ x: MotionValue<number>; y: MotionValue<number> }[]>(
    Array(resolution + 1)
      .fill(0)
      .map(() => {
        return {
          x: new MotionValue(0),
          y: new MotionValue(0),
        };
      }),
  );

  useAnimationFrame(() => {
    for (let i = 0; i < resolution + 1; i++) {
      const frac = i / resolution;
      const step = duration.get() * frac;
      const x = equation(velocityX.get(), 0, step);
      const y = equation(velocityY.get(), accelerationY.get(), step);

      path.current[i].x.set(x);
      path.current[i].y.set(y);
    }
  });

  return (
    <LazyMotionProvider>
      <div
        ref={ref}
        className="bg-background-200 relative mb-4 aspect-video overflow-hidden rounded-xl px-8 py-12"
      >
        <div className="relative size-full">
          <div className="absolute bottom-2 left-2">
            {Array.from({ length: resolution + 1 }).map((_, i) => {
              return (
                <Point key={i} x={path.current[i].x} y={path.current[i].y} />
              );
            })}
          </div>
          <m.div
            aria-label="Ball"
            style={{
              x: displacementX,
              y: displacementY,
            }}
            className="absolute bottom-0 size-6 rounded-full bg-white"
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-x-4">
          <span>Horizontal Velocity</span>
          <Slider.Root
            min={0}
            defaultValue={[(bounds.width * maxHorizontalVelocityFactor) / 2]}
            max={bounds.width * maxHorizontalVelocityFactor}
            onValueChange={([value]) => velocityX.set(value)}
            className="relative flex h-3 max-w-[300px] grow cursor-grab touch-none items-center overflow-hidden select-none active:cursor-grabbing"
          >
            <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full">
              <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
        </div>
        <div className="flex items-center gap-x-4">
          <span>Vertical Velocity</span>
          <Slider.Root
            min={0}
            defaultValue={[(bounds.height * maxVerticalVelocityFactor) / 2]}
            max={bounds.height * maxVerticalVelocityFactor}
            onValueChange={([value]) => velocityY.set(-value)}
            className="relative flex h-3 max-w-[300px] grow cursor-grab touch-none items-center overflow-hidden select-none active:cursor-grabbing"
          >
            <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full">
              <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
        </div>
      </div>
      <div className="flex gap-2">
        {controls.map(({ action, text }) => {
          return (
            <button
              key={text}
              onClick={() => {
                action();
              }}
              className="bg-foreground-100 text-background-100 cursor-pointer rounded px-3 py-1.5 text-sm"
            >
              {text}
            </button>
          );
        })}
      </div>
    </LazyMotionProvider>
  );
}

function useKinematic({
  velocityX,
  velocityY,
  accelerationX = new MotionValue(0),
  accelerationY,
  time,
}: {
  velocityX: MotionValue<number>;
  velocityY: MotionValue<number>;
  accelerationX?: MotionValue<number>;
  accelerationY: MotionValue<number>;
  time: MotionValue<number>;
}) {
  const displacementX = useTransform(() => {
    return equation(velocityX.get(), accelerationX.get(), time.get());
  });
  const displacementY = useTransform(() => {
    return equation(velocityY.get(), accelerationY.get(), time.get());
  });

  return { displacementX, displacementY };
}

function useTimer(_duration?: number) {
  let isRunning = false;
  const rawTime = useMotionValue(0);
  const duration = useMotionValue(_duration);

  const time = useTransform(() => rawTime.get() % duration.get());

  function stop() {
    isRunning = false;
  }

  function start(timeLeft?: number) {
    isRunning = true;
    if (timeLeft) {
      duration.set(timeLeft);
    }
  }

  function reset() {
    rawTime.set(0);
  }

  useMotionValueEvent(duration, "change", () => {
    rawTime.set(0);
  });

  useAnimationFrame((_, delta) => {
    if (!isRunning) return;
    rawTime.set(rawTime.get() + delta / 1000);
  });

  return { time, duration, start, stop, reset };
}

function Point({
  x,
  y,
  ...props
}: { x: MotionValue<number>; y: MotionValue<number> } & Omit<
  typeof m.div,
  "className" | "style" | "aria-label" | "$$typeof"
>) {
  return (
    <m.div
      aria-label="Trajectory Path"
      className="bg-foreground-100/30 absolute bottom-0 left-0 size-2 rounded-full"
      style={{ x, y }}
      {...props}
    />
  );
}

function equation(u: number, a: number, t: number) {
  if (a === 0) return u * t;
  return u * t + 0.5 * a * t ** 2;
}
