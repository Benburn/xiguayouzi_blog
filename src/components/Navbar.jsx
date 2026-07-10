import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { brand } from "../data/profile.js";

/**
 * 导航栏
 * - 滚动后变实色
 * - 在博客详情/分类页：点击"首页/团队/项目/联系"返回首页锚点
 * - 品牌名始终能回到首页
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    if (!isHome) {
      navigate("/");
      // 等待跳转到首页后再滚动
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "hero", label: "首页" },
    { id: "about", label: "团队" },
    { id: "blog", label: "开源项目" },
    { id: "contact", label: "联系" },
  ];

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          <span className="nav__brand-mark" aria-hidden="true">
            <span className="dot" />
          </span>
          <span className="nav__brand-text">
            <span className="nav__brand-name">{brand.name}</span>
            <span className="nav__brand-sub">{brand.nameEn}</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="主导航">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(item.id);
              }}
              className="nav__link"
            >
              <span className="nav__link-text">{item.label}</span>
              <span className="nav__link-line" />
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            goTo("contact");
          }}
          className="nav__cta"
        >
          <span className="nav__cta-dot" />
          联系我
        </a>
      </div>
    </header>
  );
}
