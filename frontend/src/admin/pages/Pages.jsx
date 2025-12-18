import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

// SVG Icons
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
);

const AboutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ContactIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const Pages = () => {
    const [selectedPage, setSelectedPage] = useState('home');
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const pages = [
        { id: 'home', name: 'Home Page', icon: <HomeIcon /> },
        { id: 'about', name: 'About Page', icon: <AboutIcon /> },
        { id: 'contact', name: 'Contact Page', icon: <ContactIcon /> },
    ];

    // Default content structures
    const defaultContent = {
        home: {
            heroSlides: [
                { heading: "Where Nature's Beauty Meets Expert Craftsmanship", subtext: "Premium stone solutions", image: "", button: "Get Started" },
                { heading: "Premium Marble and Stone Designed to Elevate Your Interiors", subtext: "Solutions tailored for your brand", image: "", button: "View Services" },
                { heading: "Classic Design and Enduring Strength for Modern Spaces", subtext: "Delivering quality, speed & results", image: "", button: "Contact Us" }
            ],
            introTitle: "Why Sabta Granite Is the UAE's Trusted Choice for Premium Marble and Natural Stone",
            introText: "Marble brings a sense of luxury, elegance and lasting beauty to any space. At Sabta Granite, we supply a wide range of natural and engineered surfaces to projects across the UAE.",
            introImage: ""
        },
        about: {
            title: "About Us",
            whoWeAre: "Founded in 2003, SABTA is one of the UAE's most trusted suppliers of natural stone...",
            capabilities: "All fabrication and finishing processes are managed in-house...",
            globalSourcing: "Our materials are sourced from the finest quarries worldwide..."
        },
        contact: {
            title: "Contact Us",
            address: "Dubai, UAE",
            phone: "+971 XXXXXXXXX",
            email: "info@sabtagranite.com",
            mapUrl: ""
        }
    };

    useEffect(() => {
        fetchPageData(selectedPage);
    }, [selectedPage]);

    const fetchPageData = async (pageName) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.get(`/pages/${pageName}`);
            // Merge with defaults to ensure all fields exist
            const content = { ...defaultContent[pageName], ...res.data?.content };
            setPageData({ ...res.data, content });
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setPageData({ name: pageName, content: defaultContent[pageName] });
            } else {
                console.error('Error fetching page:', err);
                setPageData({ name: pageName, content: defaultContent[pageName] });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/pages/${selectedPage}`, pageData);
            setMessage({ type: 'success', text: 'Page saved successfully! Changes will reflect on the website.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error('Error saving page:', err);
            setMessage({ type: 'error', text: 'Error saving page. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleContentChange = (key, value) => {
        setPageData({
            ...pageData,
            content: {
                ...pageData.content,
                [key]: value
            }
        });
    };

    const handleSlideChange = (index, field, value) => {
        const newSlides = [...(pageData.content.heroSlides || [])];
        newSlides[index] = { ...newSlides[index], [field]: value };
        handleContentChange('heroSlides', newSlides);
    };

    const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
        <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">{label}</label>
            <input
                type={type}
                className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );

    const TextAreaField = ({ label, value, onChange, rows = 4, placeholder = '' }) => (
        <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">{label}</label>
            <textarea
                className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none resize-none"
                rows={rows}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="text-white max-w-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 px-4 md:px-0">
                <span className="text-[#d4a853]">Dynamic</span> Page Manager
            </h1>

            {message.text && (
                <div className={`p-4 mx-4 md:mx-0 rounded mb-4 md:mb-6 text-sm md:text-base ${message.type === 'success' ? 'bg-green-900/50 border border-green-500 text-green-300' : 'bg-red-900/50 border border-red-500 text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Page Selector */}
                <div className="bg-[#2a2a2a] mx-4 md:mx-0 rounded border border-gray-700 p-4">
                    <h2 className="text-lg font-semibold mb-4 text-[#d4a853]">Select Page</h2>
                    <div className="space-y-2">
                        {pages.map(page => (
                            <button
                                key={page.id}
                                onClick={() => setSelectedPage(page.id)}
                                className={`w-full text-left p-3 rounded transition-colors cursor-pointer ${
                                    selectedPage === page.id 
                                        ? 'bg-[#d4a853] text-black' 
                                        : 'bg-[#1a1a1a] hover:bg-[#3a3a3a] text-white'
                                }`}
                            >
                                <span className="mr-3 inline-flex">{page.icon}</span>
                                {page.name}
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-6 p-3 bg-blue-900/30 border border-blue-700 rounded text-sm text-blue-300">
                        <strong>Tip:</strong> Changes saved here will immediately update your website content.
                    </div>
                </div>

                {/* Page Editor */}
                <div className="lg:col-span-3 bg-[#2a2a2a] mx-4 md:mx-0 rounded border border-gray-700 p-4 md:p-6">
                    {loading ? (
                        <div className="text-center text-gray-400 py-8">Loading...</div>
                    ) : pageData && (
                        <>
                            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-[#d4a853] capitalize">
                                Edit {selectedPage} Page Content
                            </h2>
                            <form onSubmit={handleSave}>
                                {/* HOME PAGE EDITOR */}
                                {selectedPage === 'home' && (
                                    <>
                                        {/* Hero Slides Section */}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                                                Hero Banner Slides
                                            </h3>
                                            {(pageData.content.heroSlides || defaultContent.home.heroSlides).map((slide, index) => (
                                                <div key={index} className="bg-[#1a1a1a] p-4 rounded mb-4 border border-gray-700">
                                                    <h4 className="text-[#d4a853] mb-3">Slide {index + 1}</h4>
                                                    <InputField
                                                        label="Heading"
                                                        value={slide.heading}
                                                        onChange={(e) => handleSlideChange(index, 'heading', e.target.value)}
                                                        placeholder="Enter slide heading..."
                                                    />
                                                    <InputField
                                                        label="Subtext"
                                                        value={slide.subtext}
                                                        onChange={(e) => handleSlideChange(index, 'subtext', e.target.value)}
                                                        placeholder="Enter subtext..."
                                                    />
                                                    <InputField
                                                        label="Background Image URL (optional - leave empty for default)"
                                                        value={slide.image}
                                                        onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                                                        placeholder="https://... (Cloudinary URL recommended)"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Introduction Section */}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                                                Introduction Section
                                            </h3>
                                            <InputField
                                                label="Section Title"
                                                value={pageData.content.introTitle}
                                                onChange={(e) => handleContentChange('introTitle', e.target.value)}
                                                placeholder="Enter introduction title..."
                                            />
                                            <TextAreaField
                                                label="Introduction Text"
                                                value={pageData.content.introText}
                                                onChange={(e) => handleContentChange('introText', e.target.value)}
                                                rows={5}
                                                placeholder="Enter introduction paragraph..."
                                            />
                                            <InputField
                                                label="Introduction Image URL"
                                                value={pageData.content.introImage}
                                                onChange={(e) => handleContentChange('introImage', e.target.value)}
                                                placeholder="https://... (Cloudinary URL)"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* ABOUT PAGE EDITOR */}
                                {selectedPage === 'about' && (
                                    <>
                                        <InputField
                                            label="Page Title"
                                            value={pageData.content.title}
                                            onChange={(e) => handleContentChange('title', e.target.value)}
                                            placeholder="About Us"
                                        />
                                        <TextAreaField
                                            label="Who We Are Section"
                                            value={pageData.content.whoWeAre}
                                            onChange={(e) => handleContentChange('whoWeAre', e.target.value)}
                                            rows={6}
                                            placeholder="Enter company description..."
                                        />
                                        <TextAreaField
                                            label="Comprehensive Capabilities"
                                            value={pageData.content.capabilities}
                                            onChange={(e) => handleContentChange('capabilities', e.target.value)}
                                            rows={4}
                                            placeholder="Enter capabilities description..."
                                        />
                                        <TextAreaField
                                            label="Global Sourcing"
                                            value={pageData.content.globalSourcing}
                                            onChange={(e) => handleContentChange('globalSourcing', e.target.value)}
                                            rows={4}
                                            placeholder="Enter global sourcing description..."
                                        />
                                    </>
                                )}

                                {/* CONTACT PAGE EDITOR */}
                                {selectedPage === 'contact' && (
                                    <>
                                        <InputField
                                            label="Page Title"
                                            value={pageData.content.title}
                                            onChange={(e) => handleContentChange('title', e.target.value)}
                                            placeholder="Contact Us"
                                        />
                                        <TextAreaField
                                            label="Address"
                                            value={pageData.content.address}
                                            onChange={(e) => handleContentChange('address', e.target.value)}
                                            rows={3}
                                            placeholder="Enter full address..."
                                        />
                                        <InputField
                                            label="Phone Number"
                                            value={pageData.content.phone}
                                            onChange={(e) => handleContentChange('phone', e.target.value)}
                                            placeholder="+971 XXXXXXXXX"
                                        />
                                        <InputField
                                            label="Email Address"
                                            value={pageData.content.email}
                                            onChange={(e) => handleContentChange('email', e.target.value)}
                                            placeholder="info@sabtagranite.com"
                                        />
                                        <InputField
                                            label="WhatsApp Number"
                                            value={pageData.content.whatsapp}
                                            onChange={(e) => handleContentChange('whatsapp', e.target.value)}
                                            placeholder="+971XXXXXXXXX (no spaces)"
                                        />
                                        <InputField
                                            label="Google Maps Embed URL"
                                            value={pageData.content.mapUrl}
                                            onChange={(e) => handleContentChange('mapUrl', e.target.value)}
                                            placeholder="https://www.google.com/maps/embed?..."
                                        />
                                    </>
                                )}

                                <div className="mt-6 flex gap-4">
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="px-6 py-3 bg-[#d4a853] text-black font-semibold rounded hover:bg-[#c49743] transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => fetchPageData(selectedPage)}
                                        className="px-6 py-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pages;
