import { Link } from "react-router-dom";
import { blogCategories, getPostsByCategory } from "../data/profile.js";

/**
 * Projects / Blog：三个开源项目
 * 形式：每个分类（医疗器械 / 医学影像 / 个人成长）作为一个分类块
 * 块内：分类简介 + 3 篇文章预览卡 + "查看更多"
 */
export default function Projects() {
  return (
    <section id="blog" className="section projects">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">02 · NOTES & OPEN-SOURCE PROJECTS</div>
          <h2 className="section-title">
            文章与<span className="accent"> 开源项目</span>
          </h2>
          <p className="section-lead">
            沿着医疗器械、医学影像与个人成长三条主线，持续记录临床观察、
            工程实践与阶段思考。
          </p>
        </div>

        <div className="projects__list">
          {blogCategories.map((cat) => (
            <CategoryBlock key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryBlock({ category }) {
  const posts = getPostsByCategory(category.id).slice(0, 3);

  return (
    <article className={`project-block project-block--${category.color}`}>
      {/* 左侧：分类信息 */}
      <Link
        to={`/blog/${category.id}`}
        className="project-block__head"
        aria-label={`查看${category.title}栏目全部文章`}
      >
        <div className="project-block__code">{category.code}</div>
        <div className="project-block__titles">
          <h3 className="project-block__title">{category.title}</h3>
          <div className="project-block__subtitle">{category.subtitle}</div>
        </div>
        <p className="project-block__desc">{category.description}</p>
        <span className="project-block__more">
          <span>查看全部文章</span>
          <span className="arrow">→</span>
        </span>
      </Link>

      {/* 右侧：文章列表 */}
      <div className="project-block__posts">
        {posts.map((p, i) => (
          <Link
            to={`/blog/${category.id}/${p.slug}`}
            className="post-preview"
            key={p.slug}
          >
            <div className="post-preview__num">{String(i + 1).padStart(2, "0")}</div>
            <div className="post-preview__body">
              <div className="post-preview__title">{p.title}</div>
              <div className="post-preview__excerpt">{p.excerpt}</div>
              <div className="post-preview__meta">
                <span>{p.date}</span>
                <span className="dot-sep" />
                <span>{p.readTime}</span>
              </div>
            </div>
            <div className="post-preview__arrow" aria-hidden="true">
              →
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
