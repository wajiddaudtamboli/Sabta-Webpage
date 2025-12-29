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
    
    // Excel import refs and state
    const excelInputRef = useRef(null);
    const [importPreview, setImportPreview] = useState([]);
    const [showImportPreview, setShowImportPreview] = useState(false);
    
    // Dropdown menu state
    const [openMenuId, setOpenMenuId] = useState(null);
    
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
            const response = await api.get('/collections/admin');
            console.log('Collections loaded:', response.data);
            setCollections(response.data);
        } catch (error) {
            console.error('Error fetching collections:', error);
            // Try public endpoint as fallback
            try {
                const fallbackResponse = await api.get('/collections');
                setCollections(fallbackResponse.data);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
    };

    // Fetch products (optionally by collection)
    const fetchProducts = async (collectionId = null, collectionName = null) => {
        setLoading(true);
        try {
            let url = '/products/admin';
            const params = new URLSearchParams();
            
            if (collectionId && collectionName) {
                params.append('collectionId', collectionId);
                params.append('collectionName', collectionName);
            } else {
                // Show all products when no collection selected
                params.append('showAll', 'true');
            }
            
            url += '?' + params.toString();
            
            console.log('Fetching products from:', url);
            const response = await api.get(url);
            console.log('Products loaded:', response.data.length, response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Try public endpoint as fallback
            try {
                const fallbackResponse = await api.get('/products');
                setProducts(fallbackResponse.data);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
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
        fetchProducts(collection._id, collection.name);
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
        // Validate required fields
        if (!formData.name || formData.name.trim() === '') {
            alert('Product name is required!');
            return;
        }
        
        setLoading(true);
        try {
            const productData = {
                ...formData,
                collectionId: selectedCollection?._id,
                collectionName: selectedCollection?.name || formData.collectionName,
                images: productImages,
                category: selectedCollection?.name || formData.category || 'General'
            };
            
            console.log('Saving product data:', productData);
            
            let response;
            if (selectedProduct) {
                // Update existing product
                response = await api.put(`/products/${selectedProduct._id}`, productData);
                alert('Product updated successfully!');
            } else {
                // Create new product
                response = await api.post('/products', productData);
                alert('Product created successfully!');
            }
            
            console.log('Save response:', response.data);
            
            // Refresh products list
            if (selectedCollection) {
                fetchProducts(selectedCollection._id, selectedCollection.name);
            } else {
                fetchProducts(); // Load all products
            }
            
            // Reset form
            setIsEditing(false);
            setSelectedProduct(null);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            console.error('Error details:', error.response?.data);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            alert('Error saving product: ' + errorMsg);
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
            if (selectedCollection) {
                fetchProducts(selectedCollection._id, selectedCollection.name);
            } else {
                fetchProducts();
            }
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
            category: selectedCollection?.name || '',
            collectionName: selectedCollection?.name || 'Natural Stone Collections by SABTA GRANITE',
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

    // Handle Excel/CSV file import
    const handleExcelImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target.result;
                const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
                
                // First row is header
                const headers = rows[0].map(h => h.toLowerCase());
                const dataRows = rows.slice(1).filter(row => row.some(cell => cell));
                
                // Map columns to product fields
                const columnMap = {
                    'code': ['code', 'product code', 'sku'],
                    'name': ['name', 'product name', 'title'],
                    'color': ['color', 'colour'],
                    'origin': ['origin', 'country'],
                    'isBookmatch': ['is bookmatch', 'bookmatch', 'isbookmatch'],
                    'isTranslucent': ['is translucent', 'translucent', 'istranslucent'],
                    'isNatural': ['is natural', 'natural', 'isnatural'],
                    'description': ['description', 'desc'],
                    'grade': ['grade'],
                };
                
                const findColumnIndex = (field) => {
                    const possibleNames = columnMap[field] || [field.toLowerCase()];
                    return headers.findIndex(h => possibleNames.some(n => h.includes(n)));
                };
                
                const preview = dataRows.map((row, idx) => ({
                    rowNum: idx + 1,
                    code: row[findColumnIndex('code')] || '',
                    name: row[findColumnIndex('name')] || '',
                    color: row[findColumnIndex('color')] || '',
                    origin: row[findColumnIndex('origin')] || '',
                    isBookmatch: ['yes', 'true', '1'].includes((row[findColumnIndex('isBookmatch')] || '').toLowerCase()),
                    isTranslucent: ['yes', 'true', '1'].includes((row[findColumnIndex('isTranslucent')] || '').toLowerCase()),
                    isNatural: ['yes', 'true', '1', ''].includes((row[findColumnIndex('isNatural')] || 'yes').toLowerCase()),
                    description: row[findColumnIndex('description')] || '',
                    grade: row[findColumnIndex('grade')] || '',
                })).filter(p => p.name); // Only include rows with a name
                
                setImportPreview(preview);
                setShowImportPreview(true);
                setLoading(false);
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file: ' + error.message);
            setLoading(false);
        }
        
        // Reset file input
        if (excelInputRef.current) {
            excelInputRef.current.value = '';
        }
    };
    
    // Confirm and save imported products
    const confirmImport = async () => {
        if (!selectedCollection) {
            alert('Please select a collection first before importing products.');
            return;
        }
        
        setLoading(true);
        let successCount = 0;
        let errorCount = 0;
        
        for (const product of importPreview) {
            try {
                await api.post('/products', {
                    ...product,
                    collectionId: selectedCollection._id,
                    collectionName: selectedCollection.name,
                    category: selectedCollection.name,
                    status: 'active',
                    images: []
                });
                successCount++;
            } catch (error) {
                console.error('Error importing product:', product.name, error);
                errorCount++;
            }
        }
        
        setLoading(false);
        setShowImportPreview(false);
        setImportPreview([]);
        
        alert(`Import complete!\nSuccessful: ${successCount}\nFailed: ${errorCount}`);
        fetchProducts(selectedCollection._id, selectedCollection.name);
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

    // Menu Button Component with dropdown
    const MenuButton = ({ product, onEdit, onDelete, onView }) => {
        const isOpen = openMenuId === product?._id;
        
        const toggleMenu = (e) => {
            e.stopPropagation();
            setOpenMenuId(isOpen ? null : product?._id);
        };
        
        const handleAction = (action, e) => {
            e.stopPropagation();
            setOpenMenuId(null);
            action();
        };
        
        return (
            <div className="relative">
                <button onClick={toggleMenu} className="text-[#d4a853] hover:text-[#c49743] cursor-pointer p-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-[#2a2a2a] border border-gray-600 rounded shadow-lg z-50 min-w-[120px]">
                        {onView && (
                            <button
                                onClick={(e) => handleAction(onView, e)}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a] cursor-pointer"
                            >
                                👁️ View
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={(e) => handleAction(onEdit, e)}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a] cursor-pointer"
                            >
                                ✏️ Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => handleAction(onDelete, e)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3a3a3a] cursor-pointer"
                            >
                                🗑️ Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="p-2 md:p-6 text-white min-h-screen w-full max-w-full overflow-x-hidden">
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
                    <button
                        onClick={() => { setSelectedCollection(null); fetchProducts(); }}
                        className={`ml-auto px-4 py-1 text-sm rounded cursor-pointer ${!selectedCollection ? 'bg-[#d4a853] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                    >
                        View All Products
                    </button>
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
                                    className={`border-b border-gray-700 hover:bg-[#2a2a2a] cursor-pointer ${selectedCollection?._id === collection._id ? 'bg-[#2a2a2a] border-l-2 border-l-[#d4a853]' : ''}`}
                                    onClick={() => handleCollectionSelect(collection)}
                                >
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3 font-medium">{collection.name}</td>
                                    <td className="p-3">{collection.displayOrder || index + 1}</td>
                                    <td className="p-3">
                                        <span className="bg-[#d4a853]/20 text-[#d4a853] px-2 py-1 rounded text-xs font-medium">
                                            {collection.productCount || 0}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${collection.status === 'active' || !collection.status ? 'bg-green-600' : 'bg-gray-600'}`}>
                                            {collection.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleCollectionSelect(collection); }}
                                            className="text-[#d4a853] hover:text-[#c49743] cursor-pointer text-sm"
                                        >
                                            Select →
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr className="border-b border-gray-700">
                                    <td colSpan="6" className="p-6 text-center text-gray-500">
                                        Loading collections from database...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SPILL / Excel Import Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-semibold">SPILL</span>
                    <span className="text-[#d4a853] text-sm italic ml-2">- Import products from CSV/Excel file. Format: Code, Product Name, Color, Origin, Is Bookmatch, Is Translucent</span>
                    <input
                        type="file"
                        ref={excelInputRef}
                        onChange={handleExcelImport}
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                    />
                    <button
                        onClick={() => excelInputRef.current?.click()}
                        className="ml-auto bg-[#d4a853] text-black px-4 py-1 text-sm rounded hover:bg-[#c49743] cursor-pointer"
                    >
                        📁 Import CSV
                    </button>
                </div>

                <div className="bg-[#1a1a1a] rounded border border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700 bg-[#2a2a2a]">
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
                            {showImportPreview && importPreview.length > 0 ? (
                                importPreview.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-700 bg-green-900/20">
                                        <td className="p-3">{item.rowNum}</td>
                                        <td className="p-3">{item.code || 'Auto'}</td>
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.color}</td>
                                        <td className="p-3">{item.origin}</td>
                                        <td className="p-3">{item.isBookmatch ? 'Yes' : 'No'}</td>
                                        <td className="p-3">{item.isTranslucent ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))
                            ) : (
                                <>
                                    <tr className="border-b border-gray-700 text-gray-500">
                                        <td className="p-3">1</td>
                                        <td className="p-3">SG01099</td>
                                        <td className="p-3">Light Emperador</td>
                                        <td className="p-3">Beige</td>
                                        <td className="p-3">Turkey</td>
                                        <td className="p-3">Yes</td>
                                        <td className="p-3">No</td>
                                    </tr>
                                    <tr className="border-b border-gray-700 text-gray-500">
                                        <td className="p-3">2</td>
                                        <td className="p-3">SG01100</td>
                                        <td className="p-3">Dark Emperador</td>
                                        <td className="p-3">Brown</td>
                                        <td className="p-3">Spain</td>
                                        <td className="p-3">No</td>
                                        <td className="p-3">No</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="7" className="p-3 text-center text-gray-500 text-xs">
                                            ↑ Example format. Click "Import CSV" to upload your file.
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                    
                    {showImportPreview && importPreview.length > 0 && (
                        <div className="p-4 border-t border-gray-700 flex gap-4 justify-center">
                            <button
                                onClick={confirmImport}
                                disabled={!selectedCollection}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                            >
                                ✅ Import {importPreview.length} Products {selectedCollection ? `to "${selectedCollection.name}"` : '(Select Collection First)'}
                            </button>
                            <button
                                onClick={() => { setShowImportPreview(false); setImportPreview([]); }}
                                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 cursor-pointer"
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    )}
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
                                        <MenuButton 
                                            product={product}
                                            onView={() => {
                                                // Open product detail in new tab
                                                window.open(`/products/${product.slug || product._id}`, '_blank');
                                            }}
                                            onEdit={() => handleProductSelect(product)}
                                            onDelete={() => handleDelete(product._id)}
                                        />
                                    </td>
                                </tr>
                            )) : (
                                <tr className="border-b border-gray-700">
                                    <td colSpan="10" className="p-6 text-center text-gray-500">
                                        {selectedCollection 
                                            ? 'No products in this collection. Click "+ Add New Product" to create one.'
                                            : 'Select a collection above to view its products, or click "+ Add New Product" to create one.'}
                                    </td>
                                </tr>
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

                        {/* Basic Product Properties */}
                        <h4 className="text-center mb-4">Basic Product Properties</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-[#2a2a2a] rounded">
                            <div>
                                <label className="block text-[#d4a853] text-sm mb-1">Color</label>
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                                    placeholder="Beige, Brown, etc."
                                    className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isBookmatch"
                                    checked={formData.isBookmatch}
                                    onChange={(e) => setFormData({...formData, isBookmatch: e.target.checked})}
                                    className="accent-[#d4a853] w-5 h-5"
                                />
                                <label htmlFor="isBookmatch" className="text-[#d4a853]">Is Bookmatch</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isTranslucent"
                                    checked={formData.isTranslucent}
                                    onChange={(e) => setFormData({...formData, isTranslucent: e.target.checked})}
                                    className="accent-[#d4a853] w-5 h-5"
                                />
                                <label htmlFor="isTranslucent" className="text-[#d4a853]">Is Translucent</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isNatural"
                                    checked={formData.isNatural}
                                    onChange={(e) => setFormData({...formData, isNatural: e.target.checked})}
                                    className="accent-[#d4a853] w-5 h-5"
                                />
                                <label htmlFor="isNatural" className="text-[#d4a853]">Is Natural</label>
                            </div>
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
