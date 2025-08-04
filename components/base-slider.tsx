import * as Slider from "@radix-ui/react-slider";
import { ComponentPropsWithRef, CSSProperties } from "react";

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
