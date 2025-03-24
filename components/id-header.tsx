import { Link2Icon } from "@radix-ui/react-icons";

export function IdHeader({ id, text }: { id: string; text: string }) {
  return (
    <h3 className="mt-14 font-medium">
      <a
        className="group inline-flex items-center gap-x-2"
        id={id}
        href={`#${id}`}
      >
        {text}
        <Link2Icon className="text-foreground-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </a>
    </h3>
  );
}
