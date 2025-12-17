import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Products = () => {
    const [activeTab, setActiveTab] = useState('collections');
    const [collections, setCollections] = useState([
        { id: 1, name: 'Marble Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 2, name: 'Marble Bookmatch Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 3, name: 'Onyx Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 4, name: 'Exotic Colors Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 5, name: 'Granite Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 6, name: 'Travertine Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 7, name: 'Limestone Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 8, name: 'Sandstone Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 9, name: 'Slate Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 10, name: 'Engineered Marble Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 11, name: 'Quartz Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
        { id: 12, name: 'Terrazzo Series', image: '', tagline1: 'Where Luxury Meets the Art of Nature', tagline2: 'The Journey of a Stone That Defines', tagline3: 'Application, Care & Finish' },
    ]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [productImages, setProductImages] = useState([]);

    // Product form data matching the UI
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
        // Stone Properties
        grade: '',
        compressionStrength: '',
        impactTest: '',
        bulkDensity: '',
        waterAbsorption: '',
        thermalExpansion: '',
        flexuralStrength: '',
        // Images
        images: [],
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

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
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
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const data = { ...formData, images: productImages };
            if (selectedProduct) {
                await api.put(`/products/${selectedProduct._id}`, data);
            } else {
                await api.post('/products', data);
            }
            fetchProducts();
            setIsEditing(false);
            setSelectedProduct(null);
        } catch (err) {
            console.error('Error saving product:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
            }
        }
    };

    const ActionButton = ({ onClick, children, variant = 'primary' }) => (
        <button
            onClick={onClick}
            className={`px-4 py-1.5 text-sm font-medium rounded ${
                variant === 'primary' ? 'bg-[#d4a853] text-black hover:bg-[#c49743]' :
                variant === 'danger' ? 'bg-[#d4a853] text-black hover:bg-[#c49743]' :
                'bg-[#d4a853] text-black hover:bg-[#c49743]'
            } transition-colors cursor-pointer`}
        >
            {children}
        </button>
    );

    const MenuButton = ({ onClick }) => (
        <button onClick={onClick} className="p-2 text-[#d4a853] hover:bg-[#3a3a3a] rounded cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"/>
            </svg>
        </button>
    );

    return (
        <div className="text-white">
            {/* Collections Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-lg font-semibold">Collection</h2>
                    <button className="text-[#d4a853] hover:underline text-sm cursor-pointer">+ Category</button>
                </div>

                <div className="bg-[#1a1a1a] rounded border border-gray-700">
                    <table className="w-full">
                        <tbody>
                            {collections.map((collection, index) => (
                                <tr key={collection.id} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-3 w-12 text-center text-gray-400">{index + 1}</td>
                                    <td className="p-3 w-20">
                                        <div className="w-16 h-12 bg-gray-700 rounded overflow-hidden">
                                            {collection.image && <img src={collection.image} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium">{collection.name}</td>
                                    <td className="p-3 text-gray-400 text-sm">{collection.tagline1}</td>
                                    <td className="p-3 text-gray-400 text-sm">{collection.tagline2}</td>
                                    <td className="p-3 text-gray-400 text-sm">{collection.tagline3}</td>
                                    <td className="p-3 w-12"><MenuButton /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 flex justify-end gap-2 border-t border-gray-700">
                        <ActionButton>Add</ActionButton>
                        <ActionButton>Edit</ActionButton>
                        <ActionButton>Save</ActionButton>
                    </div>
                </div>
            </div>

            {/* SPILL Section - Import Format */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">SPILL</h3>
                <h4 className="text-center text-gray-400 mb-4">Import Product Detail (Excel Import Format)</h4>
                <div className="bg-[#1a1a1a] rounded border border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3 text-left">Code</th>
                                <th className="p-3 text-left">Product Name</th>
                                <th className="p-3 text-left">Color</th>
                                <th className="p-3 text-left">Origin</th>
                                <th className="p-3 text-left">Is Bookmatch</th>
                                <th className="p-3 text-left">Is Translucent</th>
                                <th className="p-3 text-left">Is Natural</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-700">
                                <td className="p-3">SG01099</td>
                                <td className="p-3">Light Emperador</td>
                                <td className="p-3">Beige</td>
                                <td className="p-3">Turkey</td>
                                <td className="p-3">Yes</td>
                                <td className="p-3">No</td>
                                <td className="p-3">Yes</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
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
                                    {formData.images?.[0] ? (
                                        <img src={formData.images[0]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                            Product Image
                                        </div>
                                    )}
                                    <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl">«</button>
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl">»</button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-2 mb-8">
                            <ActionButton onClick={() => { setSelectedProduct(null); setFormData({...formData, code: '', name: ''}); }}>Add</ActionButton>
                            <ActionButton>Edit</ActionButton>
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
                                    {formData.images?.[0] ? (
                                        <img src={formData.images[0]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                            Stone Image
                                        </div>
                                    )}
                                    <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl">«</button>
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl">»</button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-start gap-2 mb-8">
                            <ActionButton>Add</ActionButton>
                            <ActionButton>Edit</ActionButton>
                            <ActionButton onClick={handleSave}>Save</ActionButton>
                        </div>

                        {/* Quality Section */}
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div className="flex items-center justify-center">
                                <div className="w-80 h-64 bg-gray-700 rounded overflow-hidden relative">
                                    <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl">«</button>
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#d4a853] text-2xl">»</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <h3 className="text-3xl italic text-[#d4a853]/50">Exceptional Quality You Can Trust</h3>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-2 mb-8">
                            <ActionButton>Add</ActionButton>
                            <ActionButton>Edit</ActionButton>
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
                                    {['250001', '250002', '242541', '236524'].map((imgId) => (
                                        <tr key={imgId} className="border-b border-gray-600">
                                            <td className="p-2">{imgId}</td>
                                            <td className="p-2">
                                                <input type="checkbox" className="accent-[#d4a853]" />
                                            </td>
                                            <td className="p-2">
                                                <div className="flex gap-2">
                                                    <ActionButton>View</ActionButton>
                                                    <ActionButton>Edit</ActionButton>
                                                    <ActionButton>Delete</ActionButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
