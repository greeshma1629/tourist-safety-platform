import { ReactNode } from "react";

import TouristSidebar from "@/components/TouristSidebar";
import MobileTouristHeader from "@/components/MobileTouristHeader";

type TouristShellProps = {
  children: ReactNode;
};

export default function TouristShell({
  children,
}: TouristShellProps) {
  return (
    <div className="tourist-background min-h-screen">
      <MobileTouristHeader />

      <div className="flex">
        <TouristSidebar />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}