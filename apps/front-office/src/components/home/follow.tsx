import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

export function Follow() {
  return (
    <section className="bg-[#2a1245] px-4 py-[clamp(56px,7vw,100px)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-8">
        <div>
          <Reveal as="h2" className="font-display block text-[clamp(34px,4.6vw,60px)] leading-[1.08] font-bold">
            Follow us <em className="text-violet-300 font-normal italic">on Instagram</em>
          </Reveal>
          <Reveal as="p" className="mt-2.5 text-noir-400">
            Forward to seeing you on our social networks
          </Reveal>
        </div>
        <Reveal className="flex gap-3.5 max-[760px]:w-full">
          <a
            href="https://instagram.com/zoeoallure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[54px] items-center gap-2.5 rounded-full border-[1.5px] border-violet-400 px-6 text-[15px] font-bold text-white uppercase transition-[background-color,transform] duration-150 ease-[var(--ease)] hover:-translate-y-[3px] hover:bg-violet-500 max-[760px]:flex-1 max-[760px]:justify-center"
          >
            <Icon name="instagram" className="size-[18px]" /> Instagram
          </a>
          <a
            href="https://tiktok.com/@zoeoallure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[54px] items-center gap-2.5 rounded-full border-[1.5px] border-violet-400 px-6 text-[15px] font-bold text-white uppercase transition-[background-color,transform] duration-150 ease-[var(--ease)] hover:-translate-y-[3px] hover:bg-violet-500 max-[760px]:flex-1 max-[760px]:justify-center"
          >
            <Icon name="tiktok" className="size-[18px]" /> TikTok
          </a>
        </Reveal>
      </div>
    </section>
  );
}
