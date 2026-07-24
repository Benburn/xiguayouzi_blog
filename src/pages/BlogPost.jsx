import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import { useMemo } from "react";
import {
  getPostBySlug,
  getCategoryById,
  getPostsByCategory,
} from "../data/profile.js";

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * 博客文章详情页
 * /blog/:categoryId/:slug
 */
export default function BlogPost() {
  const { categoryId, slug } = useParams();
  const post = getPostBySlug(slug);
  const category = getCategoryById(categoryId);

  const html = useMemo(() => {
    if (!post?.body) return "";
    return marked
      .parse(post.body)
      .replaceAll("<img ", '<img loading="lazy" decoding="async" ');
  }, [post]);

  if (!post || !category) {
    return (
      <main className="blog-page blog-page--empty">
        <div className="container">
          <h1>文章未找到</h1>
          <Link to="/" className="btn btn-ghost">返回首页</Link>
        </div>
      </main>
    );
  }

  // 同分类其他文章
  const related = getPostsByCategory(categoryId)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <main className="post-page">
        <header className="post-hero">
          <div className="post-hero__bg" aria-hidden="true">
            <div className={`post-hero__orb post-hero__orb--${category.color}`} />
          </div>
          <div className="container post-hero__content">
            <div className="post-hero__crumb">
              <Link to="/">首页</Link>
              <span className="arrow">/</span>
              <Link to={`/blog/${category.id}`}>{category.title}</Link>
              <span className="arrow">/</span>
              <span>文章</span>
            </div>

            <div className="post-hero__meta">
              <span className="post-hero__cat">{category.title}</span>
              <span className="dot-sep" />
              <span>{post.date}</span>
              <span className="dot-sep" />
              <span>{post.readTime}</span>
            </div>

            <h1 className="post-hero__title">{post.title}</h1>
            <p className="post-hero__excerpt">{post.excerpt}</p>

            {post.tags && post.tags.length > 0 && (
              <div className="post-hero__tags">
                {post.tags.map((t) => (
                  <span className="tag" key={t}>
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <article className="post-article">
          <div className="container">
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </article>

        {/* 相关文章 */}
        {related.length > 0 && (
          <section className="post-related section">
            <div className="container">
              <div className="eyebrow">RELATED · {category.title}</div>
              <h2 className="post-related__title">继续阅读</h2>
              <div className="post-related__grid">
                {related.map((p) => (
                  <Link
                    to={`/blog/${category.id}/${p.slug}`}
                    className="related-card"
                    key={p.slug}
                  >
                    <div className="related-card__title">{p.title}</div>
                    <div className="related-card__excerpt">{p.excerpt}</div>
                    <div className="related-card__meta">
                      <span>{p.date}</span>
                      <span className="dot-sep" />
                      <span>{p.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="post-return">
          <div className="container">
            <Link to={`/blog/${category.id}`} className="btn btn-ghost">
              <span className="arrow">←</span>
              返回 {category.title}
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__brand-mark" />
          <span>西瓜柚子 · 2026</span>
        </div>
        <div className="footer__copy">
          © 2026 西瓜柚子团队 · Built with React + Vite
        </div>
        <Link to="/" className="footer__back">
          <span>回到首页</span>
          <span className="arrow">↑</span>
        </Link>
      </div>
    </footer>
  );
}
