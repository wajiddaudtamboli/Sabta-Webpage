import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogBanner from "../assets/BannerImages/Marble2.jpeg";
import { api } from "../api/api";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div data-aos="fade-up" className="w-full">
      {/* BANNER */}
      <section
        data-aos="fade-up"
        className="w-full h-64 sm:h-80 md:h-[400px] bg-fixed bg-center bg-cover relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${BlogBanner})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold relative z-10 uppercase text-white">
          Blogs
        </h1>
      </section>

      {/* BLOG SECTION */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-20">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="
                  border border-(--brand-accent)/40 rounded-xl 
                  shadow-md overflow-hidden hover:shadow-xl 
                  transition cursor-pointer
                "
              >
                <img
                  src={blog.featuredImage || "https://via.placeholder.com/400x300"}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-semibold">{blog.title}</h3>
                  <p className="opacity-80 text-sm line-clamp-3">{blog.metaDescription || "No description"}</p>
                  <span className="underline text-sm">Read More</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
