import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        featuredImage: '',
        metaTitle: '',
        metaDescription: '',
        status: 'draft'
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/blogs/admin');
            setBlogs(res.data);
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await api.delete(`/blogs/${id}`);
                fetchBlogs();
            } catch (err) {
                console.error('Error deleting blog:', err);
            }
        }
    };

    const handleEdit = (blog) => {
        setIsEditing(true);
        setCurrentBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            featuredImage: blog.featuredImage || '',
            metaTitle: blog.metaTitle || '',
            metaDescription: blog.metaDescription || '',
            status: blog.status
        });
    };

    const resetForm = () => {
        setFormData({ title: '', slug: '', content: '', featuredImage: '', metaTitle: '', metaDescription: '', status: 'draft' });
        setIsEditing(false);
        setCurrentBlog(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/blogs/${currentBlog._id}`, formData);
            } else {
                await api.post('/blogs', formData);
            }
            resetForm();
            fetchBlogs();
        } catch (err) {
            console.error('Error saving blog:', err);
            alert('Error saving blog');
        }
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        });
    };

    const ActionButton = ({ onClick, children, type = 'button', variant = 'primary' }) => (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
                variant === 'primary' ? 'bg-[#d4a853] text-black hover:bg-[#c49743]' :
                variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                'bg-gray-600 text-white hover:bg-gray-700'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-8">Blogs</h1>

            {/* Form */}
            <div className="bg-[#2a2a2a] p-6 rounded border border-gray-700 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-[#d4a853]">{isEditing ? 'Edit Blog' : 'Add New Blog'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white placeholder-gray-400"
                        value={formData.title}
                        onChange={handleTitleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Slug"
                        className="p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white placeholder-gray-400"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        className="p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white placeholder-gray-400 min-h-[200px]"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Featured Image URL"
                        className="p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white placeholder-gray-400"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Meta Title (SEO)"
                            className="p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white placeholder-gray-400"
                            value={formData.metaTitle}
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        />
                        <select
                            className="p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <textarea
                        placeholder="Meta Description (SEO)"
                        className="p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white placeholder-gray-400"
                        rows="2"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <ActionButton type="submit" variant="primary">
                            {isEditing ? 'Update Blog' : 'Add Blog'}
                        </ActionButton>
                        {isEditing && (
                            <ActionButton onClick={resetForm} variant="secondary">
                                Cancel
                            </ActionButton>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-[#2a2a2a] rounded border border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : blogs.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No blogs found. Create your first blog above.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[#1a1a1a]">
                            <tr>
                                <th className="p-4 text-[#d4a853]">Title</th>
                                <th className="p-4 text-[#d4a853]">Slug</th>
                                <th className="p-4 text-[#d4a853]">Status</th>
                                <th className="p-4 text-[#d4a853]">Created</th>
                                <th className="p-4 text-[#d4a853]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map(blog => (
                                <tr key={blog._id} className="border-t border-gray-700 hover:bg-[#3a3a3a]">
                                    <td className="p-4">{blog.title}</td>
                                    <td className="p-4 text-gray-400">{blog.slug}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            blog.status === 'published' 
                                                ? 'bg-green-900 text-green-300' 
                                                : 'bg-yellow-900 text-yellow-300'
                                        }`}>
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <ActionButton onClick={() => handleEdit(blog)}>Edit</ActionButton>
                                            <ActionButton onClick={() => handleDelete(blog._id)} variant="danger">Delete</ActionButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Blogs;
