import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Member } from "@/components/member";
import { Products } from "@/components/products";
import { Partners } from "@/components/partners";
import { Careers } from "@/components/careers";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="relative bg-ink">
      {/* Sticky, always-on-top navigation. */}
      <SiteNav />
      <main>
        {/* 1 · Hero — bilingual title screen */}
        <Hero />
        {/* 2 · Giới thiệu công ty — the VNZ story */}
        <About />
        {/* 3 · Đội ngũ — full-screen character viewer */}
        <Member />
        {/* 4 · Sản phẩm — product showcase (StylaiBox, TaskCoper) */}
        <Products />
        {/* 5 · Đối tác — partner roster */}
        <Partners />
        {/* 6 · Tuyển dụng — JRPG "class select" recruitment board */}
        <Careers />
      </main>
      <SiteFooter />
    </div>
  );
}
