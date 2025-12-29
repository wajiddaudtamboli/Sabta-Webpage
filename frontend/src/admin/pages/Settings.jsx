import { useState, useEffect, useRef } from 'react';
import { HiSave, HiTrash, HiUpload } from 'react-icons/hi';
import { api } from '../../api/api';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('logo');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    
    const [logo, setLogo] = useState({ url: '/Sabta_Logo.png' });
    const [footer, setFooter] = useState({
        description: '',
        qrCode: '/LocationQR.jpeg'
    });
    const [social, setSocial] = useState({
        facebook: '',
        instagram: '',
        twitter: '',
        pinterest: '',
        linkedin: ''
    });
    const [contact, setContact] = useState({
        address: '',
        phone1: '',
        phone2: '',
        email: '',
        mapUrl: ''
    });
    const [newsletter, setNewsletter] = useState([]);

    const logoInputRef = useRef(null);
    const qrInputRef = useRef(null);

    const tabs = [
        { id: 'logo', label: 'Logo' },
        { id: 'footer', label: 'Footer' },
        { id: 'social', label: 'Social Media' },
        { id: 'contact', label: 'Contact Info' },
        { id: 'newsletter', label: 'Newsletter' }
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const [logoRes, footerRes, socialRes, contactRes, newsletterRes] = await Promise.all([
                api.get('/settings/logo'),
                api.get('/settings/footer'),
                api.get('/settings/social'),
                api.get('/settings/contact'),
                api.get('/newsletter').catch(() => ({ data: [] }))
            ]);
            
            setLogo(logoRes.data.value || { url: '/Sabta_Logo.png' });
            setFooter(footerRes.data.value || { description: '', qrCode: '/LocationQR.jpeg' });
            setSocial(socialRes.data.value || {});
            setContact(contactRes.data.value || {});
            setNewsletter(newsletterRes.data || []);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSetting = async (key, value) => {
        setLoading(true);
        try {
            await api.put(`/settings/${key}`, { value });
            setMessage({ type: 'success', text: `${key.charAt(0).toUpperCase() + key.slice(1)} settings saved!` });
        } catch (error) {
            console.error('Error saving setting:', error);
            setMessage({ type: 'error', text: 'Error saving settings' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.url) {
                if (type === 'logo') {
                    setLogo({ ...logo, url: response.data.url });
                } else if (type === 'qr') {
                    setFooter({ ...footer, qrCode: response.data.url });
                }
                setMessage({ type: 'success', text: 'Image uploaded!' });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: 'Error uploading image' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const deleteSubscriber = async (id) => {
        if (!window.confirm('Delete this subscriber?')) return;
        
        try {
            await api.delete(`/newsletter/${id}`);
            setNewsletter(newsletter.filter(s => s._id !== id));
            setMessage({ type: 'success', text: 'Subscriber deleted' });
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            setMessage({ type: 'error', text: 'Error deleting subscriber' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    return (
        <div className="p-4 md:p-6 text-white min-h-screen">
            {/* Hidden file inputs */}
            <input type="file" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} accept="image/*" className="hidden" />
            <input type="file" ref={qrInputRef} onChange={(e) => handleImageUpload(e, 'qr')} accept="image/*" className="hidden" />
            
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg">
                        <div className="animate-spin w-8 h-8 border-4 border-[#d4a853] border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-[#d4a853]">Loading...</p>
                    </div>
                </div>
            )}

            <h1 className="text-2xl md:text-3xl font-bold mb-6">
                <span className="text-[#d4a853]">Site</span> Settings
            </h1>

            {}
            {message.text && (
                <div className={`p-4 rounded mb-4 ${message.type === 'success' ? 'bg-green-900/50 border border-green-500 text-green-300' : 'bg-red-900/50 border border-red-500 text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {}
                <div className="bg-[#2a2a2a] rounded border border-gray-700 p-4">
                    <h2 className="text-lg font-semibold mb-4 text-[#d4a853]">Settings</h2>
                    <div className="space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left p-3 rounded transition-colors cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-[#d4a853] text-black'
                                        : 'bg-[#1a1a1a] hover:bg-[#3a3a3a] text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {}
                <div className="lg:col-span-3 bg-[#2a2a2a] rounded border border-gray-700 p-4 md:p-6">
                    {}
                    {activeTab === 'logo' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6 text-[#d4a853]">Logo Management</h2>
                            <p className="text-gray-300 mb-6">Upload your site logo. This will appear in the header, footer, and admin panel.</p>
                            
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className="bg-[#1a1a1a] p-4 rounded">
                                    <p className="text-gray-300 text-sm mb-2">Current Logo Preview:</p>
                                    <img
                                        src={logo.url || '/Sabta_Logo.png'}
                                        alt="Logo"
                                        className="max-w-[200px] h-auto"
                                    />
                                </div>
                                
                                <div className="flex-1">
                                    <button
                                        onClick={() => logoInputRef.current?.click()}
                                        className="bg-[#3a3a3a] text-white px-4 py-2 rounded hover:bg-[#4a4a4a] transition cursor-pointer mb-4 flex items-center gap-2"
                                        title="Upload New Logo"
                                    >
                                        <HiUpload className="w-4 h-4" /> Upload New Logo
                                    </button>
                                    
                                    <div className="mb-4">
                                        <label className="block text-gray-300 text-sm mb-2">Or enter logo URL</label>
                                        <input
                                            type="text"
                                            value={logo.url || ''}
                                            onChange={(e) => setLogo({ ...logo, url: e.target.value })}
                                            className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={() => saveSetting('logo', logo)}
                                        className="bg-[#d4a853] text-black px-6 py-2 rounded hover:bg-[#c49743] transition cursor-pointer flex items-center gap-2"
                                        title="Save Logo"
                                    >
                                        <HiSave className="w-4 h-4" /> Save Logo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {}
                    {activeTab === 'footer' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6 text-[#d4a853]">Footer Settings</h2>
                            
                            <div className="mb-6">
                                <label className="block text-gray-300 text-sm mb-2">Company Description</label>
                                <textarea
                                    value={footer.description || ''}
                                    onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                                    rows={4}
                                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none resize-none"
                                    placeholder="Drawing inspiration from timeless design..."
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-300 text-sm mb-2">Location QR Code</label>
                                <div className="flex items-start gap-4">
                                    <img
                                        src={footer.qrCode || '/LocationQR.jpeg'}
                                        alt="QR Code"
                                        className="w-24 h-24 object-contain rounded border border-gray-600"
                                    />
                                    <div className="flex-1">
                                        <button
                                            onClick={() => qrInputRef.current?.click()}
                                            className="bg-[#3a3a3a] text-white px-4 py-2 rounded hover:bg-[#4a4a4a] transition cursor-pointer mb-2 flex items-center gap-2"
                                            title="Upload New QR"
                                        >
                                            <HiUpload className="w-4 h-4" /> Upload New QR
                                        </button>
                                        <input
                                            type="text"
                                            value={footer.qrCode || ''}
                                            onChange={(e) => setFooter({ ...footer, qrCode: e.target.value })}
                                            className="w-full p-2 bg-[#1a1a1a] border border-gray-600 rounded text-white text-sm focus:border-[#d4a853] focus:outline-none"
                                            placeholder="Or paste QR image URL"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => saveSetting('footer', footer)}
                                className="bg-[#d4a853] text-black px-6 py-2 rounded hover:bg-[#c49743] transition cursor-pointer flex items-center gap-2"
                                title="Save Footer Settings"
                            >
                                <HiSave className="w-4 h-4" /> Save Footer Settings
                            </button>
                        </div>
                    )}

                    {}
                    {activeTab === 'social' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6 text-[#d4a853]">Social Media Links</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {[
                                    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
                                    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
                                    { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
                                    { key: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/...' },
                                    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/...' }
                                ].map(item => (
                                    <div key={item.key}>
                                        <label className="block text-gray-300 text-sm mb-2">{item.label}</label>
                                        <input
                                            type="text"
                                            value={social[item.key] || ''}
                                            onChange={(e) => setSocial({ ...social, [item.key]: e.target.value })}
                                            className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                            placeholder={item.placeholder}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => saveSetting('social', social)}
                                className="bg-[#d4a853] text-black px-6 py-2 rounded hover:bg-[#c49743] transition cursor-pointer flex items-center gap-2"
                                title="Save Social Links"
                            >
                                <HiSave className="w-4 h-4" /> Save Social Links
                            </button>
                        </div>
                    )}

                    {}
                    {activeTab === 'contact' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6 text-[#d4a853]">Contact Information</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={contact.address || ''}
                                        onChange={(e) => setContact({ ...contact, address: e.target.value })}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                        placeholder="P.O. Box : 34390 Industrial Area # 11 Sharjah - UAE"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2">Phone 1</label>
                                        <input
                                            type="text"
                                            value={contact.phone1 || ''}
                                            onChange={(e) => setContact({ ...contact, phone1: e.target.value })}
                                            className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                            placeholder="+971 50 205 0707"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2">Phone 2</label>
                                        <input
                                            type="text"
                                            value={contact.phone2 || ''}
                                            onChange={(e) => setContact({ ...contact, phone2: e.target.value })}
                                            className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                            placeholder="+971 6 535 4704"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={contact.email || ''}
                                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                        placeholder="sale@sabtagranite.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">Google Maps URL</label>
                                    <input
                                        type="text"
                                        value={contact.mapUrl || ''}
                                        onChange={(e) => setContact({ ...contact, mapUrl: e.target.value })}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                        placeholder="https://maps.app.goo.gl/..."
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => saveSetting('contact', contact)}
                                className="bg-[#d4a853] text-black px-6 py-2 rounded hover:bg-[#c49743] transition cursor-pointer flex items-center gap-2"
                                title="Save Contact Info"
                            >
                                <HiSave className="w-4 h-4" /> Save Contact Info
                            </button>
                        </div>
                    )}

                    {}
                    {activeTab === 'newsletter' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6 text-[#d4a853]">Newsletter Subscribers</h2>
                            <p className="text-gray-300 mb-4">Total subscribers: {newsletter.length}</p>
                            
                            {newsletter.length === 0 ? (
                                <p className="text-gray-300 text-center py-8">No subscribers yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="p-3 text-left">#</th>
                                                <th className="p-3 text-left">Email</th>
                                                <th className="p-3 text-left">Subscribed</th>
                                                <th className="p-3 text-left">Status</th>
                                                <th className="p-3 text-left">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newsletter.map((sub, index) => (
                                                <tr key={sub._id} className="border-b border-gray-700">
                                                    <td className="p-3">{index + 1}</td>
                                                    <td className="p-3">{sub.email}</td>
                                                    <td className="p-3">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded text-xs ${sub.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}`}>
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <button
                                                            onClick={() => deleteSubscriber(sub._id)}
                                                            className="text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1"
                                                            title="Delete Subscriber"
                                                            aria-label="Delete Subscriber"
                                                        >
                                                            <HiTrash className="w-4 h-4" /> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
