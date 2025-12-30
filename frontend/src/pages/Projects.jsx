import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaBuilding, FaMapMarkerAlt, FaTag } from 'react-icons/fa';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({ ongoing: 0, completed: 0, awarded: 0, total: 0, byCategory: {} });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [pageData, setPageData] = useState(null);

    
    const [currentSlide, setCurrentSlide] = useState(0);
    const projectsPerSlide = 3;

    const tabs = [
        { id: 'all', label: 'ALL' },
        { id: 'ongoing', label: 'ONGOING' },
        { id: 'completed', label: 'COMPLETED' },
        { id: 'awarded', label: 'AWARDED' }
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'Residential', label: 'Residential' },
        { value: 'Commercial', label: 'Commercial' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Educational', label: 'Educational' },
        { value: 'Government', label: 'Government' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Other', label: 'Other' }
    ];

    useEffect(() => {
        fetchData();
        fetchPageContent();
    }, []);

    const fetchPageContent = async () => {
        try {
            const res = await api.get('/pages/projects');
            setPageData(res.data?.content);
        } catch (error) {
            console.error('Error fetching page content:', error);
        }
    };

    const fetchData = async () => {
        try {
            const [projectsRes, countsRes] = await Promise.all([
                api.get('/projects'),
                api.get('/projects/counts')
            ]);
            setProjects(projectsRes.data);
            setCounts(countsRes.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchByStatus = async (status, category = selectedCategory) => {
        setLoading(true);
        setCurrentSlide(0); 
        try {
            let url = '/projects';
            const params = [];
            if (status !== 'all') params.push(`status=${status}`);
            if (category !== 'all') params.push(`category=${category}`);
            if (params.length > 0) url += '?' + params.join('&');
            const res = await api.get(url);
            setProjects(res.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabId) => {
        setSelectedTab(tabId);
        fetchByStatus(tabId, selectedCategory);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        fetchByStatus(selectedTab, category);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitEnquiry = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/enquiries', {
                ...formData,
                source: 'Projects - Pre-qualification Request'
            });
            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', company: '', message: '' });
            setTimeout(() => {
                setShowModal(false);
                setSubmitStatus(null);
            }, 2000);
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            setSubmitStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    
    const totalSlides = Math.ceil(projects.length / projectsPerSlide);
    
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const getCurrentProjects = () => {
        const start = currentSlide * projectsPerSlide;
        return projects.slice(start, start + projectsPerSlide);
    };

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'ongoing': return 'bg-blue-500/90 text-white';
            case 'completed': return 'bg-green-500/90 text-white';
            case 'awarded': return 'bg-amber-500/90 text-black';
            default: return 'bg-gray-500/90 text-white';
        }
    };

    const getStatusLabel = (status) => {
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : '';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {}
            <section className="relative overflow-hidden">
                {}
                <div className="absolute inset-0 bg-linear-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]" />
                
                {}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
                    <svg viewBox="0 0 500 600" className="h-full w-full" preserveAspectRatio="none">
                        <path
                            d="M100,0 Q0,300 100,600 L500,600 L500,0 Z"
                            fill="#d4a853"
                            fillOpacity="0.1"
                        />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block text-[#d4a853] text-sm font-semibold tracking-wider uppercase mb-4">
                                Our Portfolio
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                {pageData?.heroTitle || 'Projects'}
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
                                {pageData?.heroDescription || 'Explore our portfolio of prestigious projects showcasing excellence in granite and marble craftsmanship across the UAE and beyond.'}
                            </p>
                            
                            {}
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-3xl font-bold text-[#d4a853]">{counts.total || 0}</div>
                                    <div className="text-gray-500 text-sm">Total Projects</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-400">{counts.completed || 0}</div>
                                    <div className="text-gray-500 text-sm">Completed</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-blue-400">{counts.ongoing || 0}</div>
                                    <div className="text-gray-500 text-sm">Ongoing</div>
                                </div>
                            </div>
                        </motion.div>

                        {}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-[#1a1a1a]">
                                    {(projects[0]?.featuredImage || projects[0]?.imageUrl) ? (
                                        <img src={projects[0].featuredImage || projects[0].imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-[#d4a853]/20 to-[#1a1a1a] flex items-center justify-center">
                                            <FaBuilding className="text-4xl text-[#d4a853]/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#1a1a1a]">
                                    {(projects[1]?.featuredImage || projects[1]?.imageUrl) ? (
                                        <img src={projects[1].featuredImage || projects[1].imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-[#d4a853]/10 to-[#1a1a1a] flex items-center justify-center">
                                            <FaBuilding className="text-3xl text-[#d4a853]/20" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#1a1a1a]">
                                    {(projects[2]?.featuredImage || projects[2]?.imageUrl) ? (
                                        <img src={projects[2].featuredImage || projects[2].imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-[#1a1a1a] to-[#d4a853]/10 flex items-center justify-center">
                                            <FaBuilding className="text-3xl text-[#d4a853]/20" />
                                        </div>
                                    )}
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden bg-[#1a1a1a]">
                                    {(projects[3]?.featuredImage || projects[3]?.imageUrl) ? (
                                        <img src={projects[3].featuredImage || projects[3].imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-[#1a1a1a] to-[#d4a853]/20 flex items-center justify-center">
                                            <FaBuilding className="text-4xl text-[#d4a853]/30" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {}
            <section className="py-12 px-4 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-wrap justify-center gap-3"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`
                                    px-6 py-3 rounded-full font-medium text-sm tracking-wider transition-all duration-300 cursor-pointer
                                    ${selectedTab === tab.id 
                                        ? 'bg-[#d4a853] text-black shadow-lg shadow-[#d4a853]/30' 
                                        : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white border border-gray-800'
                                    }
                                `}
                            >
                                {tab.label}
                                {tab.id !== 'all' && (
                                    <span className="ml-2 opacity-70">({counts[tab.id] || 0})</span>
                                )}
                            </button>
                        ))}
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-wrap justify-center gap-2 mt-6"
                    >
                        {categoryOptions.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`
                                    px-4 py-2 rounded-lg text-xs font-medium tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1
                                    ${selectedCategory === cat.value 
                                        ? 'bg-[#2a2a2a] text-[#d4a853] border border-[#d4a853]/50' 
                                        : 'bg-[#0f0f0f] text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 border border-gray-800/50'
                                    }
                                `}
                            >
                                <FaTag className="text-[10px]" />
                                {cat.label}
                                {cat.value !== 'all' && counts.byCategory?.[cat.value] && (
                                    <span className="opacity-70">({counts.byCategory[cat.value]})</span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin w-12 h-12 border-4 border-[#d4a853] border-t-transparent rounded-full"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <FaBuilding className="text-6xl text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl text-gray-400">No projects found</h3>
                            <p className="text-gray-500 mt-2">Check back later for updates</p>
                        </motion.div>
                    ) : (
                        <>
                            {}
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {selectedTab === 'all' ? 'All Projects' : `${getStatusLabel(selectedTab)} Projects`}
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                
                                {}
                                {totalSlides > 1 && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500 text-sm">
                                            {currentSlide + 1} / {totalSlides}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={prevSlide}
                                                className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#d4a853] transition-all cursor-pointer"
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#d4a853] transition-all cursor-pointer"
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide + selectedTab}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.4 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {getCurrentProjects().map((project, index) => (
                                        <motion.div
                                            key={project._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="group"
                                        >
                                            {}
                                            <div className="bg-[#111111] rounded-2xl overflow-hidden border border-gray-800/50 hover:border-[#d4a853]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#d4a853]/10">
                                                {}
                                                <div className="relative aspect-4/3 overflow-hidden">
                                                    {project.imageUrl ? (
                                                        <img 
                                                            src={project.imageUrl} 
                                                            alt={project.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-linear-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                                                            <FaBuilding className="text-5xl text-gray-700" />
                                                        </div>
                                                    )}
                                                    
                                                    {}
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                                                    
                                                    {}
                                                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                                                        <FaCalendarAlt className="text-[#d4a853]" />
                                                        {project.year}
                                                    </div>
                                                    
                                                    {}
                                                    <div className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusBadgeStyle(project.status)}`}>
                                                        {getStatusLabel(project.status)}
                                                    </div>

                                                    {}
                                                    <div className="absolute bottom-4 left-4 right-4">
                                                        <span className="inline-flex items-center gap-1.5 bg-[#d4a853] text-black text-xs font-semibold px-3 py-1.5 rounded-full">
                                                            <FaBuilding className="text-xs" />
                                                            {project.clientName}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {}
                                                <div className="p-5">
                                                    <h3 className="text-lg font-semibold text-white group-hover:text-[#d4a853] transition-colors line-clamp-2 min-h-14">
                                                        {project.title}
                                                    </h3>
                                                    
                                                    {project.location && (
                                                        <p className="text-gray-500 text-sm mt-2 flex items-center gap-1.5">
                                                            <FaMapMarkerAlt className="text-[#d4a853]" />
                                                            {project.location}
                                                        </p>
                                                    )}
                                                    
                                                    {project.description && (
                                                        <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {}
                            {totalSlides > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {Array.from({ length: totalSlides }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentSlide(i)}
                                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                                currentSlide === i 
                                                    ? 'w-8 bg-[#d4a853]' 
                                                    : 'bg-gray-700 hover:bg-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {}
                            {projects.length > projectsPerSlide && (
                                <div className="text-center mt-12">
                                    <button
                                        onClick={() => {
                                            
                                            
                                            setCurrentSlide(0);
                                        }}
                                        className="text-[#d4a853] hover:text-[#e5b963] font-medium transition-colors"
                                    >
                                        View all {projects.length} projects →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {}
            <section className="py-20 px-4 bg-linear-to-r from-[#0a0a0a] via-[#111111] to-[#0a0a0a]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Interested in Working With Us?
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                            Submit your pre-qualification request and our team will get in touch with you to discuss your project requirements.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-[#d4a853] text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#e5b963] transition-all cursor-pointer shadow-lg hover:shadow-[#d4a853]/30 hover:scale-105"
                        >
                            Request for Pre-qualification
                        </button>
                    </motion.div>
                </div>
            </section>

            {}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111111] rounded-2xl p-6 md:p-8 w-full max-w-lg border border-gray-800 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">Pre-qualification Request</h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white text-2xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            {submitStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-4">✅</div>
                                    <h4 className="text-xl text-green-400 font-semibold">Request Submitted!</h4>
                                    <p className="text-gray-400 mt-2">We'll get back to you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-300 text-sm mb-2 font-medium">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:border-[#d4a853] focus:outline-none transition-colors"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-300 text-sm mb-2 font-medium">Company</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleFormChange}
                                                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:border-[#d4a853] focus:outline-none transition-colors"
                                                placeholder="Company name"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-300 text-sm mb-2 font-medium">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:border-[#d4a853] focus:outline-none transition-colors"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-300 text-sm mb-2 font-medium">Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:border-[#d4a853] focus:outline-none transition-colors"
                                                placeholder="+971 50 XXX XXXX"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2 font-medium">Project Details</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleFormChange}
                                            rows="4"
                                            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:border-[#d4a853] focus:outline-none resize-none transition-colors"
                                            placeholder="Tell us about your project requirements..."
                                        />
                                    </div>

                                    {submitStatus === 'error' && (
                                        <div className="p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm">
                                            Failed to submit. Please try again.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[#d4a853] text-black py-3 rounded-xl font-semibold hover:bg-[#e5b963] transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
