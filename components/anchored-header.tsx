import { Link2Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

type AnchoredHeaderProps = {
  id: string;
  children: ReactNode;
};

export function AnchoredHeader({ id, children }: AnchoredHeaderProps) {
  const href = id ? `#${id}` : undefined;
  return (
    <h2 className="mt-14 font-medium">
      <a className="group inline-flex items-center gap-x-2" id={id} href={href}>
        <span>{children}</span>
        <Link2Icon className="text-foreground-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </a>
    </h2>
  );
}
