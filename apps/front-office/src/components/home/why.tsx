import Image from "next/image";
import { Icon } from "@/components/shared/icon";
import { ImgReveal, Reveal } from "@/components/shared/reveal";

const miniValues = [
  { icon: "sparkles" as const, title: "Excellence", text: "Rigorous high standards in every formula and weave." },
  { icon: "award" as const, title: "Quality", text: "Sourcing premium ingredients and top-tier custom units." },
  { icon: "shieldCheck" as const, title: "Authenticity", text: "Honest promises, transparent booking, real results." },
];

export function Why() {
  return (
    <section className="grid grid-cols-1 bg-[#2e3336] lg:grid-cols-[1fr_1.05fr]">
      <ImgReveal className="relative h-[520px] lg:h-auto lg:min-h-[640px]">
        <Image
          src="/img/founder.webp"
          alt="Helen O. Adetunbi, founder of ZoeO Allure"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: "30% 20%" }}
        />
      </ImgReveal>
      <div className="flex flex-col justify-center pt-[clamp(48px,5vw,80px)] pr-[clamp(24px,6vw,100px)] pb-[clamp(48px,5vw,80px)] pl-[clamp(24px,4.5vw,70px)]">
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
        <Reveal as="p" className="mb-[26px] max-w-[560px] text-[17px] leading-[1.7] text-white">
          Founded by Helen O. Adetunbi (Zoe Onirun), ZoeO Allure is rooted in a simple but powerful realization: you
          shouldn&apos;t have to stress about getting your beauty needs met.
        </Reveal>
        <Reveal as="p" className="mb-[26px] max-w-[560px] text-[17px] leading-[1.7] text-white">
          We believe that high-quality hair care, personal care, professional extensions, and elite nail systems
          should coexist harmoniously. Everything you need is finally within reach — all in one luxurious, reassuring
          space.
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {miniValues.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <h5 className="mb-2 flex items-center gap-2.5 text-[17px] font-bold text-white">
                <Icon name={v.icon} className="size-[22px] text-violet-300" />
                {v.title}
              </h5>
              <p className="text-[14px] leading-[1.5] text-noir-300">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
