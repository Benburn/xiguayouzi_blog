import { Link } from "react-router-dom";
import { contact, brand } from "../data/profile.js";

/**
 * Contact + Footer
 * - 公众号、小红书、邮箱、微信四种入口
 * - 底部版权链接
 */
export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact__bg" aria-hidden="true">
        <svg className="contact__bg-grid" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="contactGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="rgba(42, 111, 217, 0.05)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contactGrid)" />
        </svg>
        <div className="contact__bg-glow" />
      </div>

      <div className="container contact__inner">
        <div className="contact__top">
          <div className="eyebrow">04 · GET IN TOUCH</div>
          <h2 className="contact__title">
            <span className="contact__title-line">欢迎</span>
            <span className="contact__title-line">
              <span className="contact__title-accent">交流</span>与
              <span className="contact__title-accent"> 合作</span>
            </span>
          </h2>
          <p className="contact__lead">
            无论是材料研发、临床合作、注册咨询，还是单纯的内容讨论，
            都可以通过以下渠道找到我。
          </p>
        </div>

        <div className="contact__cards">
          <a className="contact-card" href={`mailto:${contact.email}`}>
            <div className="contact-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </div>
            <div className="contact-card__label">EMAIL</div>
            <div className="contact-card__value">{contact.email}</div>
            <div className="contact-card__hint">
              <span>发送邮件</span>
              <span className="arrow">→</span>
            </div>
          </a>

          <div className="contact-card contact-card--static">
            <div className="contact-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="contact-card__label">WECHAT</div>
            <div className="contact-card__value">{contact.wechat}</div>
            <div className="contact-card__hint">
              <span>添加微信</span>
              <span className="arrow">→</span>
            </div>
          </div>

          <div className="contact-card contact-card--static">
            <div className="contact-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8.5C3 6 5 4 8 4h8c3 0 5 2 5 4.5v7c0 2.5-2 4.5-5 4.5H8c-3 0-5-2-5-4.5v-7z" />
                <path d="M7 9h10M7 12h7M7 15h4" />
              </svg>
            </div>
            <div className="contact-card__label">WECHAT OA</div>
            <div className="contact-card__value">{contact.wechatOA.join(" / ")}</div>
            <div className="contact-card__hint">
              <span>关注公众号</span>
              <span className="arrow">→</span>
            </div>
          </div>

          <div className="contact-card contact-card--static">
            <div className="contact-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M8 8h8M8 12h5M8 16h3" />
              </svg>
            </div>
            <div className="contact-card__label">XIAOHONGSHU</div>
            <div className="contact-card__value">{contact.xiaohongshu}</div>
            <div className="contact-card__hint">
              <span>小红书</span>
              <span className="arrow">→</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <span className="footer__brand-mark" />
            <span>
              {brand.name} · {brand.nameEn}
            </span>
          </div>

          <nav className="footer__nav" aria-label="底部导航">
            <Link to="/#hero">首页</Link>
            <span className="dot-sep" />
            <Link to="/#about">研究方向</Link>
            <span className="dot-sep" />
            <Link to="/#blog">开源项目</Link>
            <span className="dot-sep" />
            <Link to="/#contact">联系</Link>
          </nav>

          <div className="footer__copy">
            © 2026 · Built with React + Vite
          </div>
        </div>
      </footer>
    </section>
  );
}
