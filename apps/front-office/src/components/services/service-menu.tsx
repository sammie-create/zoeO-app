import { Icon, isIconName } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { Reveal } from "@/components/shared/reveal";
import type { Service } from "@/lib/queries";

function durationLabel(mins: number) {
  return mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}min` : ""}` : `${mins} min`;
}

export function ServiceMenu({ services }: { services: Service[] }) {
  return (
    <div id="menu" className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <Reveal key={s.id} delay={(i % 3) * 90} className="flex flex-col gap-3 bg-noir-900 p-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-noir-800">
            {s.image_url && (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
              <img src={s.image_url} alt={s.name} className="size-full object-cover" style={{ objectPosition: s.object_position }} />
            )}
            <span className="absolute top-3 left-3 grid size-9 place-items-center rounded-full bg-noir-900/70 text-violet-300">
              <Icon name={isIconName(s.icon) ? s.icon : "sparkle"} className="size-4" />
            </span>
          </div>
          <span className="text-[12px] font-semibold text-noir-400 uppercase">
            {String(i + 1).padStart(2, "0")} — {s.category}
          </span>
          <h3 className="font-display text-xl font-bold">{s.name}</h3>
          {s.description && <p className="text-[14px] text-noir-300">{s.description}</p>}
          <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-3">
            <div>
              <strong className="text-lg">
                <MoneyLabel ngn={s.price} />
              </strong>
              <span className="ml-1.5 text-[12px] text-noir-400">from · {durationLabel(s.duration_mins)}</span>
            </div>
            <a href="#book" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-300">
              Book <Icon name="arrow" className="size-4" />
            </a>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
