import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { Reveal } from "@/components/shared/reveal";
import type { Service } from "@/lib/queries";

function durationLabel(mins: number) {
  return mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}min` : ""}` : `${mins} min`;
}

export function ServiceMenu({ services }: { services: Service[] }) {
  return (
    <div id="menu" className="ed-grid">
      {services.map((s, i) => (
        <Reveal key={s.id} delay={(i % 3) * 90} as="article" className="ed-cell">
          <figure>
            {s.image_url && (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
              <img src={s.image_url} alt={s.name} style={{ objectPosition: s.object_position }} />
            )}
          </figure>
          <span className="ed-cell__num">
            {String(i + 1).padStart(2, "0")} — {s.category}
          </span>
          <h3>{s.name}</h3>
          {s.description && <p>{s.description}</p>}
          <div className="ed-cell__meta">
            <div>
              <strong>
                <MoneyLabel ngn={s.price} />
              </strong>
              <small>from · {durationLabel(s.duration_mins)}</small>
            </div>
            <Link href={`/services?service=${s.id}#book`} className="ed-link">
              Book <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
