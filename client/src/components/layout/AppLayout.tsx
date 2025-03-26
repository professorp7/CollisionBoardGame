import { ReactNode } from "react";
import { Header } from "./Header";
import Navigation from "./Navigation";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <Header />
        <Navigation />
        <main className="pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
