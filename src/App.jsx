import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import BlogCategory from "./pages/BlogCategory.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import "./App.css";

function Home() {
  return (
    <>
      <Hero />
      <main>
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

// 通用 Layout：Navbar + 页面 + Footer
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/blog/:categoryId"
          element={
            <Layout>
              <BlogCategory />
            </Layout>
          }
        />
        <Route
          path="/blog/:categoryId/:slug"
          element={
            <Layout>
              <BlogPost />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <main style={{ paddingTop: 200, textAlign: "center" }}>
                <h1>404</h1>
                <p>页面不存在</p>
              </main>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
