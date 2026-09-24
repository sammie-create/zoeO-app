import { Icon } from "@/components/shared/icon";

const words = ["Bridal artistry", "Hair care", "Personal care", "Nail care", "Hair extensions", "Lash extensions", "Gele styling"];

export function Marquee() {
  const doubled = [...words, ...words];

  return (
    <div className="overflow-hidden bg-[#0b0a0f] py-6" aria-hidden>
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 hover:[animation-play-state:paused]">
        {doubled.map((w, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10 text-lg font-medium whitespace-nowrap text-white">
            {w}
            <Icon name="star" className="size-3" />
          </span>
        ))}
      </div>
    </div>
  );
}
