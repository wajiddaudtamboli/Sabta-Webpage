import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        images: '',
        status: 'active'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products/admin');
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
            }
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price || '',
            images: product.images.join(','),
            status: product.status
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            images: formData.images.split(',').map(img => img.trim())
        };

        try {
            if (isEditing) {
                await api.put(`/products/${currentProduct._id}`, data);
            } else {
                await api.post('/products', data);
            }
            setIsEditing(false);
            setCurrentProduct(null);
            setFormData({ name: '', category: '', description: '', price: '', images: '', status: 'active' });
            fetchProducts();
        } catch (err) {
            console.error('Error saving product:', err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Products</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="p-2 border rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        className="p-2 border rounded"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        className="p-2 border rounded md:col-span-2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        className="p-2 border rounded"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Image URLs (comma separated)"
                        className="p-2 border rounded"
                        value={formData.images}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    />
                    <select
                        className="p-2 border rounded"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-2">
                        {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => { setIsEditing(false); setFormData({ name: '', category: '', description: '', price: '', images: '', status: 'active' }); }}
                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 md:col-span-2 mt-2"
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
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} className="border-t">
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">{product.category}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-sm ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
