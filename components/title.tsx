import type { ComponentPropsWithRef } from "react";

type TitleProps = {
  name: string;
  date: Date;
} & ComponentPropsWithRef<"div">;

export function Title({ name, date, ...props }: TitleProps) {
  return (
    <div {...props}>
      <p className="font-medium">{name}</p>
      <p className="text-foreground-200 text-sm">
        {date.toLocaleString("en-US", { month: "long" })} {date.getFullYear()}
      </p>
    </div>
  );
}
