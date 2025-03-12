import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

const links = [
  {
    icon: <GitHubLogoIcon className="size-6" />,
    href: "https://github.com/Karledo",
  },
  {
    icon: <LinkedInLogoIcon className="size-6" />,
    href: "https://www.linkedin.com/in/karl-edochie-40786b355/",
  },
];

export function Footer() {
  return (
    <footer>
      <div className="border-background-300 mt-10 flex items-center justify-between border-t pt-10">
        <span className="text-foreground-200 text-sm">Karl Edochie</span>
        <div className="text-foreground-200 inline-flex gap-x-3">
          {links.map(({ icon, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground-100 transition-colors duration-300"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
