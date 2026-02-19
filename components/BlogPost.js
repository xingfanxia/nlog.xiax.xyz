import FormattedDate from "@/components/FormattedDate";
import { useConfig } from "@/lib/config";
import Link from "next/link";

const BlogPost = ({ post }) => {
  const BLOG = useConfig();

  return (
    <article key={post.id} className="mb-6 md:mb-8">
      <Link href={`${BLOG.path}/${post.slug}`}>
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            {post.title}
          </h2>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            <FormattedDate date={post.date} />
          </time>
        </header>
        <main>
          <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
            {post.summary}
          </p>
        </main>
      </Link>
      <div className="flex flex-wrap items-center gap-1 mt-2">
        {post.hasZh && (
          <Link
            href={`${BLOG.path}/${post.zhSlug}`}
            className="text-xs px-2 py-0.5 rounded-full border border-rose-300/60 dark:border-rose-700/50 text-rose-400 dark:text-rose-400/80 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            中文
          </Link>
        )}
        {post.tags && post.tags.length > 0 && post.tags.map(tag => (
          <Link
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className="text-xs px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-500 hover:text-gray-700 dark:hover:border-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
};

export default BlogPost;
