import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { Member } from "@/components/member";
import { SiteFooter } from "@/components/site-footer";
import { SpotlightProvider } from "@/components/spotlight";

export default function Home() {
  return (
    <SpotlightProvider>
      <div className="relative bg-sky">
        <SiteNav />
        <main>
          <Hero />
          {/* Full-screen character viewer — hover an avatar to swap the
              standing character, profile, and hometown backdrop. */}
          <Member />
        </main>
        <SiteFooter />
      </div>
    </SpotlightProvider>
  );
}
