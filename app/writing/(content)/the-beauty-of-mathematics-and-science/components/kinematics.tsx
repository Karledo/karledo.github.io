"use client";
import {
  LazyMotion,
  MotionValue,
  domAnimation,
  useTransform,
  useTime,
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

  const { displacementX, displacementY } = useKinematic({
    time,
    velocityX,
    velocityY,
    accelerationY,
  });

  return (
    <Wrapper>
      <div
        ref={ref}
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
          <m.div
            aria-label="Ball"
            style={{
              x: displacementX,
              y: displacementY,
            }}
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
  );
}

function equation(u: number, a: number, t: number) {
  if (a === 0) return u * t;
  return u * t + 0.5 * a * t ** 2;
}

type EquationData = {
  initialVelocityX: MotionValue<number>;
  initialVelocityY: MotionValue<number>;
  accelerationX: MotionValue<number>;
  accelerationY: MotionValue<number>;
  time: MotionValue<number>;
};
