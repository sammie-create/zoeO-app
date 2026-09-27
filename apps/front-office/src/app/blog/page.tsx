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
    <main className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <Reveal as="span" className="block text-[13px] font-bold tracking-[.02em] text-violet-400 uppercase">
          The Allure Journal
        </Reveal>
        <Reveal as="h1" className="display mb-12 block" style={{ margin: "14px 0 48px" }}>
          Notes on beauty, <em className="text-violet-300 italic">made easier</em>
        </Reveal>

        {!first && <p className="text-noir-400">No posts published yet.</p>}

        {first && (
          <Reveal as="article" className="blog-feature">
            <Link href={`/blog/${first.id}`} className="contents" tabIndex={-1}>
              <figure>
                {first.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                  <img src={first.image_url} alt="" />
                ) : (
                  <div className="size-full bg-noir-700" />
                )}
              </figure>
              <div className="blog-feature__body">
                <span className="chip chip--outline">{first.category}</span>
                <h2 className="h2">{first.title}</h2>
                <p>{excerpt(first.body, 220)}</p>
                <span className="meta">
                  {formatDate(first.published_at)} · {readingMinutes(first.body)} min read
                </span>
                <span className="btn-pill btn-pill--sm" style={{ marginTop: 24 }}>
                  Read story
                  <span className="arrow">
                    <Icon name="arrow" className="size-4" />
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="blog-grid">
          {rest.map((p, i) => (
            <Reveal key={p.id} as="article" delay={i * 90} className="post">
              <Link href={`/blog/${p.id}`} className="block">
                <figure>
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                    <img src={p.image_url} alt="" />
                  ) : (
                    <div className="size-full bg-noir-700" />
                  )}
                </figure>
                <span className="meta">
                  {p.category} · {readingMinutes(p.body)} min read
                </span>
                <h3>{p.title}</h3>
                <p>{excerpt(p.body)}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
