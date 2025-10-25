import type { ComponentPropsWithRef } from "react";

type TitleProps = {
  title: string;
  date: Date;
} & ComponentPropsWithRef<"div">;

export function Title({ title, date, ...props }: TitleProps) {
  return (
    <div {...props}>
      <p className="font-medium">{title}</p>
      <p className="text-foreground-200 text-sm">
        {date.toLocaleString("en-US", { month: "long" })} {date.getFullYear()}
      </p>
    </div>
  );
}
