import { ComponentPropsWithoutRef, ReactNode, RefObject, useRef } from "react";
import { BaseSlider } from "@/components/base-slider";

export type RefSliderProps = {
  sharedRef: RefObject<number>;
  label: ReactNode;
  map?: (value: number) => number;
  inverseMap?: (value: number) => number;
  display?: (value: number) => number | string;
  ref?: RefObject<HTMLInputElement>;
} & Omit<
  ComponentPropsWithoutRef<typeof BaseSlider>,
  "onValueChanged" | "defaultValue"
>;

export function RefSlider({
  sharedRef,
  label,
  map = (v) => v,
  inverseMap = (v) => v,
  display = (v) => v,
  ref,
  ...props
}: RefSliderProps) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const internalRef = useRef<HTMLInputElement>(null);
  const sliderRef = ref ? ref : internalRef;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 tabular-nums">
      {label}
      <BaseSlider
        ref={sliderRef}
        defaultValue={[inverseMap(sharedRef.current)]}
        {...props}
        onValueChange={([value]) => {
          sharedRef.current = map(value);
          if (displayRef.current)
            displayRef.current.innerHTML = `${display(value)}`;
        }}
      />
      <span
        ref={displayRef}
        dangerouslySetInnerHTML={{
          __html: display(inverseMap(sharedRef.current)),
        }}
      ></span>
    </div>
  );
}
