import { useParams, Link } from "react-router-dom";
import { getCategoryById, getPostsByCategory, blogCategories } from "../data/profile.js";

/**
 * 博客分类页：展示该分类下所有文章
 * /blog/:categoryId
 */
export default function BlogCategory() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);
  const posts = getPostsByCategory(categoryId);

  if (!category) {
    return (
      <main className="blog-page blog-page--empty">
        <div className="container">
          <h1>未找到该分类</h1>
          <Link to="/" className="btn btn-ghost">返回首页</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="blog-page">
        <header className="blog-hero">
          <div className="blog-hero__bg" aria-hidden="true">
            <div className={`blog-hero__orb blog-hero__orb--${category.color}`} />
          </div>
          <div className="container blog-hero__content">
            <Link to="/#blog" className="blog-hero__back">
              <span className="arrow">←</span>
              <span>返回项目</span>
            </Link>
            <div className="eyebrow">CATEGORY · {category.code}</div>
            <h1 className="blog-hero__title">
              <span className="blog-hero__title-cn">{category.title}</span>
              <span className="blog-hero__title-en">{category.subtitle}</span>
            </h1>
            <p className="blog-hero__desc">{category.description}</p>
            <div className="blog-hero__count">
              共 <span>{posts.length}</span> 篇文章
            </div>
          </div>
        </header>

        <section className="section blog-list-section">
          <div className="container">
            <div className="blog-list">
              {posts.map((p, i) => (
                <Link
                  to={`/blog/${category.id}/${p.slug}`}
                  className="blog-list-item"
                  key={p.slug}
                >
                  <div className="blog-list-item__num">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="blog-list-item__body">
                    <h3 className="blog-list-item__title">{p.title}</h3>
                    <p className="blog-list-item__excerpt">{p.excerpt}</p>
                    <div className="blog-list-item__meta">
                      <span>{p.date}</span>
                      <span className="dot-sep" />
                      <span>{p.readTime}</span>
                      {p.tags && p.tags.length > 0 && (
                        <>
                          <span className="dot-sep" />
                          <span className="blog-list-item__tags">
                            {p.tags.slice(0, 2).join(" · ")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="blog-list-item__arrow" aria-hidden="true">
                    →
                  </div>
                </Link>
              ))}
            </div>

            {/* 其他分类入口 */}
            <div className="blog-other">
              <div className="eyebrow">EXPLORE OTHER PROJECTS</div>
              <div className="blog-other__grid">
                {blogCategories
                  .filter((c) => c.id !== category.id)
                  .map((c) => (
                    <Link
                      key={c.id}
                      to={`/blog/${c.id}`}
                      className={`blog-other__item blog-other__item--${c.color}`}
                    >
                      <div className="blog-other__code">{c.code}</div>
                      <div className="blog-other__title">{c.title}</div>
                      <div className="blog-other__sub">{c.subtitle}</div>
                    </Link>
                  ))}
              </div>
            </div>
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
