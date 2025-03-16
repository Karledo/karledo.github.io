"use client";
import {
  LazyMotion,
  MotionValue,
  domAnimation,
  useTransform,
  useTime,
<<<<<<< Updated upstream
  useMotionValue,
  useAnimationFrame,
  useMotionValueEvent,
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
=======
} from "motion/react";
import useMeasure from "react-use-measure";
import * as m from "motion/react-m";
import { ComponentPropsWithRef, ReactNode } from "react";

export function Kinematics() {
  const [ref, bounds] = useMeasure();
  const velocityX = new MotionValue(bounds.width * 0.6);
  const velocityY = new MotionValue(-bounds.height * 1.75);
  const accelerationY = new MotionValue(bounds.height * 2.5);

  const duration = useTransform(
    () => ((-2 * velocityY.get()) / accelerationY.get()) * 1000,
  );

  const { time, /* restart, */ start /* , stop */ } = useTimer({
    oneShot: false,
  });
  start(duration);
>>>>>>> Stashed changes

  const { displacementX, displacementY } = useKinematic({
    time,
    velocityX,
    velocityY,
    accelerationY,
  });

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
  return (
    <Wrapper>
      <div
        ref={ref}
<<<<<<< Updated upstream
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
=======
        className="bg-background-200 relative mb-4 aspect-video items-end overflow-hidden rounded-xl p-8"
      >
        <div className="absolute inset-8">
          <PreviewPath
            initialVelocityX={velocityX}
            initialVelocityY={velocityY}
            accelerationX={new MotionValue(0)}
            accelerationY={accelerationY}
            time={duration}
            className="absolute bottom-[calc(10%_+_0.75rem)] left-3"
          />
>>>>>>> Stashed changes
          <m.div
            aria-label="Ball"
            style={{
              x: displacementX,
              y: displacementY,
            }}
<<<<<<< Updated upstream
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
=======
            className="absolute bottom-[10%] left-0 size-6 rounded-full bg-white"
          />
        </div>
      </div>
      {/* <Slider.Root className="relative flex h-10 w-full max-w-[200px] cursor-grab touch-none items-center py-4 select-none active:cursor-grabbing">
        <Slider.Thumb className="bg-foreground-100 size-6 h-full rounded-full">
          <Slider.Track className="bg-background-300 isolate h-full grow overflow-hidden">
            <Slider.Range className="rounded-full bg-white" />
          </Slider.Track>
        </Slider.Thumb>
      </Slider.Root> */}
      {/* <div className="flex gap-2">
        {[
          { func: () => restart(duration), text: "Restart" },
          { func: start, text: "Start" },
          { func: stop, text: "Stop" },
        ].map(({ func, text }) => {
>>>>>>> Stashed changes
          return (
            <button
              key={text}
              onClick={() => {
<<<<<<< Updated upstream
                action();
=======
                func();
>>>>>>> Stashed changes
              }}
              className="bg-foreground-100 text-background-100 cursor-pointer rounded px-3 py-1.5 text-sm"
            >
              {text}
            </button>
          );
        })}
<<<<<<< Updated upstream
      </div>
=======
      </div> */}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    return equation(velocityX.get(), accelerationX.get(), time.get());
  });
  const displacementY = useTransform(() => {
    return equation(velocityY.get(), accelerationY.get(), time.get());
=======
    const t = time.get() / 1000;
    return equation(velocityX.get(), accelerationX.get(), t);
  });
  const displacementY = useTransform(() => {
    const t = time.get() / 1000;
    return equation(velocityY.get(), accelerationY.get(), t);
>>>>>>> Stashed changes
  });

  return { displacementX, displacementY };
}

<<<<<<< Updated upstream
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
=======
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

function PreviewPath({
  initialVelocityX,
  initialVelocityY,
  accelerationX,
  accelerationY,
  time,
  resolution = 15,
  ...props
}: EquationData & { resolution?: number } & ComponentPropsWithRef<"div">) {
  return (
    <div {...props}>
      {Array.from({ length: resolution + 1 }).map((_, i) => {
        const frac = i / resolution;
        const x = equation(
          initialVelocityX.get(),
          accelerationX.get(),
          frac * (time.get() / 1000),
        );
        const y = equation(
          initialVelocityY.get(),
          accelerationY.get(),
          frac * (time.get() / 1000),
        );
        return (
          <m.div
            key={i}
            aria-label="Trajectory Path"
            className="bg-foreground-100/20 absolute size-2 rounded-full"
            style={{ x, y }}
          />
        );
      })}
    </div>
>>>>>>> Stashed changes
  );
}

function equation(u: number, a: number, t: number) {
  if (a === 0) return u * t;
  return u * t + 0.5 * a * t ** 2;
}
<<<<<<< Updated upstream
=======

type EquationData = {
  initialVelocityX: MotionValue<number>;
  initialVelocityY: MotionValue<number>;
  accelerationX: MotionValue<number>;
  accelerationY: MotionValue<number>;
  time: MotionValue<number>;
};
>>>>>>> Stashed changes
