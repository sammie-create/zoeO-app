import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { excerpt, formatDate, readingMinutes } from "@/lib/blog";
import { getPosts } from "@/lib/queries";

export const metadata = { title: "The Allure Journal — ZoeO Allure" };

export default async function BlogPage() {
  const posts = await getPosts();
  const [first, ...rest] = posts;

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
        The Allure Journal
      </Reveal>
      <Reveal as="h1" className="font-display mt-3 mb-12 block text-4xl font-bold sm:text-5xl">Notes on beauty, made easier</Reveal>

      {!first && <p className="text-noir-400">No posts published yet.</p>}

      {first && (
        <Reveal>
          <Link
            href={`/blog/${first.id}`}
            className="mb-12 grid grid-cols-1 gap-6 rounded-2xl bg-white/5 p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10 lg:p-12"
          >
            <div>
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-[12px] font-bold text-violet-300">
                {first.category}
              </span>
              <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">{first.title}</h2>
              <p className="mt-4 text-noir-300">{excerpt(first.body, 220)}</p>
              <span className="mt-4 block text-[13px] text-noir-500">
                {formatDate(first.published_at)} · {readingMinutes(first.body)} min read
              </span>
              <span className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white pr-1.5 pl-5 text-sm font-bold text-noir-900">
                Read story
                <span className="grid size-8 place-items-center rounded-full bg-violet-800 text-white">
                  <Icon name="arrow" className="size-4" />
                </span>
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <Link href={`/blog/${p.id}`} className="block rounded-2xl bg-white/5 p-6">
              <span className="text-[13px] text-noir-400">
                {p.category} · {readingMinutes(p.body)} min read
              </span>
              <h3 className="font-display mt-2 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-[14px] text-noir-300">{excerpt(p.body)}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
