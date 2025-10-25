import * as Slider from "@radix-ui/react-slider";
import { ComponentPropsWithoutRef, ComponentPropsWithRef, CSSProperties, ReactNode, RefObject, useRef } from "react";

type BaseSliderProps = Omit<ComponentPropsWithRef<typeof Slider.Root>, "className"> & {
  rangeStyle?: CSSProperties;
};

export function BaseSlider({ rangeStyle, ...props }: BaseSliderProps) {
  return (
    <Slider.Root
      {...props}
      className="group relative flex h-3 grow cursor-grab touch-none items-center transition-transform duration-300 select-none active:cursor-grabbing"
    >
      <Slider.Track className="bg-background-300 relative h-1.5 grow rounded-full transition-transform duration-300 group-hover:scale-y-150 group-active:scale-y-150">
        <Slider.Range
          style={rangeStyle}
          className="dark:bg-foreground-100 bg-foreground-200 absolute h-full rounded-full"
        />
      </Slider.Track>
      <Slider.Thumb />
    </Slider.Root>
  );
}

type RefSliderProps = {
  sharedRef: RefObject<number>;
  label: ReactNode;
  map?: (value: number) => number;
  inverseMap?: (value: number) => number;
  display?: (value: number) => number | string;
  ref?: RefObject<HTMLInputElement>;
} & Omit<ComponentPropsWithoutRef<typeof BaseSlider>, "onValueChanged" | "defaultValue">;

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
          if (displayRef.current) displayRef.current.innerHTML = `${display(value)}`;
        }}
      />
      <span ref={displayRef} dangerouslySetInnerHTML={{ __html: display(inverseMap(sharedRef.current)) }}></span>
    </div>
  );
}
