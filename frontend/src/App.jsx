import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetails";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import CatalogPage from "./pages/CatalogPage";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import NewArrivals from "./pages/NewArrivals";
import PublicLayout from "./components/PublicLayout";

// Admin Pages
import Login from "./admin/pages/Login";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import AdminProjects from "./admin/pages/Projects";
import Catalogues from "./admin/pages/Catalogues";
import Blogs from "./admin/pages/Blogs";
import Pages from "./admin/pages/Pages";
import Enquiries from "./admin/pages/Enquiries";
import Media from "./admin/pages/Media";
import Settings from "./admin/pages/Settings";
import ProtectedRoute from "./admin/components/ProtectedRoute";

// Public Project Pages
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation speed
      once: true,    // animate only once
    });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="catalogues" element={<Catalogues />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="pages" element={<Pages />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="media" element={<Media />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:collectionName" element={<CollectionDetail />} />
          <Route path="/collections/:collectionName/:productId" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/new-arrival" element={<NewArrivals />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
