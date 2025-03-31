import { Link2Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

export function AnchoredHeader({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h3 className="mt-14 font-medium">
      <a
        className="group inline-flex items-center gap-x-2"
        id={id}
        href={`#${id}`}
      >
        <span>{children}</span>
        <Link2Icon className="text-foreground-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </a>
    </h3>
  );
}
