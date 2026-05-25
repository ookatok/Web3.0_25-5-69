"use client";

import React, { useState, useTransition } from "react";
import { Mail, Phone, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { createContactAction } from "@/presentation/actions/contact.actions";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Price Estimator State
  const [activeTab, setActiveTab] = useState<"general" | "estimate">("general");
  const [productType, setProductType] = useState<"t-shirt" | "polo" | "cap" | "uniform">("t-shirt");
  const [fabricGrade, setFabricGrade] = useState<"economy" | "premium" | "ultra">("premium");
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>(["silkscreen"]);
  const [quantity, setQuantity] = useState<number>(100);

  const getProductLabel = (type: string) => {
    switch (type) {
      case "t-shirt": return "เสื้อยืด (T-Shirt)";
      case "polo": return "เสื้อโปโล (Polo Shirt)";
      case "cap": return "หมวก (Cap)";
      case "uniform": return "ชุดยูนิฟอร์ม (Uniform)";
      default: return "";
    }
  };

  const getFabricLabel = (grade: string) => {
    switch (grade) {
      case "economy": return "ประหยัด (Economy)";
      case "premium": return "มาตรฐานยอดนิยม (Premium)";
      case "ultra": return "พรีเมียมหนานุ่ม (Ultra-Premium)";
      default: return "";
    }
  };

  const getTechniqueLabel = (tech: string) => {
    switch (tech) {
      case "silkscreen": return "สกรีนกึ่งยาง (Silkscreen)";
      case "embroidery": return "งานปักคอมพิวเตอร์ (Embroidery)";
      case "dtg": return "พิมพ์ดิจิทัล (DTG)";
      default: return "";
    }
  };

  // Base prices
  const basePrices = {
    "t-shirt": 120,
    "polo": 180,
    "cap": 90,
    "uniform": 250,
  };

  // Fabric multipliers
  const fabricMultipliers = {
    economy: 1.0,
    premium: 1.2,
    ultra: 1.5,
  };

  // Technique costs
  const techniqueCosts: Record<string, number> = {
    silkscreen: 20,
    embroidery: 30,
    dtg: 50,
  };

  const basePrice = basePrices[productType];
  const fabricMultiplier = fabricMultipliers[fabricGrade];
  const techniqueCostsSum = selectedTechniques.reduce((sum, tech) => sum + (techniqueCosts[tech] || 0), 0);

  const rawPricePerPiece = (basePrice * fabricMultiplier) + techniqueCostsSum;

  // Discounts
  let discountPct = 0;
  if (quantity >= 300) {
    discountPct = 0.20;
  } else if (quantity >= 100) {
    discountPct = 0.10;
  } else if (quantity >= 50) {
    discountPct = 0.05;
  }

  const pricePerPiece = Math.round(rawPricePerPiece * (1 - discountPct));
  const totalPrice = pricePerPiece * quantity;

  const toggleTechnique = (tech: string) => {
    if (selectedTechniques.includes(tech)) {
      setSelectedTechniques(selectedTechniques.filter(t => t !== tech));
    } else {
      setSelectedTechniques([...selectedTechniques, tech]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalMessage = activeTab === "estimate" 
      ? `[REQUEST TYPE: PRICE ESTIMATION]
PRODUCT: ${getProductLabel(productType)}
FABRIC: ${getFabricLabel(fabricGrade)}
TECHNIQUES: ${selectedTechniques.map(getTechniqueLabel).join(", ") || "ไม่มีการสกรีน/ปัก"}
QUANTITY: ${quantity} pcs
ESTIMATED PRICE/UNIT: ${pricePerPiece.toLocaleString()} THB ${discountPct > 0 ? `(${discountPct * 100}% Discount applied)` : ""}
ESTIMATED TOTAL: ${totalPrice.toLocaleString()} THB
ADDITIONAL DETAILS:
${message || "ไม่มีรายละเอียดเพิ่มเติม"}`
      : message;

    if (!name || !finalMessage) {
      setError("กรุณากรอกชื่อผู้ติดต่อและรายละเอียดที่สนใจ");
      return;
    }

    if (!phone && !email) {
      setError("กรุณากรอกเบอร์โทรศัพท์หรืออีเมลช่องทางใดช่องทางหนึ่ง เพื่อการติดต่อกลับ");
      return;
    }

    if (phone) {
      if (phone.length > 50) {
        setError("เบอร์โทรศัพท์ต้องมีความยาวไม่เกิน 50 ตัวอักษร");
        return;
      }
      const phoneRegex = /^[0-9+\-\s()]*(\s*(ext|ext\.|ต่อ)\s*[0-9]+)?$/i;
      if (!phoneRegex.test(phone)) {
        setError("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข และรองรับเบอร์ส่วนบุคคล/บริษัท/ต่างประเทศ)");
        return;
      }
    }

    startTransition(async () => {
      const result = await createContactAction({
        name,
        phone: phone || null,
        email: email || null,
        message: finalMessage,
      });

      if (!result.success) {
        setError(result.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } else {
        setSuccess(true);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#131415] py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      {/* Main Glassmorphic/Matte Modular Card */}
      <div className="w-full max-w-5xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 border-[4px] border-[#202225] shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-12 items-stretch">
        
        {/* Left Section: Contact Form */}
        <div className="flex-1 flex flex-col justify-between space-y-8">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-[#4d5055] uppercase font-bold mb-3">
              HOME ABOUT CONTACT
            </div>
            <h1 className="font-teko text-6xl md:text-8xl font-bold uppercase tracking-wide leading-none text-[#131415]">
              CONTACT US
            </h1>
            <p className="font-mono text-xs text-[#4c4e51] tracking-widest uppercase mt-1">
              {activeTab === "estimate" ? "estimate tool" : "drop a message"}
            </p>
          </div>

          {success ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 bg-[#2a2c2e] text-white rounded-3xl p-8 border border-white/5 shadow-inner">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold font-mono tracking-widest uppercase">SUBMIT SUCCESS!</h3>
              <p className="text-[11px] text-slate-300 font-light max-w-xs leading-relaxed">
                ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว ทีมงานฝ่ายเสนอราคาจะตรวจสอบข้อมูลและติดต่อกลับภายใน 24 ชั่วโมง ขอบคุณที่ให้ความสนใจครับ
              </p>
              <Button onClick={() => setSuccess(false)} className="rounded-full border border-slate-700 bg-[#131415] hover:bg-zinc-800 text-white font-mono tracking-widest text-[10px] uppercase py-4 px-6 mt-4">
                SEND ANOTHER MESSAGE
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-xs font-semibold text-rose-400 bg-[#2a2c2e] border border-rose-500/30 rounded-2xl font-mono">
                  ERROR // {error.toUpperCase()}
                </div>
              )}

              {/* Tab Toggles */}
              <div className="flex gap-1.5 p-1 bg-[#2a2c2e] rounded-full w-full max-w-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                    activeTab === "general"
                      ? "bg-white text-black font-extrabold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  MESSAGE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("estimate")}
                  className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                    activeTab === "estimate"
                      ? "bg-white text-black font-extrabold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ESTIMATOR
                </button>
              </div>

              <div className="space-y-4">
                {/* Standard Inputs */}
                <div className="space-y-3">
                  <Input
                    id="name"
                    type="text"
                    placeholder="FULL NAME / ORGANIZATION *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                    className="bg-[#2a2c2e] border-none text-white placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 transition-all rounded-full text-xs py-6 px-6 font-mono font-bold tracking-wide uppercase"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="PHONE NUMBER"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isPending}
                      className="bg-[#2a2c2e] border-none text-white placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 transition-all rounded-full text-xs py-6 px-6 font-mono font-bold tracking-wide uppercase"
                    />

                    <Input
                      id="email"
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPending}
                      className="bg-[#2a2c2e] border-none text-white placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 transition-all rounded-full text-xs py-6 px-6 font-mono font-bold tracking-wide uppercase"
                    />
                  </div>
                </div>

                {/* Price Estimator Details (Show only when estimator tab is active) */}
                {activeTab === "estimate" && (
                  <div className="p-5 bg-[#2a2c2e] rounded-3xl space-y-4 border border-white/5 animate-in fade-in duration-300">
                    {/* 1. Product Type */}
                    <div className="space-y-2">
                      <label className="text-[8px] font-mono tracking-widest text-slate-500 font-bold uppercase pl-2">1. PRODUCT TYPE</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                        {(["t-shirt", "polo", "cap", "uniform"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setProductType(type)}
                            className={`py-2 rounded-full text-[8px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                              productType === type
                                ? "bg-white border-white text-black font-extrabold"
                                : "bg-[#131415]/60 border-transparent text-slate-400 hover:text-white"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Fabric Grade */}
                    <div className="space-y-2">
                      <label className="text-[8px] font-mono tracking-widest text-slate-500 font-bold uppercase pl-2">2. FABRIC GRADE</label>
                      <div className="grid grid-cols-3 gap-2 font-mono">
                        {(["economy", "premium", "ultra"] as const).map((grade) => (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => setFabricGrade(grade)}
                            className={`py-2 rounded-full text-[8px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                              fabricGrade === grade
                                ? "bg-white border-white text-black font-extrabold"
                                : "bg-[#131415]/60 border-transparent text-slate-400 hover:text-white"
                            }`}
                          >
                            {grade}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Technique */}
                    <div className="space-y-2">
                      <label className="text-[8px] font-mono tracking-widest text-slate-500 font-bold uppercase pl-2">3. DECORATION TECHNIQUE</label>
                      <div className="grid grid-cols-3 gap-2 font-mono">
                        {["silkscreen", "embroidery", "dtg"].map((tech) => {
                          const isSelected = selectedTechniques.includes(tech);
                          return (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => toggleTechnique(tech)}
                              className={`py-2 rounded-full text-[8px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-white border-white text-black font-extrabold"
                                  : "bg-[#131415]/60 border-transparent text-slate-400 hover:text-white"
                              }`}
                            >
                              {tech === "dtg" ? "DTG PRINT" : tech}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Quantity Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-[8px] font-mono tracking-widest text-slate-500 font-bold uppercase">4. PRODUCTION QUANTITY</label>
                        <span className="font-mono text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full border border-white/5">{quantity} PCS</span>
                      </div>
                      <div className="flex items-center gap-4 bg-[#131415]/40 p-3.5 rounded-full border border-white/5">
                        <input
                          type="range"
                          min="10"
                          max="1000"
                          step="10"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="w-full h-1 bg-[#131415] rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>
                    </div>

                    {/* Summary Calculation Plate */}
                    <div className="bg-[#131415] text-white p-5 rounded-2xl border border-white/5 space-y-2 font-mono text-[9px] font-bold uppercase tracking-wider">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>BASE UNIT COST</span>
                        <span>{Math.round(basePrice * fabricMultiplier)} THB</span>
                      </div>
                      {techniqueCostsSum > 0 && (
                        <div className="flex justify-between items-center text-slate-400">
                          <span>DECORATION COST</span>
                          <span>+{techniqueCostsSum} THB</span>
                        </div>
                      )}
                      {discountPct > 0 && (
                        <div className="flex justify-between items-center text-emerald-400">
                          <span>BULK DISCOUNT ({discountPct * 100}%)</span>
                          <span>-{Math.round(rawPricePerPiece * discountPct)} THB</span>
                        </div>
                      )}
                      <hr className="border-white/5" />
                      <div className="flex justify-between items-center text-[10px] text-white">
                        <span>EST. PRICE / PIECE</span>
                        <span className="text-xs text-white font-extrabold">{pricePerPiece.toLocaleString()} THB</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[11px]">
                        <span>TOTAL EST. PROJECT BUDGET</span>
                        <span className="text-sm font-extrabold text-white">{totalPrice.toLocaleString()} THB</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Details message block */}
                <textarea
                  id="message"
                  rows={4}
                  placeholder={activeTab === "estimate" ? "SPECIFY DESIGN DETAILS, COLOR OR LOGO PLACEMENT (OPTIONAL)" : "SPECIFICATION DETAILS / QUANTITY *"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isPending}
                  className="w-full p-6 bg-[#2a2c2e] border-none text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all rounded-3xl text-xs font-mono font-bold tracking-wide uppercase resize-none"
                ></textarea>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-6 rounded-full font-mono text-xs font-bold tracking-widest bg-black text-white hover:bg-[#202123] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer"
              >
                {isPending ? "SENDING INQUIRY..." : (activeTab === "estimate" ? "REQUEST QUOTATION" : "SEND MESSAGE")}
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          )}
        </div>

        {/* Right Section: Big Badge & Info */}
        <div className="w-full md:w-80 flex flex-col justify-between items-center md:items-end text-center md:text-right space-y-8 md:space-y-0">
          {/* Big Circular Phone Button Badge */}
          <div className="bg-[#2d2e30] rounded-full w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shadow-2xl relative group transition-all duration-300 hover:scale-105 border-[6px] border-[#c2c4c6] outline outline-4 outline-[#2d2e30]">
            <Phone className="w-20 h-20 text-white stroke-[1.2] -rotate-12 drop-shadow-[5px_12px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110" />
          </div>

          {/* Social icons */}
          <div className="flex gap-3">
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#2d2e30] rounded-full text-white hover:bg-black transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href="mailto:info@web3.com"
              className="p-3 bg-[#2d2e30] rounded-full text-white hover:bg-black transition-all shadow-md"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="tel:021234567"
              className="p-3 bg-[#2d2e30] rounded-full text-white hover:bg-black transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Address & Details */}
          <div className="space-y-3 text-[#2d2e30] font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-center md:text-right leading-relaxed">
            <p>123 Sukhumvit Rd, Khlong Toei, Bangkok 10110</p>
            <p>Tel: 02-123-4567, 099-999-9999</p>
            <p>Line ID: @web3.0 | Email: info@web3.com</p>
          </div>
        </div>
      </div>

      {/* Google Maps Container */}
      <div className="w-full max-w-5xl mt-10 bg-[#2d2e30] border-[4px] border-[#202225] rounded-[2.5rem] md:rounded-[3.5rem] p-3 h-80 overflow-hidden shadow-2xl relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.792518330762!2d100.5587783!3d13.7297222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f1cf15a31a5%3A0xc45c08cd4455b5ea!2sSukhumvit%20Rd%2C%20Khlong%20Toei%2C%20Bangkok%2010110!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="web3.0 Office Map"
          className="grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500 rounded-[1.8rem] md:rounded-[2.5rem]"
        ></iframe>
      </div>
    </div>
  );
}
