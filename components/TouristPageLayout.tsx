import { ReactNode } from "react";

import TouristShell from "@/components/TouristShell";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function TouristPageLayout({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <TouristShell>
      <div className="mx-auto max-w-[1450px] px-5 py-6 sm:px-8 lg:px-8 lg:py-8">
        <header className="glass-panel relative overflow-hidden rounded-[30px] px-6 py-7 sm:px-8">
          <div className="absolute -right-16 -top-24 h-52 w-52 rounded-full bg-blue-400/15 blur-3xl" />

          <div className="absolute bottom-[-100px] left-[35%] h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              {eyebrow}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {description}
            </p>
          </div>
        </header>

        <div className="pt-6">
          {children}
        </div>
      </div>
    </TouristShell>
  );
}