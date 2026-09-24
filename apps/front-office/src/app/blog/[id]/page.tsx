import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { formatDate, readingMinutes } from "@/lib/blog";
import { getPost } from "@/lib/queries";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm text-noir-400 hover:text-white">
        ← Back to journal
      </Link>
      <span className="rounded-full bg-violet-500/15 px-3 py-1 text-[12px] font-bold text-violet-300">{post.category}</span>
      <h1 className="font-display mt-4 mb-3 text-3xl font-bold sm:text-4xl">{post.title}</h1>
      <p className="mb-10 text-[13px] text-noir-500">
        {formatDate(post.published_at)} · {readingMinutes(post.body)} min read
      </p>
      <div className="flex flex-col gap-5 text-[17px] leading-[1.75] text-noir-100">
        {post.body.split(/\n{2,}/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap gap-3 border-t border-white/8 pt-8">
        <Link href="/services#book" className="inline-flex h-12 items-center rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase">
          Book a service
        </Link>
        <Link href="/shop" className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-bold uppercase">
          <Icon name="bag" className="mr-2 size-4" /> Shop products
        </Link>
      </div>
    </main>
  );
}
