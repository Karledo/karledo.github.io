"use client";
import {
  LazyMotion,
  MotionValue,
  domAnimation,
  useTransform,
  useTime,
  useMotionValue,
  useAnimationFrame,
} from "motion/react";
import useMeasure from "react-use-measure";
import * as m from "motion/react-m";
import { ReactNode, useRef } from "react";
import * as Slider from "@radix-ui/react-slider";

export function Kinematics() {
  const [ref, bounds] = useMeasure();
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  const accelerationY = useMotionValue(500);

  const duration = useTransform(
    () => (-2 * velocityY.get()) / accelerationY.get(),
  );

  const milliseconds = useTransform(() => duration.get() * 1000);

  const { time, /* restart, */ start /* , stop */ } = useTimer({
    oneShot: false,
  });
  start(milliseconds);

  const { displacementX, displacementY } = useKinematic({
    time,
    velocityX,
    velocityY,
    accelerationY,
  });

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
    <Wrapper>
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
      <div className="flex items-center gap-x-4">
        <span>Horizontal Velocity</span>
        <Slider.Root
          min={0}
          max={bounds.width * 0.67}
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
          defaultValue={[25]}
          max={bounds.height * 1.38}
          onValueChange={([value]) => velocityY.set(-value)}
          className="relative flex h-3 max-w-[300px] grow cursor-grab touch-none items-center overflow-hidden select-none active:cursor-grabbing"
        >
          <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full">
            <Slider.Range className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full" />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Root>
      </div>
      {/* <div className="flex gap-2">
        {[
          { func: () => restart(duration), text: "Restart" },
          { func: start, text: "Start" },
          { func: stop, text: "Stop" },
        ].map(({ func, text }) => {
          return (
            <button
              key={text}
              onClick={() => {
                func();
              }}
              className="bg-foreground-100 text-background-100 cursor-pointer rounded px-3 py-1.5 text-sm"
            >
              {text}
            </button>
          );
        })}
      </div> */}
    </Wrapper>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
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
    const t = time.get() / 1000;
    return equation(velocityX.get(), accelerationX.get(), t);
  });
  const displacementY = useTransform(() => {
    const t = time.get() / 1000;
    return equation(velocityY.get(), accelerationY.get(), t);
  });

  return { displacementX, displacementY };
}

function useTimer({ oneShot = true }: { oneShot?: boolean }) {
  let isRunning = true;
  const globalTime = useTime();
  let currentTime = globalTime;

  let duration = new MotionValue(0);
  const elapsedTime = new MotionValue(0);

  const time = useTransform(() => {
    if (!isRunning) {
      return elapsedTime.get();
    }

    const deltaTime = globalTime.get() - currentTime.get();
    if (deltaTime <= duration.get()) {
      return deltaTime;
    } else {
      return oneShot ? duration.get() : deltaTime % duration.get();
    }
  });

  return {
    time,
    duration,
    elapsedTime,
    restart: (milliseconds: MotionValue<number>) => {
      isRunning = true;
      currentTime = new MotionValue(globalTime.get());
      duration = milliseconds;
    },
    start: (milliseconds?: MotionValue<number>) => {
      isRunning = true;
      if (milliseconds) {
        duration = milliseconds;
        currentTime = new MotionValue(globalTime.get());
      } else {
        elapsedTime.set(time.get());
        currentTime = new MotionValue(globalTime.get() - elapsedTime.get());
      }
    },
    stop: () => {
      elapsedTime.set(time.get());
      isRunning = false;
    },
  };
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
