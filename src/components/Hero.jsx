import { Link } from "react-router-dom";
import { brand, blogCategories, contact } from "../data/profile.js";

/**
 * Hero：全屏首页
 * - 顶部导航由 Navbar 处理
 * - 中央：品牌名 + 一句话定位 + 三个项目入口 + 联系按钮
 * - 底部：状态条 / 时间戳
 */
export default function Hero() {
  return (
    <section id="hero" className="hero">
      {/* 背景层：淡蓝渐变 + 网格 */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-glow" />
        <svg className="hero__bg-grid" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="rgba(42, 111, 217, 0.06)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
        <div className="hero__bg-orb hero__bg-orb--a" />
        <div className="hero__bg-orb hero__bg-orb--b" />
      </div>

      <div className="container hero__content">
        {/* 顶部 meta 行 */}
        <div className="hero__top">
          <div className="hero__chip">
            <span className="hero__chip-dot" />
            <span>{brand.nameEn}</span>
          </div>
          <div className="hero__loc">
            <span className="hero__loc-line" />
            <span>CN · 2025 — 2026</span>
          </div>
        </div>

        {/* 主标题区 */}
        <div className="hero__main">
          <div className="eyebrow">PORTFOLIO · TEAM</div>

          <h1 className="hero__title">
            <span className="hero__title-line">西瓜</span>
            <span className="hero__title-line">
              <span className="hero__title-accent">柚子</span>
            </span>
            <span className="hero__title-line hero__title-line--sub">
              {brand.slogan}
            </span>
          </h1>

          <p className="hero__lead">{brand.description}</p>

          <div className="hero__ctas">
            <a
              href="#contact"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              建立联系
              <span className="arrow">→</span>
            </a>
            <a
              href="#blog"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              查看项目
            </a>
          </div>
        </div>

        {/* 项目入口（3 个分类卡） */}
        <div className="hero__projects">
          <div className="hero__projects-label">
            <span className="hero__projects-line" />
            <span>OPEN-SOURCE PROJECTS</span>
          </div>
          <div className="hero__projects-grid">
            {blogCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/blog/${cat.id}`}
                className={`hero-project hero-project--${cat.color}`}
              >
                <div className="hero-project__code">{cat.code}</div>
                <div className="hero-project__body">
                  <div className="hero-project__title">{cat.title}</div>
                  <div className="hero-project__sub">{cat.subtitle}</div>
                </div>
                <div className="hero-project__arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 底部信息条 */}
        <div className="hero__bottom">
          <div className="hero__scroll" aria-hidden="true">
            <span className="hero__scroll-text">SCROLL</span>
            <span className="hero__scroll-line">
              <span className="hero__scroll-dot" />
            </span>
          </div>

          <div className="hero__meta">
            <div className="hero__meta-item">
              <span className="hero__meta-label">CONTACT</span>
              <span className="hero__meta-value">{contact.email}</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-label">WECHAT</span>
              <span className="hero__meta-value">{contact.wechat}</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-label">STATUS</span>
              <span className="hero__meta-value">
                <span className="status-dot" /> 开放合作
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
