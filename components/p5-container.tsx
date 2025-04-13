"use client";

import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";
import p5Types from "p5";

export type P5ContainerRef = HTMLDivElement;
export type P5Sketch = (p: p5Types, parentRef: P5ContainerRef) => void;
export type P5Container = ({
  sketch,
}: { sketch: P5Sketch } & ComponentPropsWithoutRef<"div">) => React.JSX.Element;

export const P5Container: P5Container = ({ sketch, ...props }) => {
  const parentRef = useRef<P5ContainerRef>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let p5Instance: p5Types;

    async function initP5() {
      try {
        const p5 = (await import("p5")).default;

        new p5((newP5Instance) => {
          if (parentRef.current == null) {
            throw Error("P5 Parent Ref not set");
          }
          p5Instance = newP5Instance;
          sketch(newP5Instance, parentRef.current);
        });
      } catch (error) {
        console.log(error);
      }
    }

    initP5();

    return () => {
      p5Instance.remove();
    };
  }, [isMounted, sketch]);

  return <div {...props} ref={parentRef}></div>;
};

type DefaultP5ContainerProps = {
  sketch: P5Sketch
}

export function StyledP5Container({ sketch }: DefaultP5ContainerProps) {
  return <P5Container sketch={sketch} className="bg-background-200 overflow-hidden rounded-xl relative mb-4 pt-[56.25%]" />
}
