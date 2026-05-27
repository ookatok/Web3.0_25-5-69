/**
 * @file page.tsx
 * @path src/app/(public)/page.tsx
 * @description หน้าหลักแรกสุด (Home Page) ของเว็บไซต์ รวมสไลเดอร์ผลงาน แคตตาล็อกสินค้า และบทความล่าสุด
 */

import React from "react";
import Link from "next/link";
import { ArrowRight, Shirt, Award, BookOpen } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";
import { container } from "@/infrastructure/di/container";
import HeroSlideshow from "@/presentation/components/shared/HeroSlideshow";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  // Fetch projects for hero slideshow
  let slideshowProjects: any[] = [];
  try {
    const { projects } = await container.listProjects.execute({
      status: "PUBLISHED",
      limit: 6,
    });
    slideshowProjects = projects.map(p => p.toJSON());
  } catch (err) {
    console.error("Failed to fetch projects for hero slideshow:", err);
  }

  // Fallback if empty or database error
  if (slideshowProjects.length === 0) {
    slideshowProjects = [
      {
        id: "mock-1",
        title: lang === "th" ? "เสื้อยืดกิจกรรม ค่ายวิศวกรรมการบิน" : "Aviation Engineering Camp Activity T-Shirt",
        category: lang === "th" ? "เสื้อยืดพิมพ์ลาย" : "Printed T-Shirt",
        coverImage: "/uploads/portfolio/1779702005518-8e1ec61a2aaa27cc.jpg",
        slug: "eng-camp-tshirt",
      },
      {
        id: "mock-2",
        title: lang === "th" ? "เสื้อโปโลปักลาย แบรนด์เทคโนโลยี Nexus" : "Nexus Technology Brand Embroidered Polo",
        category: lang === "th" ? "เสื้อโปโลองค์กร" : "Corporate Polo",
        coverImage: "/uploads/portfolio/1779702039187-3701e015294f53cb.jpg",
        slug: "nexus-corporate-polo",
      },
      {
        id: "mock-3",
        title: lang === "th" ? "หมวกแจกพรีเมียม คาเฟ่มินิมอล Brew&Co" : "Brew&Co Premium Cap",
        category: lang === "th" ? "หมวกปัก" : "Embroidered Cap",
        coverImage: "/uploads/portfolio/1779703725207-7fd99d32b1614f43.jpg",
        slug: "brew-cap",
      },
    ];
  }

  // Mock Services (localized)
  const featuredServices = [
    {
      title: lang === "th" ? "เสื้อยืดคอกลม / คอวี" : "Custom T-Shirts",
      description: lang === "th"
        ? "รับผลิตและพิมพ์ลายเสื้อยืดทุกรูปแบบ สกรีนเนียนสีสด ลายติดทนนาน ด้วยเทคโนโลยีระดับอุตสาหกรรม"
        : "Custom circular/V-neck t-shirt manufacturing, vibrant printing, durable washability, and modern styling.",
      slug: "t-shirt",
      tag: lang === "th" ? "ขายดี" : "Best Seller",
      image: "/tshirt_service.png",
    },
    {
      title: lang === "th" ? "เสื้อโปโลพนักงาน" : "Corporate Polo",
      description: lang === "th"
        ? "เสื้อโปโลปกทออย่างดี คลาสสิก ปักโลโก้แบรนด์ คัตติ้งเนี้ยบ เหมาะกับพนักงานออฟฟิศและองค์กร"
        : "Classic woven-collar polo shirts with custom embroidery, sleek tailoring, suitable for corporate workforces.",
      slug: "polo",
      tag: lang === "th" ? "แนะนำ" : "Recommended",
      image: "/polo_service.png",
    },
    {
      title: lang === "th" ? "หมวกแก๊ปพรีเมียม" : "Premium Cap & Gifts",
      description: lang === "th"
        ? "หมวกแก๊ปปักลายนูน หมวกบักเก็ต ของแจก ของสมนาคุณ ปรับสายได้ เนื้อผ้าทนทานหนานุ่ม"
        : "3D embossed computer embroidered caps, bucket hats, giveaways, durable fabrics, and adjustable closures.",
      slug: "cap",
      tag: lang === "th" ? "ยอดนิยม" : "Popular",
      image: "/cap_service.png",
    },
  ];

  // Mock Portfolio (localized)
  let recentPortfolio: any[] = [];
  try {
    const { projects } = await container.listProjects.execute({
      status: "PUBLISHED",
      limit: 3,
    });
    recentPortfolio = projects.map(p => p.toJSON());
  } catch (err) {
    console.error("Failed to fetch recent projects:", err);
  }

  if (recentPortfolio.length === 0) {
    recentPortfolio = [
    {
      title: lang === "th" ? "เสื้อยืดกิจกรรม ค่ายวิศวกรรมการบิน" : "Aviation Engineering Camp Activity T-Shirt",
      category: lang === "th" ? "เสื้อยืดพิมพ์ลาย" : "Printed T-Shirt",
      imageText: "Engineering Camp T-Shirt",
      slug: "eng-camp-tshirt",
    },
    {
      title: lang === "th" ? "เสื้อโปโลปักลาย แบรนด์เทคโนโลยี Nexus" : "Nexus Technology Brand Embroidered Polo",
      category: lang === "th" ? "เสื้อโปโลองค์กร" : "Corporate Polo",
      imageText: "Nexus Corporate Polo",
      slug: "nexus-corporate-polo",
    },
    {
      title: lang === "th" ? "หมวกแจกพรีเมียม คาเฟ่มินิมอล Brew&Co" : "Brew&Co Minimalist Cafe Premium Cap",
      category: lang === "th" ? "หมวกปัก" : "Embroidered Cap",
      imageText: "Brew&Co Premium Cap",
      slug: "brew-cap",
    },
    ];
  }

  // Mock Blogs (localized)
  const latestBlogs = [
    {
      title: lang === "th"
        ? "5 วิธีดูแลรักษาเสื้อยืดสกรีนลาย ให้สวยงามทนนาน ไม่หลุดลอกง่าย"
        : "5 Tips to Care for Printed T-Shirts to Prevent Peeling and Fading",
      excerpt: lang === "th"
        ? "รวมเคล็ดลับการซักและรีดเสื้อยืดลายสกรีนให้คงทน สีไม่ตก ลายไม่แตกยืด เพื่อยืดอายุการใช้งาน..."
        : "Discover tips for washing and ironing screen-printed t-shirts to maintain colors and prevent prints from cracking...",
      date: lang === "th" ? "25 พ.ค. 2026" : "May 25, 2026",
      slug: "how-to-care-printed-shirts",
    },
    {
      title: lang === "th"
        ? "เปรียบเทียบผ้าฝ้าย Cotton vs TK vs TC แบบไหนเหมาะทำเสื้อโปโลที่สุด?"
        : "Fabric Comparison: Cotton vs TK vs TC - Which is Best for Corporate Polos?",
      excerpt: lang === "th"
        ? "เจาะลึกความแตกต่างของเนื้อผ้าชนิดต่างๆ ในการผลิตเสื้อโปโลพนักงาน ทั้งเรื่องการระบายอากาศและความทนทาน..."
        : "An in-depth look at different fabrics for making staff polo shirts, comparing breathability and durability...",
      date: lang === "th" ? "24 พ.ค. 2026" : "May 24, 2026",
      slug: "cotton-vs-tk-vs-tc",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-theme-bg text-theme-text transition-colors duration-300 font-sans pb-24 px-4 sm:px-6 lg:px-8 space-y-12">
      <section className="relative pt-28 pb-12">
        <div className="w-full max-w-7xl mx-auto bg-theme-card-bg/95 backdrop-blur-md text-theme-card-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Ambient Glow Blobs */}
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>
          
          {/* Fashion Background Image Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero_fashion_bg.png"
              alt="Fashion Background Texture"
              className="w-full h-full object-cover opacity-[0.06] dark:opacity-[0.12] mix-blend-luminosity"
            />
          </div>

          {/* Tech Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

          {/* Neon Ring Background Element */}
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>

          {/* Left Hero Details */}
          <div className="flex-1 space-y-6 relative z-10">
            {/* Tech Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
              <span className="font-mono text-[9px] tracking-widest text-theme-card-subtext uppercase font-bold">
                {t.heroSub}
              </span>
            </div>

            <h1 className="font-teko text-7xl sm:text-8xl lg:text-9xl font-bold uppercase tracking-wider leading-[1.25] sm:leading-[1.15] lg:leading-[1.1] text-theme-card-text dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:via-white dark:to-slate-400">
              {t.heroTitleDiscover} <br />
              <span className="text-theme-card-subtext dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-slate-400 dark:via-slate-200 dark:to-slate-500">{t.heroTitleLatest}</span>
            </h1>

            <p className="font-mono text-[9px] text-indigo-600 dark:text-indigo-400/80 uppercase tracking-widest font-bold mt-2">
              // {lang === "th" ? "ผลิตยูนิฟอร์มพนักงานและเสื้อผ้าสตรีทแวร์พรีเมียม" : "Premium Streetwear & Corporate Uniforms"}
            </p>
            <p className="text-xs text-theme-card-subtext max-w-sm font-light leading-relaxed">
              {t.heroDesc}
            </p>

            {/* Technical Stats list */}
            <div className="flex flex-wrap items-center gap-6 pt-6 font-mono text-[9px] text-theme-card-subtext border-t border-slate-200 dark:border-white/5 max-w-md">
              <div className="space-y-1">
                <span className="block text-theme-card-text font-extrabold text-[10px]">EST. 2016</span>
                <span className="block text-[7px] tracking-wider opacity-60">FOUNDATION</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/10 hidden sm:block"></div>
              <div className="space-y-1">
                <span className="block text-theme-card-text font-extrabold text-[10px]">100% PREMIUM</span>
                <span className="block text-[7px] tracking-wider opacity-60">QUALITY CHECKED</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/10 hidden sm:block"></div>
              <div className="space-y-1">
                <span className="block text-theme-card-text font-extrabold text-[10px]">FREE 3D MOCKUP</span>
                <span className="block text-[7px] tracking-wider opacity-60">DESIGN SERVICE</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 font-mono">
              <Link href="/contact">
                <Button className="rounded-full bg-theme-button-primary-bg text-theme-button-primary-text hover:bg-theme-button-primary-bg/80 tracking-widest text-[9px] font-bold py-5 px-6 uppercase cursor-pointer">
                  {t.heroInquireNow}
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" className="rounded-full border-theme-button-outline-border bg-transparent text-theme-button-outline-text hover:bg-theme-button-primary-bg hover:text-theme-button-primary-text tracking-widest text-[9px] font-bold py-5 px-6 uppercase cursor-pointer">
                  {t.heroPortfolio}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Hero Preview Slideshow */}
          <HeroSlideshow projects={slideshowProjects} lang={lang} />
        </div>
      </section>

      {/* 2. Featured Services Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-theme-inverted-bg text-theme-inverted-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border-[4px] border-theme-inverted-border shadow-2xl relative overflow-hidden space-y-12">
          
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-theme-inverted-text/80 uppercase font-bold mb-2">
                {t.servicesSub}
              </div>
              <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-[1.1] text-theme-inverted-text">
                {t.servicesTitle}
              </h2>
            </div>
            <div className="font-mono text-[10px] text-theme-inverted-text/80 uppercase tracking-widest">
              {t.servicesInfo}
            </div>
          </div>

          {/* Grid Layout matches the ref columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div key={service.slug} className="flex flex-col space-y-4">
                {/* Main Card */}
                <div className="bg-theme-bg text-theme-card-text rounded-[2rem] p-6 border-2 border-transparent hover:border-theme-inverted-text transition-all flex flex-col justify-between min-h-[30rem] h-auto group">
                  <div className="space-y-4">
                    {service.image && (
                      <div className="relative h-44 bg-theme-card-bg rounded-[1.5rem] overflow-hidden border border-white/5 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-theme-card-bg border border-theme-card-border text-theme-card-subtext group-hover:text-theme-card-text group-hover:border-theme-card-text transition-all uppercase inline-flex">
                      {service.tag}
                    </span>
                    <h3 className="font-teko text-3xl font-semibold uppercase tracking-wider pt-2">
                      {service.slug === "t-shirt" ? (lang === "th" ? "T-SHIRT" : "T-SHIRT") : service.slug.replace("-", " ")}
                    </h3>
                    <p className="text-[11px] text-theme-card-subtext font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-theme-card-subtext group-hover:text-theme-card-text uppercase transition-colors"
                  >
                    {t.serviceDetailBtn}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>

                {/* Sub-label Plate underneath (matches Screen 2 of the reference) */}
                <div className="bg-theme-card-bg text-theme-card-subtext rounded-[1.5rem] p-4 text-[10px] font-mono font-light leading-relaxed border border-theme-card-border flex gap-3 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme-card-text animate-pulse shrink-0"></span>
                  <span>
                    {lang === "th"
                      ? `สั่งออกแบบพิเศษ ตกแต่งรายละเอียด ${service.title} ระดับพรีเมียม`
                      : `Custom designs, premium ${service.slug} detailing.`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-theme-card-bg text-theme-card-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase font-bold">{t.whyChooseUsSub}</span>
              <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-[1.25] md:leading-[1.15] text-theme-card-text whitespace-pre-line">
                {t.whyChooseUsTitle}
              </h2>
              <p className="text-xs text-theme-card-subtext font-light leading-relaxed max-w-md">
                {t.whyChooseUsDesc}
              </p>
              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline" className="rounded-full border-theme-button-outline-border bg-transparent text-theme-button-outline-text hover:bg-theme-button-primary-bg hover:text-theme-button-primary-text tracking-widest text-[9px] font-bold py-5 px-6 uppercase cursor-pointer">
                    {t.whyChooseUsLearnMore}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="p-6 rounded-[2rem] bg-theme-bg border border-theme-card-border space-y-4">
                <div className="p-2.5 bg-theme-card-bg rounded-full text-theme-card-text w-fit border border-theme-card-border">
                  <Shirt className="w-4 h-4" />
                </div>
                <h4 className="font-mono text-xs uppercase font-bold tracking-wider">{t.whyChooseUsQualityTitle}</h4>
                <p className="text-[10px] text-theme-card-subtext font-light leading-relaxed">{t.whyChooseUsQualityDesc}</p>
              </div>
              {/* Feature 2 */}
              <div className="p-6 rounded-[2rem] bg-theme-bg border border-theme-card-border space-y-4">
                <div className="p-2.5 bg-theme-card-bg rounded-full text-theme-card-text w-fit border border-theme-card-border">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-mono text-xs uppercase font-bold tracking-wider">{t.whyChooseUsDesignTitle}</h4>
                <p className="text-[10px] text-theme-card-subtext font-light leading-relaxed">{t.whyChooseUsDesignDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recent Portfolio Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-theme-inverted-bg text-theme-inverted-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border-[4px] border-theme-inverted-border shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-theme-inverted-text/80 uppercase font-bold mb-2">{t.recentProjectsSub}</span>
              <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-[1.1] text-theme-inverted-text">
                {t.recentProjectsTitle}
              </h2>
            </div>
            <Link href="/portfolio" className="font-mono text-[10px] text-theme-inverted-text/80 uppercase tracking-widest hover:underline flex items-center gap-1.5">
              {t.recentProjectsViewAll} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPortfolio.map((project) => (
              <Link
                key={project.id || project.slug}
                href={`/portfolio/${project.slug}`}
                className="group rounded-[2rem] overflow-hidden bg-theme-bg text-theme-card-text border-2 border-transparent hover:border-theme-inverted-text transition-all block"
              >
                <div className="h-64 bg-theme-card-bg border-b border-theme-card-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 group-hover:scale-105 transition-transform duration-500"></div>
                  {project.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="relative z-10 text-[9px] uppercase tracking-widest text-theme-card-text bg-theme-bg/85 border border-theme-card-border rounded-full px-3 py-1">
                      {project.imageText || project.title}
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-[8px] tracking-widest uppercase font-mono text-theme-card-subtext">{project.category}</span>
                  <h3 className="text-xs font-bold text-theme-card-text group-hover:text-theme-card-subtext transition-colors uppercase font-mono line-clamp-2 leading-snug">
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Latest Blog Posts Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-theme-card-bg text-theme-card-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase font-bold mb-2">{t.latestArticlesSub}</span>
              <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-[1.1] text-theme-card-text">
                {t.latestArticlesTitle}
              </h2>
            </div>
            <Link href="/blog" className="font-mono text-[10px] text-theme-card-subtext uppercase tracking-widest hover:underline flex items-center gap-1.5">
              {t.latestArticlesReadAll} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestBlogs.map((blog) => (
              <div key={blog.slug} className="p-8 rounded-[2rem] bg-theme-bg border border-theme-card-border hover:border-theme-card-text transition-all group flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[9px] text-theme-card-subtext font-mono font-semibold uppercase">
                    <BookOpen className="w-3 h-3" />
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="font-mono text-sm font-bold text-theme-card-text group-hover:text-theme-card-subtext transition-colors uppercase leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-[11px] text-theme-card-subtext font-light leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-theme-card-subtext group-hover:text-theme-card-text uppercase mt-4"
                >
                  {t.blogRead}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call To Action Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-theme-inverted-bg text-theme-inverted-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border-[4px] border-theme-inverted-border shadow-2xl relative overflow-hidden text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-[1.1] text-theme-inverted-text">
              {t.ctaTitle}
            </h2>
            <p className="text-xs text-theme-inverted-text/80 font-light leading-relaxed max-w-md mx-auto">
              {t.ctaDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button className="w-full py-5 px-8 rounded-full bg-theme-bg text-theme-card-text hover:bg-theme-card-text hover:text-theme-bg tracking-widest text-[9px] font-bold uppercase cursor-pointer">
                {t.ctaContactUs}
              </Button>
            </Link>
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[9px] font-bold tracking-widest bg-theme-bg text-theme-card-text hover:bg-theme-card-text hover:text-theme-bg transition-all uppercase"
            >
              LINE @WEB3.0
            </a>
            <a
              href="tel:0999999999"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[9px] font-bold tracking-widest bg-theme-bg text-theme-card-text hover:bg-theme-card-text hover:text-theme-bg transition-all uppercase"
            >
              CALL 099-999-9999
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
