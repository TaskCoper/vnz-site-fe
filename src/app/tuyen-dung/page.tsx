import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Careers } from "@/components/careers";

/**
 * /tuyen-dung — the careers destination, lifted out of the homepage story.
 *
 * It was chapter 06, but five roles each carrying duties, requirements and a
 * stat sheet is a page's worth of reading; inlining it pushed the closing Tầm
 * nhìn beat far below the fold. The homepage now points here instead.
 *
 * No breadcrumb, matching `/doi-ngu` — the nav's logo and menu are the way back.
 * `Careers` carries its own `py-24 sm:py-28`, which is what now clears the fixed
 * header; the removed breadcrumb used to supply that top padding, so don't strip
 * the section's own padding without replacing it.
 */
export const metadata: Metadata = {
  title: "Tuyển dụng — VNZ",
  description:
    "Các vị trí đang mở tại VNZ — Vietnam Z-DNA Technology. Chọn lớp nhân vật của bạn và tham gia từ chương đầu tiên.",
};

export default function TuyenDungPage() {
  return (
    <div className="relative paper">
      <SiteNav />
      <main>
        <Careers />
      </main>
      <SiteFooter />
    </div>
  );
}
