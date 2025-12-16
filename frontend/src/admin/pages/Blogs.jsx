import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
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
        try {
            const res = await api.get('/blogs/admin');
            setBlogs(res.data);
        } catch (err) {
            console.error('Error fetching blogs:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/blogs/${currentBlog._id}`, formData);
            } else {
                await api.post('/blogs', formData);
            }
            setIsEditing(false);
            setCurrentBlog(null);
            setFormData({ title: '', slug: '', content: '', featuredImage: '', metaTitle: '', metaDescription: '', status: 'draft' });
            fetchBlogs();
        } catch (err) {
            console.error('Error saving blog:', err);
        }
    };

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Blogs</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Blog' : 'Add New Blog'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="p-2 border rounded"
                        value={formData.title}
                        onChange={handleTitleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Slug"
                        className="p-2 border rounded"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Featured Image URL"
                        className="p-2 border rounded"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    />
                    <textarea
                        placeholder="Content (HTML or Markdown)"
                        className="p-2 border rounded h-32"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Meta Title"
                            className="p-2 border rounded"
                            value={formData.metaTitle}
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Meta Description"
                            className="p-2 border rounded"
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        />
                    </div>
                    <select
                        className="p-2 border rounded"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        {isEditing ? 'Update Blog' : 'Add Blog'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => { setIsEditing(false); setFormData({ title: '', slug: '', content: '', featuredImage: '', metaTitle: '', metaDescription: '', status: 'draft' }); }}
                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-2"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map(blog => (
                            <tr key={blog._id} className="border-t">
                                <td className="p-4">{blog.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-sm ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(blog._id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Blogs;
