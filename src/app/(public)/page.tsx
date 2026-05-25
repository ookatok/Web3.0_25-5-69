import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Award, BookOpen } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

// Mock Services
const featuredServices = [
  {
    title: "เสื้อยืดคอกลม / คอวี",
    description: "รับผลิตและพิมพ์ลายเสื้อยืดทุกรูปแบบ สกรีนเนียนสีสด ลายติดทนนาน ด้วยเทคโนโลยีระดับอุตสาหกรรม",
    slug: "t-shirt",
    tag: "ขายดี",
  },
  {
    title: "เสื้อโปโลพนักงาน",
    description: "เสื้อโปโลปกทออย่างดี คลาสสิก ปักโลโก้แบรนด์ คัตติ้งเนี้ยบ เหมาะกับพนักงานออฟฟิศและองค์กร",
    slug: "polo",
    tag: "แนะนำ",
  },
  {
    title: "หมวกแก๊ปพรีเมียม",
    description: "หมวกแก๊ปปักลายนูน หมวกบักเก็ต ของแจก ของสมนาคุณ ปรับสายได้ เนื้อผ้าทนทานหนานุ่ม",
    slug: "cap",
    tag: "ยอดนิยม",
  },
];

// Mock Portfolio
const recentPortfolio = [
  {
    title: "เสื้อยืดกิจกรรม ค่ายวิศวกรรมการบิน",
    category: "เสื้อยืดพิมพ์ลาย",
    imageText: "Engineering Camp T-Shirt",
    slug: "eng-camp-tshirt",
  },
  {
    title: "เสื้อโปโลปักลาย แบรนด์เทคโนโลยี Nexus",
    category: "เสื้อโปโลองค์กร",
    imageText: "Nexus Corporate Polo",
    slug: "nexus-corporate-polo",
  },
  {
    title: "หมวกแจกพรีเมียม คาเฟ่มินิมอล Brew&Co",
    category: "หมวกปัก",
    imageText: "Brew&Co Premium Cap",
    slug: "brew-cap",
  },
];

// Mock Blogs
const latestBlogs = [
  {
    title: "5 วิธีดูแลรักษาเสื้อยืดสกรีนลาย ให้สวยงามทนนาน ไม่หลุดลอกง่าย",
    excerpt: "รวมเคล็ดลับการซักและรีดเสื้อยืดลายสกรีนให้คงทน สีไม่ตก ลายไม่แตกยืด เพื่อยืดอายุการใช้งาน...",
    date: "25 พ.ค. 2026",
    slug: "how-to-care-printed-shirts",
  },
  {
    title: "เปรียบเทียบผ้าฝ้าย Cotton vs TK vs TC แบบไหนเหมาะทำเสื้อโปโลที่สุด?",
    excerpt: "เจาะลึกความแตกต่างของเนื้อผ้าชนิดต่างๆ ในการผลิตเสื้อโปโลพนักงาน ทั้งเรื่องการระบายอากาศและความทนทาน...",
    date: "24 พ.ค. 2026",
    slug: "cotton-vs-tk-vs-tc",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#131415] font-sans pb-24 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Hero Section */}
      <section className="relative pt-28 pb-12">
        <div className="w-full max-w-5xl mx-auto bg-[#212224] text-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
          {/* Neon Ring Background Element */}
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>

          {/* Left Hero Details */}
          <div className="flex-1 space-y-6 relative z-10">
            <div className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">
              TECH OUTFIT // FASHION STYLE
            </div>
            <h1 className="font-teko text-6xl sm:text-8xl md:text-9xl font-bold uppercase tracking-wider leading-[0.85] text-white">
              DISCOVER <br />
              <span className="text-slate-400">LATEST</span>
            </h1>
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
              Premium Streetwear & Corporate Uniforms
            </p>
            <p className="text-xs text-slate-400 max-w-sm font-light leading-relaxed">
              โรงงานรับผลิตเสื้อยืด เสื้อโปโลพนักงาน หมวกแก๊ป และของพรีเมียมแบรนด์คุณภาพสูง บริการออกแบบ Mockup ฟรี คัตติ้งเนี้ยบสไตล์สตรีทแวร์มินิมอล
            </p>
            <div className="flex gap-3 pt-4 font-mono">
              <Link href="/contact">
                <Button className="rounded-full bg-white text-black hover:bg-slate-200 tracking-widest text-[9px] font-bold py-5 px-6 uppercase cursor-pointer">
                  INQUIRE NOW
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" className="rounded-full border-slate-700 text-white hover:bg-white hover:text-black tracking-widest text-[9px] font-bold py-5 px-6 uppercase">
                  PORTFOLIO
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Hero Preview Graphic */}
          <div className="w-full md:w-80 h-72 md:h-96 bg-[#2d2e30] border-2 border-[#444] rounded-[2rem] flex flex-col justify-between p-6 relative overflow-hidden group">
            <div className="font-mono text-[9px] tracking-widest text-slate-500 uppercase">PREVIEW // SHAPE</div>
            <div className="text-center font-teko text-4xl text-white tracking-widest uppercase py-12 border-y border-[#3a3b3d]">
              FIT APPAREL
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span>DESIGN // 3D MOCKUP</span>
              <span>100% PREMIUM</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Services Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl relative overflow-hidden space-y-12">
          
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#4d5055] uppercase font-bold mb-2">
                WHAT WE DO
              </div>
              <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-none text-[#131415]">
                SERVICES
              </h2>
            </div>
            <div className="font-mono text-[10px] text-[#4d5055] uppercase tracking-widest">
              web3.0 catalog
            </div>
          </div>

          {/* Grid Layout matches the ref columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div key={service.slug} className="flex flex-col space-y-4">
                {/* Main Card */}
                <div className="bg-[#1d1f22] text-white rounded-[2rem] p-6 border-2 border-transparent hover:border-white transition-all flex flex-col justify-between h-96 group">
                  <div className="space-y-4">
                    <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-hover:border-white transition-all uppercase">
                      {service.tag}
                    </span>
                    <h3 className="font-teko text-3xl font-semibold uppercase tracking-wider pt-2">
                      {service.slug.replace("-", " ")}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-slate-400 group-hover:text-white uppercase transition-colors"
                  >
                    VIEW DETAILS
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>

                {/* Sub-label Plate underneath (matches Screen 2 of the reference) */}
                <div className="bg-[#2d2e30] text-slate-300 rounded-[1.5rem] p-4 text-[10px] font-mono font-light leading-relaxed border border-white/5 flex gap-3 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                  <span>Custom designs, premium {service.slug} detailing.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-[#212224] text-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">Why Choose Us</span>
              <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-none text-white">
                WE DELIVER <br />
                QUALITY
              </h2>
              <p className="text-xs text-slate-400 font-light leading-relaxed max-w-md">
                เราใส่ใจทุกรายละเอียดตั้งแต่เส้นด้ายจนถึงงานพิมพ์ลาย ด้วยประสบการณ์กว่า 10 ปี เราส่งมอบชุดที่สวมใส่สบาย มีสไตล์สตรีทแวร์มินิมอล บ่งบอกเอกลักษณ์ของแบรนด์คุณได้อย่างชัดเจน
              </p>
              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline" className="rounded-full border-slate-700 text-white font-mono tracking-widest text-[9px] uppercase py-5 px-6">
                    LEARN MORE ABOUT US
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="p-6 rounded-[2rem] bg-[#1d1f22] border border-white/5 space-y-4">
                <div className="p-2.5 bg-white/5 rounded-full text-white w-fit border border-white/10">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-mono text-xs uppercase font-bold tracking-wider">QUALITY CONTROL</h4>
                <p className="text-[10px] text-slate-400 font-light leading-relaxed">คัดเกรดเนื้อผ้า ทอกลัดเกลียวหนา สกรีนคมชัด ตรวจสอบสินค้า 100% ก่อนจัดส่ง</p>
              </div>
              {/* Feature 2 */}
              <div className="p-6 rounded-[2rem] bg-[#1d1f22] border border-white/5 space-y-4">
                <div className="p-2.5 bg-white/5 rounded-full text-white w-fit border border-white/10">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-mono text-xs uppercase font-bold tracking-wider">FREE 3D DESIGN</h4>
                <p className="text-[10px] text-slate-400 font-light leading-relaxed">ทีมกราฟิกดีไซเนอร์ช่วยขึ้นตัวอย่างกราฟิก 3D เสมือนจริงให้ตรวจสอบความถูกต้อง</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recent Portfolio Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-[#4d5055] uppercase font-bold mb-2">Recent Projects</span>
              <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-none text-[#131415]">
                PORTFOLIO
              </h2>
            </div>
            <Link href="/portfolio" className="font-mono text-[10px] text-[#4d5055] uppercase tracking-widest hover:underline flex items-center gap-1.5">
              VIEW ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPortfolio.map((project) => (
              <div key={project.slug} className="group rounded-[2rem] overflow-hidden bg-[#1d1f22] text-white border-2 border-transparent hover:border-white transition-all">
                <div className="h-48 bg-[#2d2e30] border-b border-[#202225] flex items-center justify-center p-6 text-slate-400 font-bold relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 group-hover:scale-105 transition-transform duration-500"></div>
                  <span className="relative z-10 text-[9px] uppercase tracking-widest text-slate-300 bg-black/50 px-4 py-2 border border-white/10 rounded-full">
                    {project.imageText}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-[8px] tracking-widest uppercase font-mono text-slate-500">{project.category}</span>
                  <h3 className="text-xs font-bold text-white group-hover:text-slate-300 transition-colors uppercase font-mono">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Latest Blog Posts Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-[#212224] text-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold mb-2">Latest Articles</span>
              <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-none text-white">
                INSIGHTS
              </h2>
            </div>
            <Link href="/blog" className="font-mono text-[10px] text-slate-400 uppercase tracking-widest hover:underline flex items-center gap-1.5">
              READ ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestBlogs.map((blog) => (
              <div key={blog.slug} className="p-8 rounded-[2rem] bg-[#1d1f22] border border-white/5 hover:border-white transition-all group flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono font-semibold uppercase">
                    <BookOpen className="w-3 h-3" />
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="font-mono text-sm font-bold text-white group-hover:text-slate-300 transition-colors uppercase leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-slate-400 group-hover:text-white uppercase mt-4"
                >
                  READ ARTICLE
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call To Action Section */}
      <section className="py-6 max-w-5xl mx-auto">
        <div className="bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl relative overflow-hidden text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-teko text-5xl md:text-7xl font-bold uppercase tracking-wide leading-none text-[#131415]">
              START YOUR DESIGN
            </h2>
            <p className="text-xs text-[#4d5055] font-light leading-relaxed max-w-md mx-auto">
              ไม่ว่าจะมีแบบอยู่แล้ว หรือต้องการขึ้นแบบใหม่ ทีมดีไซเนอร์สตรีทแวร์และยูนิฟอร์มพร้อมให้คำปรึกษาและขึ้นแบบ Mockup ให้คุณทันที
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button className="w-full py-5 px-8 rounded-full bg-black text-white hover:bg-zinc-800 tracking-widest text-[9px] font-bold uppercase cursor-pointer">
                CONTACT US
              </Button>
            </Link>
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[9px] font-bold tracking-widest bg-[#2d2e30] text-white hover:bg-black transition-all uppercase"
            >
              LINE @WEB3.0
            </a>
            <a
              href="tel:0999999999"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[9px] font-bold tracking-widest bg-[#2d2e30] text-white hover:bg-black transition-all uppercase"
            >
              CALL 099-999-9999
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
