import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { Reveal } from "@/components/shared/reveal";
import type { Service } from "@/lib/queries";

export function ServicesTeaser({ services }: { services: Service[] }) {
  return (
    <section className="bg-noir-800/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto mb-16 max-w-[640px] text-center">
          <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
            Premium in-salon experience
          </Reveal>
          <Reveal as="h2" className="font-display mt-3.5 block text-3xl font-bold sm:text-4xl lg:text-[44px]">Beauty Services</Reveal>
          <Reveal as="p" className="mt-3.5 text-[17px] text-white">
            Beyond our exceptional products, sit back and let our master artists pamper you.
          </Reveal>
        </div>

        <div className="flex flex-col gap-5">
          {services.slice(0, 4).map((s, i) => {
            const right = i % 2 === 1;
            return (
              <Reveal key={s.id}>
                <Link
                  href={`/services?service=${s.id}#book`}
                  className={`group relative flex min-h-[300px] items-center overflow-hidden rounded-2xl p-8 sm:p-16 ${right ? "justify-end text-right" : "justify-start"}`}
                >
                  {s.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                    <img src={s.image_url} alt="" className="absolute inset-0 size-full object-cover" />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: right
                        ? "linear-gradient(270deg, rgba(0,0,0,.74) 14%, rgba(0,0,0,0) 68%)"
                        : "linear-gradient(90deg, rgba(0,0,0,.74) 14%, rgba(0,0,0,0) 68%)",
                    }}
                  />
                  <div className={`relative flex max-w-[520px] flex-col gap-4 ${right ? "items-end" : "items-start"}`}>
                    <h3 className="font-display text-2xl font-extrabold text-white sm:text-[28px]">{s.name}</h3>
                    <p className="text-white/90">{s.description}</p>
                    <span className="inline-flex h-11 items-center gap-2 rounded-full bg-white pr-1.5 pl-5 text-sm font-bold text-noir-900">
                      Book · <MoneyLabel ngn={s.price} />
                      <span className="grid size-8 place-items-center rounded-full bg-violet-800 text-white">
                        <Icon name="arrow" className="size-4" />
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
