"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Member } from "@/lib/members";

/**
 * Shared "who is in the spotlight" state. The nav reads `active` to swap its
 * logo + link colors to a dark-stage palette. The current page hero is the
 * light <Hero/> cityscape, so `active` stays null (nav keeps its default light
 * mode) — the <Member/> viewer tracks its own selection locally. Kept available
 * for any section that wants to darken the stage. `active` holds the member
 * object (not the slug) so duplicate slugs still resolve uniquely.
 */
type SpotlightValue = {
  active: Member | null;
  spotlight: (m: Member) => void;
  clear: () => void;
};

const SpotlightContext = createContext<SpotlightValue | null>(null);

export function SpotlightProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Member | null>(null);
  return (
    <SpotlightContext.Provider
      value={{ active, spotlight: setActive, clear: () => setActive(null) }}
    >
      {children}
    </SpotlightContext.Provider>
  );
}

export function useSpotlight(): SpotlightValue {
  const ctx = useContext(SpotlightContext);
  if (!ctx) {
    throw new Error("useSpotlight must be used inside <SpotlightProvider>");
  }
  return ctx;
}
