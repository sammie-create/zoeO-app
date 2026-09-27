import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { formatDate, readingMinutes } from "@/lib/blog";
import { getPost } from "@/lib/queries";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const bodyHtml = DOMPurify.sanitize(post.body, {
    ALLOWED_TAGS: ["p", "h2", "h3", "ul", "ol", "li", "blockquote", "strong", "em", "s", "a", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="mx-auto mb-10 flex max-w-[760px] items-center gap-1.5 text-sm text-noir-400 no-underline hover:text-white"
      >
        ← Back to journal
      </Link>
      <article className="article mx-auto max-w-[760px]">
        <span className="meta">
          {post.category} · {formatDate(post.published_at)} · {readingMinutes(post.body)} min read
        </span>
        <h2>{post.title}</h2>
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
          <img className="cover" src={post.image_url} alt="" />
        ) : null}
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </article>
      <div className="mx-auto mt-7 flex max-w-[760px] flex-wrap gap-3 border-t border-white/8 pt-8">
        <Link href="/services#book" className="inline-flex h-12 items-center rounded-full bg-violet-500 px-6 text-sm font-bold text-white no-underline hover:bg-violet-600">
          Book a service
        </Link>
        <Link href="/shop" className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-bold text-white no-underline hover:border-white hover:bg-white/6">
          <Icon name="bag" className="mr-2 size-4" /> Shop products
        </Link>
      </div>
    </main>
  );
}
