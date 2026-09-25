import { Icon } from "@/components/shared/icon";

const words = ["Bridal artistry", "Hair care", "Personal care", "Nail care", "Hair extensions", "Lash extensions", "Gele styling"];

export function Marquee() {
  const doubled = [...words, ...words];

  return (
    <div className="overflow-hidden border-y border-white/8 bg-[#0b0a0f]" aria-hidden>
      <div className="flex w-max animate-[marquee_38s_linear_infinite] hover:[animation-play-state:paused]">
        {doubled.map((w, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-11 px-[22px] py-[26px] text-[clamp(18px,1.6vw,22px)] font-medium whitespace-nowrap text-white"
          >
            {w}
            <Icon name="star" className="size-[18px] text-violet-400" />
          </span>
        ))}
      </div>
    </div>
  );
}
