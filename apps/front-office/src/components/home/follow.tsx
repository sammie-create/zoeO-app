import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

export function Follow() {
  return (
    <section className="bg-[#2a1245] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-8">
        <div>
          <Reveal as="h2" className="font-display block text-3xl font-bold sm:text-4xl">Follow us on Instagram</Reveal>
          <Reveal as="p" className="mt-2 text-white/80">
            Forward to seeing you on our social networks
          </Reveal>
        </div>
        <Reveal className="flex gap-3">
          <a
            href="https://instagram.com/zoeoallure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold text-white uppercase hover:bg-white/8"
          >
            <Icon name="instagram" className="size-[18px]" /> Instagram
          </a>
          <a
            href="https://tiktok.com/@zoeoallure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold text-white uppercase hover:bg-white/8"
          >
            <Icon name="tiktok" className="size-[18px]" /> TikTok
          </a>
        </Reveal>
      </div>
    </section>
  );
}
