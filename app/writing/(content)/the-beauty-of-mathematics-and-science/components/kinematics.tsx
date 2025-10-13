"use client";
import { MotionValue, useTransform, useMotionValue, useAnimationFrame, useMotionValueEvent } from "motion/react";
import useMeasure from "react-use-measure";
import * as m from "motion/react-m";
import { ReactNode, useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import { LazyMotionProvider } from "@/components/lazy-motion-provider";
import { PauseIcon, PlayIcon, ReloadIcon } from "@radix-ui/react-icons";

export function Kinematics() {
  const [ref, bounds] = useMeasure();
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const accelerationY = useMotionValue(500);

  const maxVerticalVelocityFactor = 1.38;
  const maxHorizontalVelocityFactor = 0.67;

  const duration = useTransform(() => (-2 * velocityY.get()) / accelerationY.get());

  useMotionValueEvent(duration, "change", (latestDuration) => {
    timerDuration.set(latestDuration);
  });

  const { time, start, stop, reset, duration: timerDuration } = useTimer(duration.get());
  start();

  const { displacementX, displacementY } = useKinematic({
    time,
    velocityX,
    velocityY,
    accelerationY,
  });

  const classNames = "stroke-0 stroke-foreground-200";
  const controls: { action: () => void; button: ReactNode }[] = [
    {
      action: stop,
      button: <PauseIcon className={`${classNames} size-4`} />,
    },
    {
      action: start,
      button: <PlayIcon className={`${classNames} size-6`} />,
    },
    {
      action: reset,
      button: <ReloadIcon className={`${classNames} size-4`} />,
    },
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
      <div ref={ref} className="bg-background-200 relative mb-3 aspect-video overflow-hidden rounded-xl">
        <div className="absolute inset-8">
          <div className="absolute bottom-2 left-2">
            {Array.from({ length: resolution + 1 }).map((_, i) => {
              return <Point key={i} x={path.current[i].x} y={path.current[i].y} />;
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
      <div className="mb-7 flex items-center justify-center gap-2">
        {controls.map(({ action, button }) => {
          return (
            <button
              key={action.toString()}
              onClick={() => {
                action();
              }}
              className="border-background-300 bg-background-200 transition-color hover:bg-background-300 cursor-pointer rounded-full border p-3 duration-300"
            >
              {button}
            </button>
          );
        })}
      </div>
      <div className="mb-6 flex flex-col gap-y-4">
        <div>
          <span className="mb-2">Horizontal Velocity</span>
          <Slider.Root
            min={0}
            defaultValue={[(bounds.width * maxHorizontalVelocityFactor) / 2]}
            max={bounds.width * maxHorizontalVelocityFactor}
            onValueChange={([value]) => velocityX.set(value)}
            className="relative flex h-3 grow cursor-grab touch-none items-center overflow-hidden transition-transform duration-300 select-none hover:scale-y-150 active:scale-y-150 active:cursor-grabbing"
          >
            <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full">
              <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
        </div>
        <div>
          <span className="mb-2">Vertical Velocity</span>
          <Slider.Root
            min={0}
            defaultValue={[(bounds.height * maxVerticalVelocityFactor) / 2]}
            max={bounds.height * maxVerticalVelocityFactor}
            onValueChange={([value]) => velocityY.set(-value)}
            className="relative flex h-3 grow cursor-grab touch-none items-center overflow-hidden transition-transform duration-300 select-none hover:scale-y-150 active:scale-y-150 active:cursor-grabbing"
          >
            <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full">
              <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Root>
        </div>
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
