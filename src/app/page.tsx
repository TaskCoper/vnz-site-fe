import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Member } from "@/components/member";
import { SectionStub } from "@/components/section-stub";
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
        {/* 4 · Sản phẩm — placeholder until real content lands */}
        <SectionStub
          id="products"
          kicker="Sản phẩm · Products"
          title="Những dấu ấn công nghệ"
          blurb="Các sản phẩm và nền tảng do VNZ xây dựng — từ trí tuệ Việt Nam, giải quyết những bài toán thực tiễn của xã hội."
          tint="var(--color-sunset)"
        />
        {/* 5 · Đối tác — placeholder */}
        <SectionStub
          id="partners"
          kicker="Đối tác · Partners"
          title="Cùng nhau kiến tạo"
          blurb="Những doanh nghiệp, tổ chức và cộng đồng đang đồng hành cùng VNZ trên hành trình tạo ra giá trị bằng công nghệ."
          tint="var(--color-jade)"
        />
        {/* 6 · Tuyển dụng — placeholder */}
        <SectionStub
          id="careers"
          kicker="Tuyển dụng · Careers"
          title="Thế hệ dám kiến tạo"
          blurb="Tuổi trẻ không phải lý do để được ưu ái, mà là trách nhiệm để nỗ lực nhiều hơn. Nếu bạn muốn trực tiếp tạo ra giá trị của riêng mình — VNZ dành cho bạn."
          tint="var(--color-ember)"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
