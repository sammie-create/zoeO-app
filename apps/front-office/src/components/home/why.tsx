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
      <ImgReveal className="relative h-[420px] lg:h-auto lg:min-h-[640px]">
        <Image
          src="/img/founder.webp"
          alt="Helen O. Adetunbi, founder of ZoeO Allure"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </ImgReveal>
      <div className="flex flex-col justify-center gap-6 px-6 py-14 sm:px-10 lg:px-16">
        <Reveal as="span" className="block text-sm font-bold tracking-wide text-violet-400 uppercase">
          The heart of ZoeO Allure
        </Reveal>
        <Reveal as="h2" className="font-display block text-3xl font-bold sm:text-4xl lg:text-[48px]">Why ZoeO Allure?</Reveal>
        <Reveal as="p" className="max-w-[560px] text-[17px] leading-[1.7] text-noir-100">
          Founded by Helen O. Adetunbi (Zoe Onirun), ZoeO Allure is rooted in a simple but powerful realization: you
          shouldn&apos;t have to stress about getting your beauty needs met.
        </Reveal>
        <Reveal as="p" className="max-w-[560px] text-[17px] leading-[1.7] text-noir-100">
          We believe that high-quality hair care, personal care, professional extensions, and elite nail systems
          should coexist harmoniously. Everything you need is finally within reach — all in one luxurious, reassuring
          space.
        </Reveal>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {miniValues.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <h5 className="mb-2 flex items-center gap-2 font-bold">
                <Icon name={v.icon} className="size-[18px] text-violet-300" />
                {v.title}
              </h5>
              <p className="text-[14px] text-noir-300">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
