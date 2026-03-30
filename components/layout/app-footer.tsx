import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Support" },
];

export function AppFooter() {
  return (
    <footer className="mt-auto w-full bg-slate-100 py-12 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} MoneyCheck. Editorial Financial Intelligence for the Next Generation.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-medium uppercase tracking-wide text-slate-500 underline-offset-4 transition-opacity hover:text-indigo-500 hover:underline dark:text-slate-400 dark:hover:text-indigo-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
