"use client";

import { HTMLAttributes, useEffect, useRef, useState } from "react";
import P5 from "p5";

export type P5Container = HTMLDivElement;
export type P5Sketch = (p: P5, container: P5Container) => void;

type P5ContainerProps = {
  sketch: P5Sketch;
} & HTMLAttributes<P5Container>;

export const P5Container = ({ sketch, ...props }: P5ContainerProps) => {
  const ref = useRef<P5Container>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let instance: P5;

    const initializeP5 = async () => {
      try {
        const P5 = (await import("p5")).default;
        // await import("p5/lib/addons/p5.sound")

        if (ref.current === null) {
          throw Error("The reference to the container is null");
        }

        new P5((p) => {
          instance = p;
          sketch(p, ref.current as P5Container);
        }, ref.current);
      } catch (error) {
        console.log(error);
      }
    };

    initializeP5();

    return () => {
      if (instance) {
        instance.remove();
      }
    };
  }, [isMounted, sketch]);

  return <div {...props} ref={ref}></div>;
};

type DefaultP5ContainerProps = {
  sketch: P5Sketch;
};

export const StyledP5Container = ({ sketch }: DefaultP5ContainerProps) => {
  return (
    <P5Container sketch={sketch} className="bg-background-200 relative mb-4 overflow-hidden rounded-xl pt-[56.25%]" />
  );
};
