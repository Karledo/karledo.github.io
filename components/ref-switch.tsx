import * as Switch from "@radix-ui/react-switch";
import { RefObject, ReactNode, ComponentPropsWithRef } from "react";

export type RefSwitchProps = {
  sharedRef: RefObject<boolean>;
  label: ReactNode;
} & Omit<ComponentPropsWithRef<typeof Switch.Root>, "onCheckedChange">;

export function RefSwitch({ sharedRef, label, ...props }: RefSwitchProps) {
  return (
    <div className="flex items-center justify-between py-1">
      {label}
      <Switch.Root
        {...props}
        defaultChecked={sharedRef.current}
        className="bg-background-300 h-[1.5625rem] w-[2.625rem] rounded-full transition-[filter] duration-200 data-[state=checked]:brightness-150"
        onCheckedChange={(value: boolean) => (sharedRef.current = value)}
      >
        <Switch.Thumb className="bg-foreground-100 block h-[1.3125rem] w-[1.3125rem] translate-x-0.5 rounded-full shadow transition-transform duration-200 data-[state=checked]:translate-x-[calc(100%-0.125rem)]" />
      </Switch.Root>
    </div>
  );
}
