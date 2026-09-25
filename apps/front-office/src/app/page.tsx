import { Bestsellers } from "@/components/home/bestsellers";
import { Categories } from "@/components/home/categories";
import { Community } from "@/components/home/community";
import { Follow } from "@/components/home/follow";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Pillars } from "@/components/home/pillars";
import { ServicesTeaser } from "@/components/home/services-teaser";
import { Testimonials } from "@/components/home/testimonials";
import { Transformation } from "@/components/home/transformation";
import { Why } from "@/components/home/why";
import { getBestsellers, getTestimonials } from "@/lib/queries";

export default async function Home() {
  const [bestsellers, testimonials] = await Promise.all([getBestsellers(4), getTestimonials()]);

  return (
    <div className="flex flex-col bg-noir-900">
      <Hero />
      <Categories />
      <Pillars />
      <Why />
      <Transformation />
      <Bestsellers products={bestsellers} />
      <ServicesTeaser />
      <Testimonials testimonials={testimonials} />
      <Community />
      <Marquee />
      <Follow />
    </div>
  );
}
