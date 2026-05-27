"use client";

/**
 * @file ContactForm.tsx
 * @path src/presentation/components/shared/ContactForm.tsx
 * @description แบบฟอร์มการติดต่อผู้ใช้ทั่วไป พร้อมแถบโปรแกรมคำนวณประเมินราคาเสื้อยืด/เสื้อโปโลแบบโต้ตอบ คำนวณส่วนลดตามจำนวนทันที
 */


import React, { useState, useTransition, useEffect } from "react";
import { Mail, Phone, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { createContactAction, getFormTokenAction } from "@/presentation/actions/contact.actions";
import { translations } from "@/shared/i18n/translations";

interface ContactFormProps {
  lang: "th" | "en";
}

export default function ContactForm({ lang }: ContactFormProps) {
  const t = translations[lang];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Anti-Spam Security States
  const [formToken, setFormToken] = useState("");
  const [phoneSecondary, setPhoneSecondary] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getFormTokenAction();
        setFormToken(token);
      } catch (err) {
        console.error("Failed to fetch form security token:", err);
      }
    };
    fetchToken();
  }, [success]);

  // Price Estimator State
  const [activeTab, setActiveTab] = useState<"general" | "estimate">("general");
  const [productType, setProductType] = useState<"t-shirt" | "polo" | "cap" | "uniform">("t-shirt");
  const [fabricGrade, setFabricGrade] = useState<"economy" | "premium" | "ultra">("premium");
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>(["silkscreen"]);
  const [quantity, setQuantity] = useState<number>(100);

  const getProductLabel = (type: string) => {
    switch (type) {
      case "t-shirt": return lang === "th" ? "เสื้อยืด (T-Shirt)" : "T-Shirt";
      case "polo": return lang === "th" ? "เสื้อโปโล (Polo Shirt)" : "Polo Shirt";
      case "cap": return lang === "th" ? "หมวก (Cap)" : "Cap";
      case "uniform": return lang === "th" ? "ชุดยูนิฟอร์ม (Uniform)" : "Uniform";
      default: return "";
    }
  };

  const getFabricLabel = (grade: string) => {
    switch (grade) {
      case "economy": return lang === "th" ? "ประหยัด (Economy)" : "Economy";
      case "premium": return lang === "th" ? "มาตรฐานยอดนิยม (Premium)" : "Premium";
      case "ultra": return lang === "th" ? "พรีเมียมหนานุ่ม (Ultra-Premium)" : "Ultra-Premium";
      default: return "";
    }
  };

  const getTechniqueLabel = (tech: string) => {
    switch (tech) {
      case "silkscreen": return lang === "th" ? "สกรีนกึ่งยาง (Silkscreen)" : "Silkscreen";
      case "embroidery": return lang === "th" ? "งานปักคอมพิวเตอร์ (Embroidery)" : "Embroidery";
      case "dtg": return lang === "th" ? "พิมพ์ดิจิทัล (DTG)" : "DTG Print";
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
TECHNIQUES: ${selectedTechniques.map(getTechniqueLabel).join(", ") || "ไม่มีการสกรีน/ปัก / None"}
QUANTITY: ${quantity} pcs
ESTIMATED PRICE/UNIT: ${pricePerPiece.toLocaleString()} THB ${discountPct > 0 ? `(${discountPct * 100}% Discount applied)` : ""}
ESTIMATED TOTAL: ${totalPrice.toLocaleString()} THB
ADDITIONAL DETAILS:
${message || "ไม่มีรายละเอียดเพิ่มเติม / No details"}`
      : message;

    if (!name || !finalMessage) {
      setError(lang === "th" ? "กรุณากรอกชื่อผู้ติดต่อและรายละเอียดที่สนใจ" : "Please enter your name and message details.");
      return;
    }

    if (!phone && !email) {
      setError(lang === "th" ? "กรุณากรอกเบอร์โทรศัพท์หรืออีเมลช่องทางใดช่องทางหนึ่ง เพื่อการติดต่อกลับ" : "Please provide either a phone number or email address for callback.");
      return;
    }

    if (phone) {
      if (phone.length > 50) {
        setError(lang === "th" ? "เบอร์โทรศัพท์ต้องมีความยาวไม่เกิน 50 ตัวอักษร" : "Phone number must be under 50 characters.");
        return;
      }
      const phoneRegex = /^[0-9+\-\s()]*(\s*(ext|ext\.|ต่อ)\s*[0-9]+)?$/i;
      if (!phoneRegex.test(phone)) {
        setError(lang === "th" ? "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข และรองรับเบอร์ส่วนบุคคล/บริษัท/ต่างประเทศ)" : "Invalid phone format (supports standard numbers and extensions).");
        return;
      }
    }

    startTransition(async () => {
      const result = await createContactAction({
        name,
        phone: phone || null,
        email: email || null,
        message: finalMessage,
        phone_secondary: phoneSecondary,
        formToken,
      });

      if (!result.success) {
        setError(result.error || (lang === "th" ? "เกิดข้อผิดพลาดในการบันทึกข้อมูล" : "Error saving information."));
      } else {
        setSuccess(true);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setPhoneSecondary("");
      }
    });
  };

  return (
    <div className="w-full max-w-5xl bg-theme-inverted-bg text-theme-inverted-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 border-[4px] border-theme-inverted-border shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-stretch animate-in fade-in duration-500">
      
      {/* Left Section: Contact Form */}
      <div className="flex-1 flex flex-col justify-between space-y-8">
        <div>
          <h1 className="font-teko text-6xl md:text-8xl font-bold uppercase tracking-wide leading-none text-theme-inverted-text">
            {t.contactTitle}
          </h1>
          <p className="font-mono text-xs text-theme-inverted-text/80 tracking-widest uppercase mt-1">
            {activeTab === "estimate" ? (lang === "th" ? "เครื่องคำนวณราคา" : "estimate tool") : (lang === "th" ? "ฟอร์มส่งข้อความ" : "drop a message")}
          </p>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 bg-theme-bg text-theme-card-text rounded-3xl p-8 border border-theme-card-border shadow-inner animate-in zoom-in-95 duration-300">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold font-mono tracking-widest uppercase">{t.contactSuccess}</h3>
            <p className="text-[11px] text-theme-card-subtext font-light max-w-xs leading-relaxed">
              {t.contactSuccessDesc}
            </p>
            <Button onClick={() => setSuccess(false)} className="rounded-full border border-theme-card-border bg-theme-card-bg hover:bg-theme-bg text-theme-card-text font-mono tracking-widest text-[10px] uppercase py-4 px-6 mt-4 cursor-pointer">
              {t.contactSuccessBtn}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-xs font-semibold text-rose-400 bg-theme-bg border border-rose-500/30 rounded-2xl font-mono">
                {t.contactError}{error.toUpperCase()}
              </div>
            )}

            {/* Tab Toggles */}
            <div className="flex gap-1.5 p-1 bg-theme-bg/60 rounded-full w-full max-w-xs font-mono border border-theme-card-border/30">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                  activeTab === "general"
                    ? "bg-theme-inverted-bg text-theme-inverted-text font-extrabold"
                    : "text-theme-inverted-text/60 hover:text-theme-inverted-text"
                }`}
              >
                {t.contactMsgTab}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("estimate")}
                className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                  activeTab === "estimate"
                    ? "bg-theme-inverted-bg text-theme-inverted-text font-extrabold"
                    : "text-theme-inverted-text/60 hover:text-theme-inverted-text"
                }`}
              >
                {t.contactEstTab}
              </button>
            </div>

            <div className="space-y-4">
              {/* Standard Inputs */}
              <div className="space-y-3">
                {/* Honeypot field (hidden from humans, filled by bots) */}
                <input
                  id="phone_secondary"
                  type="text"
                  name="phone_secondary"
                  value={phoneSecondary}
                  onChange={(e) => setPhoneSecondary(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 -z-10 w-0 h-0 pointer-events-none"
                  aria-hidden="true"
                />

                <Input
                  id="name"
                  type="text"
                  placeholder={t.contactPlaceholderName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  className="bg-theme-card-bg border border-theme-card-border text-theme-card-text placeholder-theme-card-subtext/70 focus-visible:ring-2 focus-visible:ring-theme-card-text focus-visible:ring-offset-2 transition-all rounded-full text-xs py-6 px-6 font-mono font-bold tracking-wide uppercase"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.contactPlaceholderPhone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isPending}
                    className="bg-theme-card-bg border border-theme-card-border text-theme-card-text placeholder-theme-card-subtext/70 focus-visible:ring-2 focus-visible:ring-theme-card-text focus-visible:ring-offset-2 transition-all rounded-full text-xs py-6 px-6 font-mono font-bold tracking-wide uppercase"
                  />

                  <Input
                    id="email"
                    type="email"
                    placeholder={t.contactPlaceholderEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    className="bg-theme-card-bg border border-theme-card-border text-theme-card-text placeholder-theme-card-subtext/70 focus-visible:ring-2 focus-visible:ring-theme-card-text focus-visible:ring-offset-2 transition-all rounded-full text-xs py-6 px-6 font-mono font-bold tracking-wide uppercase"
                  />
                </div>
              </div>

              {/* Price Estimator Details (Show only when estimator tab is active) */}
              {activeTab === "estimate" && (
                <div className="p-5 bg-theme-card-bg rounded-3xl space-y-4 border border-theme-card-border animate-in fade-in duration-300">
                  {/* 1. Product Type */}
                  <div className="space-y-2">
                    <label className="text-[8px] font-mono tracking-widest text-theme-card-subtext font-bold uppercase pl-2">{t.estProdType}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                      {(["t-shirt", "polo", "cap", "uniform"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProductType(type)}
                          className={`py-2 rounded-full text-[8px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                            productType === type
                              ? "bg-theme-inverted-bg border-theme-inverted-bg text-theme-inverted-text font-extrabold"
                              : "bg-theme-bg/60 border-transparent text-theme-card-subtext hover:text-theme-card-text"
                          }`}
                        >
                          {type === "t-shirt" ? t.estTshirt : type === "polo" ? t.estPolo : type === "cap" ? t.estCap : t.estUniform}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Fabric Grade */}
                  <div className="space-y-2">
                    <label className="text-[8px] font-mono tracking-widest text-theme-card-subtext font-bold uppercase pl-2">{t.estFabricGrade}</label>
                    <div className="grid grid-cols-3 gap-2 font-mono">
                      {(["economy", "premium", "ultra"] as const).map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setFabricGrade(grade)}
                          className={`py-2 rounded-full text-[8px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                            fabricGrade === grade
                              ? "bg-theme-inverted-bg border-theme-inverted-bg text-theme-inverted-text font-extrabold"
                              : "bg-theme-bg/60 border-transparent text-theme-card-subtext hover:text-theme-card-text"
                          }`}
                        >
                          {grade === "economy" ? (lang === "th" ? "ประหยัด" : "Economy") : grade === "premium" ? (lang === "th" ? "มาตรฐาน" : "Premium") : (lang === "th" ? "พิเศษ" : "Ultra")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Technique */}
                  <div className="space-y-2">
                    <label className="text-[8px] font-mono tracking-widest text-theme-card-subtext font-bold uppercase pl-2">{t.estDecoration}</label>
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
                                ? "bg-theme-inverted-bg border-theme-inverted-bg text-theme-inverted-text font-extrabold"
                                : "bg-theme-bg/60 border-transparent text-theme-card-subtext hover:text-theme-card-text"
                            }`}
                          >
                            {tech === "dtg" ? "DTG PRINT" : tech === "silkscreen" ? (lang === "th" ? "สกรีน" : "SCREEN") : (lang === "th" ? "งานปัก" : "EMBROIDERY")}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Quantity Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[8px] font-mono tracking-widest text-theme-card-subtext font-bold uppercase">{t.estQuantity}</label>
                      <span className="font-mono text-xs font-bold text-theme-card-text bg-theme-bg/60 px-3 py-1 rounded-full border border-theme-card-border">{quantity} PCS</span>
                    </div>
                    <div className="flex items-center gap-4 bg-theme-bg/40 p-3.5 rounded-full border border-theme-card-border">
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full h-1 bg-theme-bg rounded-lg appearance-none cursor-pointer accent-theme-card-text"
                      />
                    </div>
                  </div>

                  {/* Summary Calculation Plate */}
                  <div className="bg-theme-bg text-theme-card-text p-5 rounded-2xl border border-theme-card-border space-y-2 font-mono text-[9px] font-bold uppercase tracking-wider">
                    <div className="flex justify-between items-center text-theme-card-subtext">
                      <span>{t.estUnitCost}</span>
                      <span>{Math.round(basePrice * fabricMultiplier)} THB</span>
                    </div>
                    {techniqueCostsSum > 0 && (
                      <div className="flex justify-between items-center text-theme-card-subtext">
                        <span>{t.estDecoCost}</span>
                        <span>+{techniqueCostsSum} THB</span>
                      </div>
                    )}
                    {discountPct > 0 && (
                      <div className="flex justify-between items-center text-emerald-500">
                        <span>{t.estDiscount.replace("{pct}", (discountPct * 100).toString())}</span>
                        <span>-{Math.round(rawPricePerPiece * discountPct)} THB</span>
                      </div>
                    )}
                    <hr className="border-theme-card-border" />
                    <div className="flex justify-between items-center text-[10px] text-theme-card-text">
                      <span>{t.estPricePiece}</span>
                      <span className="text-xs text-theme-card-text font-extrabold">{pricePerPiece.toLocaleString()} THB</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-theme-card-border pt-2 text-[11px]">
                      <span>{t.estTotalBudget}</span>
                      <span className="text-sm font-extrabold text-theme-card-text">{totalPrice.toLocaleString()} THB</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Details message block */}
              <textarea
                id="message"
                rows={4}
                placeholder={activeTab === "estimate" ? t.contactPlaceholderMsgEstimate : t.contactPlaceholderMsgGeneral}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isPending}
                className="w-full p-6 bg-theme-card-bg border border-theme-card-border text-theme-card-text placeholder-theme-card-subtext/70 focus:outline-none focus:ring-2 focus:ring-theme-card-text focus:ring-offset-2 transition-all rounded-3xl text-xs font-mono font-bold tracking-wide uppercase resize-none"
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-6 rounded-full font-mono text-xs font-bold tracking-widest bg-transparent text-theme-inverted-text border-2 border-theme-inverted-text hover:bg-theme-inverted-text hover:text-theme-inverted-bg transition-all flex items-center justify-center gap-2 uppercase cursor-pointer disabled:opacity-50"
            >
              {isPending ? t.contactSending : (activeTab === "estimate" ? t.contactBtnEstimate : t.contactBtnGeneral)}
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        )}
      </div>

      {/* Right Section: Big Badge & Info */}
      <div className="w-full md:w-80 flex flex-col justify-center items-center text-center space-y-8">
        {/* Big Circular Phone Button Badge */}
        <div className="bg-theme-card-bg rounded-full w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shadow-2xl relative group transition-all duration-300 hover:scale-105 border-[6px] border-theme-inverted-bg outline outline-4 outline-theme-card-bg">
          <Phone className="w-20 h-20 text-theme-card-text stroke-[1.2] -rotate-12 drop-shadow-[5px_12px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Social icons */}
        <div className="flex gap-3">
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-theme-card-bg rounded-full text-theme-card-text hover:bg-theme-button-primary-bg hover:text-theme-button-primary-text border border-theme-card-border transition-all shadow-md"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M8 0c4.411 0 8 2.912 8 6.492 0 1.433-.555 2.723-1.715 3.994-1.678 1.932-5.431 4.285-6.285 4.645-.83.35-.734-.197-.696-.413l.003-.018.114-.685c.027-.204.055-.521-.026-.723-.09-.223-.444-.339-.704-.395C2.846 12.39 0 9.701 0 6.492 0 2.912 3.59 0 8 0M5.022 7.686H3.497V4.918a.156.156 0 0 0-.155-.156H2.78a.156.156 0 0 0-.156.156v3.486c0 .041.017.08.044.107v.001l.002.002.002.002a.15.15 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157m.791-2.924a.156.156 0 0 0-.156.156v3.486c0 .086.07.155.156.155h.562c.086 0 .155-.07.155-.155V4.918a.156.156 0 0 0-.155-.156zm3.863 0a.156.156 0 0 0-.156.156v2.07L7.923 4.832l-.013-.015v-.001l-.01-.01-.003-.003-.011-.009h-.001L7.88 4.79l-.003-.002-.005-.003-.008-.005h-.002l-.003-.002-.01-.004-.004-.002-.01-.003h-.002l-.003-.001-.009-.002h-.006l-.003-.001h-.004l-.002-.001h-.574a.156.156 0 0 0-.156.155v3.486c0 .086.07.155.156.155h.56c.087 0 .157-.07.157-.155v-2.07l1.6 2.16a.2.2 0 0 0 .039.038l.001.001.01.006.004.002.008.004.007.003.005.002.01.003h.003a.2.2 0 0 0 .04.006h.56c.087 0 .157-.07.157-.155V4.918a.156.156 0 0 0-.156-.156zm3.815.717v-.56a.156.156 0 0 0-.155-.157h-2.242a.16.16 0 0 0-.108.044h-.001l-.001.002-.002.003a.16.16 0 0 0-.044.107v3.486c0 .041.017.08.044.107l.002.003.002.002a.16.16 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156Z"/>
            </svg>
          </a>
          <a
            href="mailto:info@web3.com"
            className="p-3 bg-theme-card-bg rounded-full text-theme-card-text hover:bg-theme-button-primary-bg hover:text-theme-button-primary-text border border-theme-card-border transition-all shadow-md"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="tel:021234567"
            className="p-3 bg-theme-card-bg rounded-full text-theme-card-text hover:bg-theme-button-primary-bg hover:text-theme-button-primary-text border border-theme-card-border transition-all shadow-md"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Address & Details */}
        <div className="space-y-3 text-theme-inverted-text/80 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-center leading-relaxed">
          <p>
            {lang === "th" 
              ? "123 ถนนสุขุมวิท, คลองเตย, กรุงเทพมหานคร 10110" 
              : "123 Sukhumvit Rd, Khlong Toei, Bangkok 10110"}
          </p>
          <p>Tel: 02-123-4567, 099-999-9999</p>
          <p>Line ID: @web3.0 | Email: info@web3.com</p>
        </div>
      </div>
    </div>
  );
}
