import { useEffect, useState, useCallback } from 'react';
import api from '../../api/api';

// Tabs: Collections, Products
const TABS = ['Collections', 'Products'];

function Products() {
    const [activeTab, setActiveTab] = useState('Products');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Collections State
    const [collections, setCollections] = useState([]);
    const [editingCollection, setEditingCollection] = useState(null);
    const [collectionForm, setCollectionForm] = useState({
        name: '',
        slug: '',
        image: '',
        tagline1: '',
        tagline2: '',
        tagline3: '',
        description: '',
        displayOrder: 0,
        status: 'active'
    });
    
    // Products State
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        code: '',
        name: '',
        category: '',
        collectionName: '',
        images: [],
        productImages: [],
        color: '',
        finish: '',
        size: '',
        origin: '',
        description: '',
        totalThickness: '',
        usage: '',
        waterAbsorption: '',
        compressiveStrength: '',
        flexuralStrength: '',
        apparentDensity: '',
        abrasionResistance: '',
        isNewArrival: false,
        qualityImage: '',
        qualityText: '',
        colorSequence: 0,
        displayOrder: 0,
        status: 'active'
    });
    
    // Image Upload State
    const [uploading, setUploading] = useState(false);
    const [imageToAdd, setImageToAdd] = useState({ url: '', description: '', isNewArrival: false });
    const [showImageModal, setShowImageModal] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    
    // Filter State
    const [filterCollection, setFilterCollection] = useState('');
    
    // Fetch Collections
    const fetchCollections = useCallback(async () => {
        try {
            const res = await api.get('/collections/admin');
            setCollections(res.data || []);
        } catch (err) {
            console.error('Error fetching collections:', err);
            // If admin endpoint fails, try public endpoint
            try {
                const res = await api.get('/collections');
                setCollections(res.data || []);
            } catch (err2) {
                setError('Failed to fetch collections');
            }
        }
    }, []);
    
    // Fetch Products
    const fetchProducts = useCallback(async () => {
        try {
            const res = await api.get('/products/admin');
            setProducts(res.data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            // If admin endpoint fails, try public endpoint
            try {
                const res = await api.get('/products');
                setProducts(res.data || []);
            } catch (err2) {
                setError('Failed to fetch products');
            }
        }
    }, []);
    
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchCollections(), fetchProducts()]);
            setLoading(false);
        };
        loadData();
    }, [fetchCollections, fetchProducts]);
    
    // Clear messages after timeout
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    
    // ==================== COLLECTIONS CRUD ====================
    
    const handleAddCollection = () => {
        setEditingCollection('new');
        setCollectionForm({
            name: '',
            slug: '',
            image: '',
            tagline1: '',
            tagline2: '',
            tagline3: '',
            description: '',
            displayOrder: collections.length,
            status: 'active'
        });
    };
    
    const handleEditCollection = (collection) => {
        setEditingCollection(collection._id);
        setCollectionForm({
            name: collection.name || '',
            slug: collection.slug || '',
            image: collection.image || '',
            tagline1: collection.tagline1 || '',
            tagline2: collection.tagline2 || '',
            tagline3: collection.tagline3 || '',
            description: collection.description || '',
            displayOrder: collection.displayOrder || 0,
            status: collection.status || 'active'
        });
    };
    
    const handleSaveCollection = async () => {
        try {
            if (editingCollection === 'new') {
                await api.post('/collections', collectionForm);
                setSuccess('Collection created successfully!');
            } else {
                await api.put(`/collections/${editingCollection}`, collectionForm);
                setSuccess('Collection updated successfully!');
            }
            setEditingCollection(null);
            await fetchCollections();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save collection');
        }
    };
    
    const handleDeleteCollection = async (id) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) return;
        
        try {
            await api.delete(`/collections/${id}`);
            setSuccess('Collection deleted successfully!');
            await fetchCollections();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete collection');
        }
    };
    
    // ==================== PRODUCTS CRUD ====================
    
    const handleAddProduct = () => {
        setSelectedProduct(null);
        setEditingProduct('new');
        setProductForm({
            code: '',
            name: '',
            category: collections[0]?.name || '',
            collectionName: collections[0]?.name || '',
            images: [],
            productImages: [],
            color: '',
            finish: '',
            size: '',
            origin: '',
            description: '',
            totalThickness: '',
            usage: '',
            waterAbsorption: '',
            compressiveStrength: '',
            flexuralStrength: '',
            apparentDensity: '',
            abrasionResistance: '',
            isNewArrival: false,
            qualityImage: '',
            qualityText: '',
            colorSequence: 0,
            displayOrder: products.length,
            status: 'active'
        });
    };
    
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setEditingProduct(null);
    };
    
    const handleEditProduct = (product) => {
        setSelectedProduct(null);
        setEditingProduct(product._id);
        setProductForm({
            code: product.code || '',
            name: product.name || '',
            category: product.category || '',
            collectionName: product.collectionName || product.category || '',
            images: product.images || [],
            productImages: product.productImages || [],
            color: product.color || '',
            finish: product.finish || '',
            size: product.size || '',
            origin: product.origin || '',
            description: product.description || '',
            totalThickness: product.totalThickness || '',
            usage: product.usage || '',
            waterAbsorption: product.waterAbsorption || '',
            compressiveStrength: product.compressiveStrength || '',
            flexuralStrength: product.flexuralStrength || '',
            apparentDensity: product.apparentDensity || '',
            abrasionResistance: product.abrasionResistance || '',
            isNewArrival: product.isNewArrival || false,
            qualityImage: product.qualityImage || '',
            qualityText: product.qualityText || '',
            colorSequence: product.colorSequence || 0,
            displayOrder: product.displayOrder || 0,
            status: product.status || 'active'
        });
    };
    
    const handleSaveProduct = async () => {
        try {
            const dataToSave = { ...productForm, collectionName: productForm.category };
            
            if (editingProduct === 'new') {
                await api.post('/products', dataToSave);
                setSuccess('Product created successfully!');
            } else {
                await api.put(`/products/${editingProduct}`, dataToSave);
                setSuccess('Product updated successfully!');
            }
            setEditingProduct(null);
            await fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        }
    };
    
    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            await api.delete(`/products/${id}`);
            setSuccess('Product deleted successfully!');
            setSelectedProduct(null);
            await fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete product');
        }
    };
    
    // ==================== IMAGE HANDLING ====================
    
    const handleAddImage = () => {
        setImageToAdd({ url: '', description: '', isNewArrival: false });
        setEditingImage(null);
        setShowImageModal(true);
    };
    
    const handleEditImage = (image, index) => {
        setImageToAdd({ 
            url: image.url || image, 
            description: image.description || '', 
            isNewArrival: image.isNewArrival || false 
        });
        setEditingImage({ ...image, index });
        setShowImageModal(true);
    };
    
    const handleSaveImage = () => {
        if (!imageToAdd.url) {
            setError('Please enter an image URL');
            return;
        }
        
        const newImages = [...productForm.images];
        const newProductImages = [...(productForm.productImages || [])];
        
        if (editingImage !== null && editingImage.index !== undefined) {
            // Update existing image
            newImages[editingImage.index] = imageToAdd.url;
            if (newProductImages[editingImage.index]) {
                newProductImages[editingImage.index] = {
                    ...newProductImages[editingImage.index],
                    url: imageToAdd.url,
                    description: imageToAdd.description,
                    isNewArrival: imageToAdd.isNewArrival
                };
            }
        } else {
            // Add new image
            newImages.push(imageToAdd.url);
            newProductImages.push({
                url: imageToAdd.url,
                description: imageToAdd.description,
                isNewArrival: imageToAdd.isNewArrival,
                displayOrder: newProductImages.length
            });
        }
        
        setProductForm(prev => ({
            ...prev,
            images: newImages,
            productImages: newProductImages
        }));
        
        setShowImageModal(false);
        setImageToAdd({ url: '', description: '', isNewArrival: false });
        setEditingImage(null);
    };
    
    const handleDeleteImage = (index) => {
        const newImages = productForm.images.filter((_, i) => i !== index);
        const newProductImages = (productForm.productImages || []).filter((_, i) => i !== index);
        
        setProductForm(prev => ({
            ...prev,
            images: newImages,
            productImages: newProductImages
        }));
    };
    
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const res = await api.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (res.data?.url) {
                setImageToAdd(prev => ({ ...prev, url: res.data.url }));
                setSuccess('Image uploaded successfully!');
            }
        } catch (err) {
            // If upload fails, just show the error - user can still paste URL
            setError('Upload failed. Please paste an image URL instead.');
        } finally {
            setUploading(false);
        }
    };
    
    // ==================== FILTERED PRODUCTS ====================
    
    const filteredProducts = filterCollection 
        ? products.filter(p => 
            p.category?.toLowerCase() === filterCollection.toLowerCase() ||
            p.collectionName?.toLowerCase() === filterCollection.toLowerCase()
          )
        : products;
    
    // ==================== RENDER ====================
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }
    
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Products Management</h1>
            
            {/* Messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === tab
                                ? 'border-b-2 border-amber-500 text-amber-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            {/* Collections Tab */}
            {activeTab === 'Collections' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Collections ({collections.length})</h2>
                        <button
                            onClick={handleAddCollection}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
                        >
                            + Add Collection
                        </button>
                    </div>
                    
                    {/* Collection Form */}
                    {editingCollection && (
                        <div className="bg-white border rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                {editingCollection === 'new' ? 'Add New Collection' : 'Edit Collection'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={collectionForm.name}
                                        onChange={(e) => setCollectionForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-gray-800"
                                        placeholder="e.g., Marble Series"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (auto-generated)</label>
                                    <input
                                        type="text"
                                        value={collectionForm.slug || collectionForm.name?.toLowerCase().replace(/\s+/g, '-')}
                                        onChange={(e) => setCollectionForm(prev => ({ ...prev, slug: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-gray-500 bg-gray-50"
                                        placeholder="marble-series"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={collectionForm.image}
                                        onChange={(e) => setCollectionForm(prev => ({ ...prev, image: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-gray-800"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline 1</label>
                                    <input
                                        type="text"
                                        value={collectionForm.tagline1}
                                        onChange={(e) => setCollectionForm(prev => ({ ...prev, tagline1: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-gray-800"
                                        placeholder="Elevate with Exotic Designs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline 2</label>
                                    <input
                                        type="text"
                                        value={collectionForm.tagline2}
                                        onChange={(e) => setCollectionForm(prev => ({ ...prev, tagline2: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-gray-800"
                                        placeholder="Premium Quality"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline 3</label>
                                    <input
                                        type="text"
                                        value={collectionForm.tagline3}
                                        onChange={(e) => setCollectionForm(prev => ({ ...prev, tagline3: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-gray-800"
                                        placeholder="Luxury Stone Collection"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={collectionForm.status}
                                        onChange={(e) => setCollectionForm(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-gray-800"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={collectionForm.description}
                                        onChange={(e) => setCollectionForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-gray-800"
                                        rows={3}
                                        placeholder="Collection description..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleSaveCollection}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                >
                                    Save Collection
                                </button>
                                <button
                                    onClick={() => setEditingCollection(null)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Collections List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {collections.map((collection, idx) => (
                                    <tr key={collection._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-800">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            {collection.image ? (
                                                <img src={collection.image} alt={collection.name} className="w-12 h-12 object-cover rounded" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                                    No img
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-800">{collection.name}</div>
                                            <div className="text-sm text-gray-500">{collection.slug}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            {products.filter(p => 
                                                p.category?.toLowerCase() === collection.name?.toLowerCase() ||
                                                p.collectionName?.toLowerCase() === collection.name?.toLowerCase()
                                            ).length}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                collection.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {collection.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditCollection(collection)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCollection(collection._id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Products Tab */}
            {activeTab === 'Products' && !editingProduct && !selectedProduct && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Products ({filteredProducts.length})</h2>
                            <select
                                value={filterCollection}
                                onChange={(e) => setFilterCollection(e.target.value)}
                                className="border rounded px-3 py-2 text-gray-800"
                            >
                                <option value="">All Collections</option>
                                {collections.map(c => (
                                    <option key={c._id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleAddProduct}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
                        >
                            + Add Product
                        </button>
                    </div>
                    
                    {/* Products Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collection</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProducts.map(product => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            {(product.images?.[0] || product.productImages?.[0]?.url) ? (
                                                <img 
                                                    src={product.images?.[0] || product.productImages?.[0]?.url} 
                                                    alt={product.name} 
                                                    className="w-12 h-12 object-cover rounded" 
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                    No img
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{product.code || '-'}</td>
                                        <td className="px-4 py-3 text-gray-800">{product.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{product.category || product.collectionName || '-'}</td>
                                        <td className="px-4 py-3 text-gray-600">{product.color || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                product.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {product.status || 'active'}
                                            </span>
                                            {product.isNewArrival && (
                                                <span className="ml-1 px-2 py-1 text-xs rounded bg-amber-100 text-amber-800">
                                                    New
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewProduct(product)}
                                                    className="text-gray-600 hover:text-gray-800 text-sm"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            No products found. Click "Add Product" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Product View */}
            {activeTab === 'Products' && selectedProduct && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEditProduct(selectedProduct)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(selectedProduct._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                    
                    {/* Product Images */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Images</h3>
                        <div className="flex flex-wrap gap-4">
                            {(selectedProduct.images || []).map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img 
                                        src={typeof img === 'string' ? img : img.url} 
                                        alt={`${selectedProduct.name} ${idx + 1}`} 
                                        className="w-32 h-32 object-cover rounded shadow" 
                                    />
                                    {selectedProduct.productImages?.[idx]?.isNewArrival && (
                                        <span className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-1 rounded">
                                            New
                                        </span>
                                    )}
                                </div>
                            ))}
                            {(!selectedProduct.images || selectedProduct.images.length === 0) && (
                                <p className="text-gray-500">No images</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Code</span>
                            <p className="font-medium text-gray-800">{selectedProduct.code || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Collection</span>
                            <p className="font-medium text-gray-800">{selectedProduct.category || selectedProduct.collectionName || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Color</span>
                            <p className="font-medium text-gray-800">{selectedProduct.color || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Finish</span>
                            <p className="font-medium text-gray-800">{selectedProduct.finish || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Size</span>
                            <p className="font-medium text-gray-800">{selectedProduct.size || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Origin</span>
                            <p className="font-medium text-gray-800">{selectedProduct.origin || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Total Thickness</span>
                            <p className="font-medium text-gray-800">{selectedProduct.totalThickness || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Water Absorption</span>
                            <p className="font-medium text-gray-800">{selectedProduct.waterAbsorption || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Compressive Strength</span>
                            <p className="font-medium text-gray-800">{selectedProduct.compressiveStrength || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Flexural Strength</span>
                            <p className="font-medium text-gray-800">{selectedProduct.flexuralStrength || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Apparent Density</span>
                            <p className="font-medium text-gray-800">{selectedProduct.apparentDensity || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm text-gray-500">Abrasion Resistance</span>
                            <p className="font-medium text-gray-800">{selectedProduct.abrasionResistance || '-'}</p>
                        </div>
                    </div>
                    
                    {selectedProduct.description && (
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Description</span>
                            <p className="text-gray-800">{selectedProduct.description}</p>
                        </div>
                    )}
                    
                    {selectedProduct.usage && (
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Usage</span>
                            <p className="text-gray-800">{selectedProduct.usage}</p>
                        </div>
                    )}
                </div>
            )}
            
            {/* Product Edit Form */}
            {activeTab === 'Products' && editingProduct && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingProduct === 'new' ? 'Add New Product' : 'Edit Product'}
                        </h2>
                        <button
                            onClick={() => setEditingProduct(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* Basic Info */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code *</label>
                                <input
                                    type="text"
                                    value={productForm.code}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, code: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., SG-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., Carrara White"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Collection *</label>
                                <select
                                    value={productForm.category}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value, collectionName: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                >
                                    <option value="">Select Collection</option>
                                    {collections.map(c => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                <input
                                    type="text"
                                    value={productForm.color}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., White"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Finish</label>
                                <input
                                    type="text"
                                    value={productForm.finish}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, finish: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., Polished"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                <input
                                    type="text"
                                    value={productForm.size}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, size: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., 600x600mm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                                <input
                                    type="text"
                                    value={productForm.origin}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, origin: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., Italy"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={productForm.status}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isNewArrival"
                                    checked={productForm.isNewArrival}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                                    className="mr-2"
                                />
                                <label htmlFor="isNewArrival" className="text-sm font-medium text-gray-700">Mark as New Arrival</label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Stone Properties */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Stone Properties</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Thickness</label>
                                <input
                                    type="text"
                                    value={productForm.totalThickness}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, totalThickness: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., 18mm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Water Absorption</label>
                                <input
                                    type="text"
                                    value={productForm.waterAbsorption}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, waterAbsorption: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., 0.1%"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Compressive Strength</label>
                                <input
                                    type="text"
                                    value={productForm.compressiveStrength}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, compressiveStrength: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., 140 MPa"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Flexural Strength</label>
                                <input
                                    type="text"
                                    value={productForm.flexuralStrength}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, flexuralStrength: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., 15 MPa"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apparent Density</label>
                                <input
                                    type="text"
                                    value={productForm.apparentDensity}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, apparentDensity: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., 2.7 g/cm³"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Abrasion Resistance</label>
                                <input
                                    type="text"
                                    value={productForm.abrasionResistance}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, abrasionResistance: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="e.g., Class 4"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Description & Usage */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Description & Usage</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    rows={3}
                                    placeholder="Product description..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Usage</label>
                                <textarea
                                    value={productForm.usage}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, usage: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    rows={2}
                                    placeholder="Recommended usage..."
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Images */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3 border-b pb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Product Images</h3>
                            <button
                                type="button"
                                onClick={handleAddImage}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm"
                            >
                                + Add Image
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {productForm.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img 
                                        src={typeof img === 'string' ? img : img.url} 
                                        alt={`Product ${idx + 1}`} 
                                        className="w-24 h-24 object-cover rounded shadow" 
                                    />
                                    {productForm.productImages?.[idx]?.isNewArrival && (
                                        <span className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-1 rounded">
                                            New
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEditImage(img, idx)}
                                            className="text-white bg-blue-500 rounded px-2 py-1 text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(idx)}
                                            className="text-white bg-red-500 rounded px-2 py-1 text-xs"
                                        >
                                            Del
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {productForm.images.length === 0 && (
                                <p className="text-gray-500 text-sm">No images. Click "Add Image" to upload.</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Quality Info */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Quality Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Image URL</label>
                                <input
                                    type="text"
                                    value={productForm.qualityImage}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, qualityImage: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Text</label>
                                <input
                                    type="text"
                                    value={productForm.qualityText}
                                    onChange={(e) => setProductForm(prev => ({ ...prev, qualityText: e.target.value }))}
                                    className="w-full border rounded px-3 py-2 text-gray-800"
                                    placeholder="Quality description..."
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Save/Cancel Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleSaveProduct}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
                        >
                            Save Product
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            
            {/* Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            {editingImage ? 'Edit Image' : 'Add Image'}
                        </h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                            <input
                                type="text"
                                value={imageToAdd.url}
                                onChange={(e) => setImageToAdd(prev => ({ ...prev, url: e.target.value }))}
                                className="w-full border rounded px-3 py-2 text-gray-800"
                                placeholder="https://..."
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Or Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full text-gray-800"
                                disabled={uploading}
                            />
                            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={imageToAdd.description}
                                onChange={(e) => setImageToAdd(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full border rounded px-3 py-2 text-gray-800"
                                placeholder="Image description..."
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="flex items-center text-gray-800">
                                <input
                                    type="checkbox"
                                    checked={imageToAdd.isNewArrival}
                                    onChange={(e) => setImageToAdd(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                                    className="mr-2"
                                />
                                Show as New Arrival
                            </label>
                        </div>
                        
                        {imageToAdd.url && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                                <img src={imageToAdd.url} alt="Preview" className="w-32 h-32 object-cover rounded" />
                            </div>
                        )}
                        
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleSaveImage}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                {editingImage ? 'Update' : 'Add'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowImageModal(false);
                                    setImageToAdd({ url: '', description: '', isNewArrival: false });
                                    setEditingImage(null);
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
