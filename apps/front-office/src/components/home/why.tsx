import { Icon } from "@/components/shared/icon";
import { ImgReveal, Reveal } from "@/components/shared/reveal";

const miniValues = [
  { icon: "sparkles" as const, title: "Excellence", text: "Rigorous high standards in every formula and weave." },
  { icon: "award" as const, title: "Quality", text: "Sourcing premium ingredients and top-tier custom units." },
  { icon: "shieldCheck" as const, title: "Authenticity", text: "Honest promises, transparent booking, real results." },
];

export function Why() {
  return (
    <section className="relative overflow-hidden bg-[#1a1a1a]">
      <ImgReveal className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- raw static asset, bypassing the image optimizer */}
        <img
          src="/img/why-brand-story.webp"
          alt="Moody studio portrait of the ZoeO Allure founder, seated against a dark backdrop"
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: "0% 35%" }}
        />
      </ImgReveal>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(14,14,16,.1) 0%, rgba(14,14,16,.55) 45%, rgba(14,14,16,.92) 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
        <div className="ml-auto flex min-h-[640px] max-w-[520px] flex-col justify-center py-[clamp(64px,8vw,100px)] lg:min-h-[720px]">
          <Reveal as="span" className="mb-[18px] inline-flex items-center gap-2 text-[13px] font-bold tracking-[.02em] text-violet-400 uppercase">
            <span className="size-1.5 rounded-full bg-current" />
            The heart of ZoeO Allure
          </Reveal>
          <Reveal
            as="h2"
            className="font-display mt-[18px] mb-9 block text-[clamp(34px,4.6vw,60px)] leading-[1.08] font-bold text-white"
          >
            Why ZoeO <em className="text-white font-normal italic">Allure</em>?
          </Reveal>
          <Reveal as="p" className="mb-[26px] text-[17px] leading-[1.7] text-white">
            ZoeO Allure was born from a simple realization: having access to beauty services isn’t the same as having a beauty experience you can trust. We believe beauty deserves to be approached with intention. It is more than appearance; it is creativity, care, expression, and the little details that can make someone feel special, confident, and beautifully themselves.
          </Reveal>
          <Reveal as="p" className="mb-[26px] text-[17px] leading-[1.7] text-white">
            Founded by Helen O. Adetunbi, ZoeO Allure brings professional beauty services, products, education, and experiences together under one brand — thoughtfully created, carefully curated, and guided by a commitment to excellence.
          </Reveal>
          <Reveal as="p" className="mb-[26px] text-[17px] leading-[1.7] text-white">
            We are building a beauty brand where every part is designed to work together, with care, creativity, and purpose.
          </Reveal>
          {/*<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">*/}
          {/*  {miniValues.map((v, i) => (*/}
          {/*    <Reveal key={v.title} delay={i * 100}>*/}
          {/*      <h5 className="mb-2 flex items-center gap-2.5 text-[17px] font-bold text-white">*/}
          {/*        <Icon name={v.icon} className="size-[22px] text-violet-300" />*/}
          {/*        {v.title}*/}
          {/*      </h5>*/}
          {/*      <p className="text-[14px] leading-[1.5] text-noir-300">{v.text}</p>*/}
          {/*    </Reveal>*/}
          {/*  ))}*/}
          {/*</div>*/}
        </div>
      </div>
    </section>
  );
}
