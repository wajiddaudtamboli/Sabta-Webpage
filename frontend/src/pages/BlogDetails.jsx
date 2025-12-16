import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/api";

const BlogDetails = () => {
  const { id: slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${slug}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full px-6 md:px-12 lg:px-20 py-20 mt-20 text-center">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full px-6 md:px-12 lg:px-20 py-20 mt-20">
        <h2 className="text-2xl font-semibold">Blog Not Found</h2>
        <Link to="/blog" className="underline mt-4 block">← Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div data-aos="fade-up" className="w-full px-6 md:px-12 lg:px-20 py-20 mt-20">

      <Link to="/blog" className="underline text-sm">
        ← Back to Blogs
      </Link>

      <div className="mt-6">
        <img
          src={blog.featuredImage || "https://via.placeholder.com/800x400"}
          alt={blog.title}
          className="
            w-full 
            h-72 sm:h-80 md:h-[420px] lg:h-[480px] xl:h-[520px]
            object-cover 
            rounded-xl 
            shadow-md
          "
        />

        <h1 className="text-3xl font-semibold mt-6">{blog.title}</h1>

        <div
          className="mt-4 opacity-90 whitespace-pre-line leading-relaxed prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
};

export default BlogDetails;
