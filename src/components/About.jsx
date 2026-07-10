import { owner, experience, contact, highlights } from "../data/profile.js";

/**
 * About：团队背景模块
 * - 顶部：团队介绍 + 数据指标
 * - 中部：主理人 4 段经历（时间线）
 * - 底部：联系方式（公众号、小红书、邮箱、微信）
 */
export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        {/* 章节头 */}
        <div className="section-head">
          <div className="eyebrow">01 · TEAM</div>
          <h2 className="section-title">
            团队<span className="accent"> 背景</span>
          </h2>
          <p className="section-lead">{owner.bio}</p>
        </div>

        {/* 数据指标 */}
        <div className="about__stats">
          {highlights.map((h) => (
            <div className="about__stat" key={h.label}>
              <div className="about__stat-value">
                <span className="about__stat-num">{h.value}</span>
                <span className="about__stat-suffix">{h.suffix}</span>
              </div>
              <div className="about__stat-label">{h.label}</div>
              <div className="about__stat-line" />
            </div>
          ))}
        </div>

        {/* 下部：主理人经历 + 联系方式 */}
        <div className="about__grid">
          {/* 左侧：主理人经历 */}
          <div className="about__col">
            <h3 className="about__col-title">
              <span className="about__col-num">/</span> 主理人经历
            </h3>
            <div className="timeline">
              {experience.map((e, i) => (
                <div className={`timeline__item timeline__item--${e.accent}`} key={i}>
                  <div className="timeline__dot" />
                  <div className="timeline__period">{e.period}</div>
                  <div className="timeline__role">{e.role}</div>
                  <div className="timeline__company">{e.company}</div>
                  <ul className="timeline__points">
                    {e.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：联系方式 */}
          <div className="about__col">
            <h3 className="about__col-title">
              <span className="about__col-num">/</span> 联系方式
            </h3>

            <div className="contact-list">
              <ContactCard
                label="EMAIL"
                value={contact.email}
                href={`mailto:${contact.email}`}
                hint="发送邮件"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                }
              />
              <ContactCard
                label="WECHAT"
                value={contact.wechat}
                hint="添加微信"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                }
              />

              {/* 公众号矩阵 */}
              <div className="contact-card contact-card--list">
                <div className="contact-card__head">
                  <div className="contact-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8.5C3 6 5 4 8 4h8c3 0 5 2 5 4.5v7c0 2.5-2 4.5-5 4.5H8c-3 0-5-2-5-4.5v-7z" />
                      <path d="M7 9h10M7 12h7M7 15h4" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-card__label">微信公众号</div>
                    <div className="contact-card__value">WECHAT OA</div>
                  </div>
                </div>
                <ul className="contact-card__sublist">
                  {contact.wechatOA.map((oa) => (
                    <li key={oa}>
                      <span className="dot" />
                      {oa}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 小红书 */}
              <div className="contact-card contact-card--list">
                <div className="contact-card__head">
                  <div className="contact-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path d="M8 8h8M8 12h5M8 16h3" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-card__label">小红书</div>
                    <div className="contact-card__value">{contact.xiaohongshu}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ label, value, href, hint, icon }) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      className="contact-card"
      {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
    >
      <div className="contact-card__head">
        <div className="contact-card__icon">{icon}</div>
        <div>
          <div className="contact-card__label">{label}</div>
          <div className="contact-card__value">{value}</div>
        </div>
      </div>
      {hint && (
        <div className="contact-card__hint">
          <span>{hint}</span>
          <span className="arrow">→</span>
        </div>
      )}
    </Wrapper>
  );
}
