import { useState, useEffect, useRef } from 'react';
import api from '../../api/api';

const Products = () => {
    // Collections state - now from database
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    
    // Products state
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Product images state for carousel
    const [productImages, setProductImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Image upload ref
    const imageInputRef = useRef(null);
    
    // Form data
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        category: '',
        collectionName: 'Natural Stone Collections by SABTA GRANITE',
        description: '',
        color: '',
        origin: '',
        isBookmatch: false,
        isTranslucent: false,
        isNatural: true,
        isNewArrival: false,
        grade: '',
        compressionStrength: '',
        impactTest: '',
        bulkDensity: '',
        waterAbsorption: '',
        thermalExpansion: '',
        flexuralStrength: '',
        images: [],
        status: 'active'
    });

    // Fetch collections from database
    const fetchCollections = async () => {
        try {
            const response = await api.get('/collections');
            setCollections(response.data);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    // Fetch products (optionally by collection)
    const fetchProducts = async (collectionId = null) => {
        setLoading(true);
        try {
            const url = collectionId ? `/products?collection=${collectionId}` : '/products';
            const response = await api.get(url);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchCollections();
        fetchProducts();
    }, []);

    // Handle collection select
    const handleCollectionSelect = (collection) => {
        setSelectedCollection(collection);
        fetchProducts(collection._id);
    };

    // Handle product select for editing
    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setIsEditing(true);
        setFormData({
            code: product.code || '',
            name: product.name || '',
            category: product.category || '',
            collectionName: product.collectionName || 'Natural Stone Collections by SABTA GRANITE',
            description: product.description || '',
            color: product.color || '',
            origin: product.origin || '',
            isBookmatch: product.isBookmatch || false,
            isTranslucent: product.isTranslucent || false,
            isNatural: product.isNatural !== false,
            isNewArrival: product.isNewArrival || false,
            grade: product.grade || '',
            compressionStrength: product.compressionStrength || '',
            impactTest: product.impactTest || '',
            bulkDensity: product.bulkDensity || '',
            waterAbsorption: product.waterAbsorption || '',
            thermalExpansion: product.thermalExpansion || '',
            flexuralStrength: product.flexuralStrength || '',
            images: product.images || [],
            status: product.status || 'active'
        });
        setProductImages(product.images || []);
        setCurrentImageIndex(0);
    };

    // Handle save product
    const handleSave = async () => {
        setLoading(true);
        try {
            const productData = {
                ...formData,
                collection: selectedCollection?._id,
                images: productImages
            };
            
            if (selectedProduct) {
                // Update existing product
                await api.put(`/products/${selectedProduct._id}`, productData);
                alert('Product updated successfully!');
            } else {
                // Create new product
                await api.post('/products', productData);
                alert('Product created successfully!');
            }
            
            // Refresh products list
            fetchProducts(selectedCollection?._id);
            
            // Reset form
            setIsEditing(false);
            setSelectedProduct(null);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Handle delete product
    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        setLoading(true);
        try {
            await api.delete(`/products/${productId}`);
            alert('Product deleted successfully!');
            fetchProducts(selectedCollection?._id);
            setIsEditing(false);
            setSelectedProduct(null);
            resetForm();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            category: '',
            collectionName: 'Natural Stone Collections by SABTA GRANITE',
            description: '',
            color: '',
            origin: '',
            isBookmatch: false,
            isTranslucent: false,
            isNatural: true,
            isNewArrival: false,
            grade: '',
            compressionStrength: '',
            impactTest: '',
            bulkDensity: '',
            waterAbsorption: '',
            thermalExpansion: '',
            flexuralStrength: '',
            images: [],
            status: 'active'
        });
        setProductImages([]);
        setCurrentImageIndex(0);
    };

    // Handle image upload from device
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setLoading(true);
        console.log('Starting image upload...', files.length, 'files');
        
        try {
            const uploadedImages = [];
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log('Uploading file:', file.name, 'Size:', file.size);
                
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                
                const response = await api.post('/media/upload', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                console.log('Upload response:', response.data);
                
                if (response.data.url) {
                    uploadedImages.push(response.data.url);
                    setProductImages(prev => [...prev, response.data.url]);
                }
            }
            
            alert(`Successfully uploaded ${uploadedImages.length} image(s)!`);
            console.log('All images uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            console.error('Error response:', error.response?.data);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Failed to upload image: ${errorMsg}\n\nPlease check your internet connection and try again.`);
        } finally {
            setLoading(false);
            // Reset file input
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        }
    };

    // Handle image delete from list
    const handleDeleteImage = (index) => {
        if (!window.confirm('Delete this image?')) return;
        setProductImages(prev => prev.filter((_, i) => i !== index));
    };

    // Image carousel navigation
    const prevImage = () => {
        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : productImages.length - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev < productImages.length - 1 ? prev + 1 : 0));
    };

    // Action Button Component (same as original)
    const ActionButton = ({ children, onClick, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className="bg-[#d4a853] text-black px-3 py-1 text-xs rounded hover:bg-[#c49743] disabled:opacity-50 cursor-pointer"
        >
            {children}
        </button>
    );

    // Menu Button Component (same as original)
    const MenuButton = ({ onClick }) => (
        <button onClick={onClick} className="text-[#d4a853] hover:text-[#c49743] cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
        </button>
    );

    return (
        <div className="p-6 text-white min-h-screen">
            {/* Hidden file input for image upload */}
            <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
            />
            
            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg">
                        <div className="animate-spin w-8 h-8 border-4 border-[#d4a853] border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-[#d4a853]">Loading...</p>
                    </div>
                </div>
            )}

            {/* Collections Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-semibold">1</span>
                    <span className="text-lg font-semibold">Collections</span>
                    <span className="text-[#d4a853] text-sm italic ml-2">- Listed Collections will be visible on website, select a collection to view products.</span>
                </div>

                <div className="bg-[#1a1a1a] rounded border border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3 text-left">Sr No</th>
                                <th className="p-3 text-left">Collection Name</th>
                                <th className="p-3 text-left">Display Order</th>
                                <th className="p-3 text-left">Product Count</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {collections.length > 0 ? collections.map((collection, index) => (
                                <tr 
                                    key={collection._id} 
                                    className={`border-b border-gray-700 hover:bg-[#2a2a2a] cursor-pointer ${selectedCollection?._id === collection._id ? 'bg-[#2a2a2a]' : ''}`}
                                    onClick={() => handleCollectionSelect(collection)}
                                >
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{collection.name}</td>
                                    <td className="p-3">{collection.displayOrder || index + 1}</td>
                                    <td className="p-3">{collection.productCount || 0}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${collection.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}`}>
                                            {collection.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <MenuButton onClick={(e) => { e.stopPropagation(); handleCollectionSelect(collection); }} />
                                    </td>
                                </tr>
                            )) : (
                                // Static fallback rows (same as original)
                                [
                                    'Italian Marble Series',
                                    'Onyx Collections',
                                    'Granite Series',
                                    'Quartzite Series',
                                    'Limestone Series',
                                    'Travertine Series',
                                    'Semi-Precious Collections',
                                    'Sandstone Series',
                                    'Slate Collections',
                                    'Indian Marble Series',
                                    'Turkish Marble Series',
                                    'Greek Marble Series'
                                ].map((name, index) => (
                                    <tr key={index} className="border-b border-gray-700">
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">{name}</td>
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">0</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 rounded text-xs bg-green-600">active</span>
                                        </td>
                                        <td className="p-3"><MenuButton /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SPILL / Excel Import Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-semibold">SPILL</span>
                    <span className="text-[#d4a853] text-sm italic ml-2">- Required to import data from file, file format must be as below.</span>
                </div>

                <div className="bg-[#1a1a1a] rounded border border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3 text-left">Sr No</th>
                                <th className="p-3 text-left">Code</th>
                                <th className="p-3 text-left">Product Name</th>
                                <th className="p-3 text-left">Color</th>
                                <th className="p-3 text-left">Origin</th>
                                <th className="p-3 text-left">Is Bookmatch</th>
                                <th className="p-3 text-left">Is Translucent</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-700">
                                <td className="p-3">1</td>
                                <td className="p-3">SG01099</td>
                                <td className="p-3">Light Emperador</td>
                                <td className="p-3">Beige</td>
                                <td className="p-3">Turkey</td>
                                <td className="p-3">Yes</td>
                                <td className="p-3">No</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="p-3">2</td>
                                <td className="p-3">SG01100</td>
                                <td className="p-3">Dark Emperador</td>
                                <td className="p-3">Brown</td>
                                <td className="p-3">Spain</td>
                                <td className="p-3">No</td>
                                <td className="p-3">No</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product View Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-semibold">1</span>
                    <span className="text-lg font-semibold">Product View</span>
                    <span className="text-[#d4a853] text-sm italic ml-2">- Option required to define the color sequence and display order.</span>
                </div>

                <div className="bg-[#1a1a1a] rounded border border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3 text-left">Sr No</th>
                                <th className="p-3 text-left">Image</th>
                                <th className="p-3 text-left">Code</th>
                                <th className="p-3 text-left">Product Name</th>
                                <th className="p-3 text-left">Color</th>
                                <th className="p-3 text-left">Origin</th>
                                <th className="p-3 text-left">Is Bookmatch</th>
                                <th className="p-3 text-left">Is Translucent</th>
                                <th className="p-3 text-left">Is Natural</th>
                                <th className="p-3 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map((product, index) => (
                                <tr key={product._id} className="border-b border-gray-700 hover:bg-[#2a2a2a]">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">
                                        <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                                            {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                    </td>
                                    <td className="p-3">{product.code || 'SG01099'}</td>
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3">{product.color || 'Beige'}</td>
                                    <td className="p-3">{product.origin || 'Turkey'}</td>
                                    <td className="p-3">{product.isBookmatch ? 'Yes' : 'No'}</td>
                                    <td className="p-3">{product.isTranslucent ? 'Yes' : 'No'}</td>
                                    <td className="p-3">{product.isNatural !== false ? 'Yes' : 'No'}</td>
                                    <td className="p-3">
                                        <MenuButton onClick={() => handleProductSelect(product)} />
                                    </td>
                                </tr>
                            )) : (
                                [1,2,3,4,5,6,7].map((num) => (
                                    <tr key={num} className="border-b border-gray-700">
                                        <td className="p-3">{num}</td>
                                        <td className="p-3"><div className="w-12 h-12 bg-gray-700 rounded"></div></td>
                                        <td className="p-3">SG01099</td>
                                        <td className="p-3">Light Emperador</td>
                                        <td className="p-3">Beige</td>
                                        <td className="p-3">Turkey</td>
                                        <td className="p-3">Yes</td>
                                        <td className="p-3">No</td>
                                        <td className="p-3">Yes</td>
                                        <td className="p-3"><MenuButton /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Edit Screen */}
            {isEditing && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">1 Product Edit Screen</h3>
                    
                    <div className="bg-[#1a1a1a] rounded border border-gray-700 p-6">
                        {/* Top Section */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[#d4a853]">Auto</span>
                                <span className="text-gray-500">-------</span>
                                <span className="text-[#d4a853]">Auto</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                    placeholder="SG01099"
                                    className="bg-transparent border-b border-gray-600 px-2 py-1 text-white w-24"
                                />
                                <span className="text-gray-500">-------</span>
                                <span>{formData.collectionName}</span>
                            </div>
                        </div>

                        {/* Product Name */}
                        <div className="mb-6">
                            <span className="text-[#d4a853]">Auto</span>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Product Name"
                                className="block bg-transparent border-b border-gray-600 px-2 py-1 text-white w-full max-w-md mt-2"
                            />
                        </div>

                        {/* Description and Image */}
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <h4 className="text-center mb-4">Description</h4>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Enter product description..."
                                    className="w-full h-48 bg-[#2a2a2a] border border-gray-600 rounded p-4 text-white resize-none"
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-80 h-48 bg-gray-700 rounded overflow-hidden relative">
                                    {productImages.length > 0 ? (
                                        <img src={productImages[currentImageIndex]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                            Product Image
                                        </div>
                                    )}
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❮
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❯
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-2 mb-8">
                            <ActionButton onClick={() => { setSelectedProduct(null); resetForm(); }}>Add</ActionButton>
                            <ActionButton onClick={() => imageInputRef.current?.click()}>Upload Image</ActionButton>
                            <ActionButton onClick={handleSave}>Save</ActionButton>
                        </div>

                        {/* Stone Properties */}
                        <h4 className="text-center mb-4">Overview of Natural Stone Properties</h4>
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div className="border border-gray-600 rounded">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Origin</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.origin}
                                                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                                                    placeholder="Brazil"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Grade</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.grade}
                                                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                                    placeholder="Premium / Export Grade"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Compression Strength</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.compressionStrength}
                                                    onChange={(e) => setFormData({...formData, compressionStrength: e.target.value})}
                                                    placeholder="153 MPa"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Impact Test</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.impactTest}
                                                    onChange={(e) => setFormData({...formData, impactTest: e.target.value})}
                                                    placeholder="Not Published"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Bulk Density</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.bulkDensity}
                                                    onChange={(e) => setFormData({...formData, bulkDensity: e.target.value})}
                                                    placeholder="2,635 kg/m³"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Water Absorption</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.waterAbsorption}
                                                    onChange={(e) => setFormData({...formData, waterAbsorption: e.target.value})}
                                                    placeholder="0.2-0.25%"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-600">
                                            <td className="p-3 text-[#d4a853]">Thermal Expansion</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.thermalExpansion}
                                                    onChange={(e) => setFormData({...formData, thermalExpansion: e.target.value})}
                                                    placeholder="Very Low / High Stability"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-[#d4a853]">Flexural Strength</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={formData.flexuralStrength}
                                                    onChange={(e) => setFormData({...formData, flexuralStrength: e.target.value})}
                                                    placeholder="11.40 MPa"
                                                    className="bg-transparent text-[#d4a853] w-full"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-80 h-64 bg-gray-700 rounded overflow-hidden relative">
                                    {productImages.length > 0 ? (
                                        <img src={productImages[currentImageIndex]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                            Stone Image
                                        </div>
                                    )}
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❮
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❯
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-start gap-2 mb-8">
                            <ActionButton onClick={() => { setSelectedProduct(null); resetForm(); }}>Add</ActionButton>
                            <ActionButton onClick={() => imageInputRef.current?.click()}>Edit</ActionButton>
                            <ActionButton onClick={handleSave}>Save</ActionButton>
                        </div>

                        {/* Quality Section */}
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div className="flex items-center justify-center">
                                <div className="w-80 h-64 bg-gray-700 rounded overflow-hidden relative">
                                    {productImages.length > 0 ? (
                                        <img src={productImages[currentImageIndex]} alt="" className="w-full h-full object-cover" />
                                    ) : null}
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❮
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl hover:scale-125 cursor-pointer"
                                    >
                                        ❯
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <h3 className="text-3xl italic text-[#d4a853]/50">Exceptional Quality You Can Trust</h3>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-2 mb-8">
                            <ActionButton onClick={() => { setSelectedProduct(null); resetForm(); }}>Add</ActionButton>
                            <ActionButton onClick={() => imageInputRef.current?.click()}>Edit</ActionButton>
                            <ActionButton onClick={handleSave}>Save</ActionButton>
                        </div>

                        {/* List of Images */}
                        <div className="mb-6">
                            <h4 className="text-center mb-4 border-b border-gray-600 pb-2">List of Images</h4>
                            <table className="w-full max-w-md mx-auto">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="p-2 text-left">Image Description</th>
                                        <th className="p-2 text-left">New Arrival</th>
                                        <th className="p-2 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productImages.length > 0 ? productImages.map((imgUrl, index) => (
                                        <tr key={index} className="border-b border-gray-600">
                                            <td className="p-2">Image {index + 1}</td>
                                            <td className="p-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="accent-[#d4a853]"
                                                    checked={formData.isNewArrival}
                                                    onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <div className="flex gap-2">
                                                    <ActionButton onClick={() => window.open(imgUrl, '_blank')}>View</ActionButton>
                                                    <ActionButton onClick={() => setCurrentImageIndex(index)}>Edit</ActionButton>
                                                    <ActionButton onClick={() => handleDeleteImage(index)}>Delete</ActionButton>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr className="border-b border-gray-600">
                                            <td className="p-2 text-gray-500" colSpan="3">No images uploaded. Click "Upload Image" to add.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            {/* Upload button at bottom of image list */}
                            <div className="flex justify-center mt-4">
                                <ActionButton onClick={() => imageInputRef.current?.click()}>+ Upload Image</ActionButton>
                            </div>
                        </div>

                        {/* Delete Product Button */}
                        {selectedProduct && (
                            <div className="flex justify-center mt-4">
                                <button 
                                    onClick={() => handleDelete(selectedProduct._id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                                >
                                    Delete Product
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add New Product Button */}
            {!isEditing && (
                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setSelectedProduct(null);
                            resetForm();
                        }}
                        className="bg-[#d4a853] text-black px-6 py-2 rounded font-medium hover:bg-[#c49743] cursor-pointer"
                    >
                        + Add New Product
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
