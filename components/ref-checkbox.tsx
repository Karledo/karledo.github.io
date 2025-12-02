import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { RefObject, ReactNode, ComponentPropsWithRef } from "react";

export type RefCheckboxProps = {
  sharedRef: RefObject<boolean>;
  label: ReactNode;
} & Omit<ComponentPropsWithRef<typeof Checkbox.Root>, "onCheckedChange">;

export function RefCheckbox({ sharedRef, label, ...props }: RefCheckboxProps) {
  return (
    <div className="flex items-center justify-between">
      {label}
      <Checkbox.Root
        {...props}
        defaultChecked={sharedRef.current}
        className="bg-background-300 outline-foreground-300/40 aspect-square w-[1.125rem] rounded outline transition-[filter] duration-300 hover:brightness-150"
        onCheckedChange={(value: boolean) => (sharedRef.current = value)}
      >
        <Checkbox.Indicator className="text-foreground-200 flex items-center justify-center">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  );
}
