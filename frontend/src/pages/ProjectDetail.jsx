import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { api } from '../api/api';
import { FaChevronLeft, FaChevronRight, FaTimes, FaTag } from 'react-icons/fa';

const ProjectDetail = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const fetchProject = useCallback(async () => {
        try {
            const response = await api.get(`/projects/${slug}`);
            setProject(response.data);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    // Get all images (featured + gallery)
    const getAllImages = () => {
        if (!project) return [];
        const images = [];
        if (project.featuredImage) images.push({ url: project.featuredImage, caption: 'Featured' });
        else if (project.imageUrl) images.push({ url: project.imageUrl, caption: 'Featured' });
        if (project.gallery?.length > 0) {
            project.gallery.forEach(img => {
                if (img.url && !images.find(i => i.url === img.url)) {
                    images.push(img);
                }
            });
        }
        return images;
    };

    const allImages = getAllImages();

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ongoing': return 'bg-blue-500';
            case 'completed': return 'bg-green-500';
            case 'awarded': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ongoing': return 'Ongoing';
            case 'completed': return 'Completed';
            case 'awarded': return 'Awarded';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
                <div className="animate-spin w-12 h-12 border-4 border-[#d4a853] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white">
                <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
                <Link to="/projects" className="text-[#d4a853] hover:underline">
                    ← Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white">
            {/* Lightbox Gallery */}
            <AnimatePresence>
                {lightboxOpen && allImages.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-4 right-4 text-white text-3xl hover:text-[#d4a853] z-50 cursor-pointer p-2"
                        >
                            <FaTimes />
                        </button>
                        
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-[#d4a853] hover:text-black transition cursor-pointer"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-[#d4a853] hover:text-black transition cursor-pointer"
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}
                        
                        <img
                            src={allImages[lightboxIndex]?.url}
                            alt={allImages[lightboxIndex]?.caption || project.title}
                            className="max-w-[90vw] max-h-[85vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        
                        {allImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {allImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                        className={`w-2 h-2 rounded-full cursor-pointer transition ${idx === lightboxIndex ? 'bg-[#d4a853]' : 'bg-white/50 hover:bg-white'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px]">
                <div className="absolute inset-0">
                    <img
                        src={project.featuredImage || project.imageUrl || 'https://via.placeholder.com/1920x1080?text=Project'}
                        alt={project.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => allImages.length > 0 && openLightbox(0)}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-black/50 to-black/30"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/projects" className="text-[#d4a853] hover:underline mb-4 inline-block">
                            ← Back to Projects
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {project.category && (
                                <span className="px-4 py-1 bg-[#2a2a2a] border border-[#d4a853]/50 text-[#d4a853] font-medium rounded flex items-center gap-2">
                                    <FaTag className="text-sm" /> {project.category}
                                </span>
                            )}
                            <span className={`px-4 py-1 ${getStatusColor(project.projectStatus || project.status)} text-white font-medium rounded`}>
                                {getStatusLabel(project.projectStatus || project.status)}
                            </span>
                            <span className="px-4 py-1 bg-[#d4a853] text-black font-medium rounded">
                                {project.year}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            {project.title}
                        </h1>
                        {project.location && (
                            <p className="text-xl text-gray-300 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {project.location}
                            </p>
                        )}
                    </motion.div>
                </div>
            </section>

            {}
            <section className="py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {}
                        <div className="lg:col-span-2">
                            {project.description && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#d4a853] mb-4">About This Project</h2>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Scope of Work */}
                            {project.scope && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold text-[#d4a853] mb-4">Scope of Work</h2>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                        {project.scope}
                                    </p>
                                </div>
                            )}

                            {/* Project Gallery */}
                            {allImages.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-[#d4a853] mb-6">
                                        Project Gallery ({allImages.length} {allImages.length === 1 ? 'image' : 'images'})
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {allImages.map((img, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="cursor-pointer overflow-hidden rounded-lg group aspect-square"
                                                onClick={() => openLightbox(index)}
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={img.caption || `${project.title} - ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-[#2a2a2a] rounded-lg p-6 border border-gray-700">
                                <h3 className="text-xl font-bold text-[#d4a853] mb-6">Project Details</h3>
                                
                                <div className="space-y-4">
                                    {project.category && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Category</p>
                                            <p className="text-white font-medium flex items-center gap-2">
                                                <FaTag className="text-[#d4a853] text-sm" /> {project.category}
                                            </p>
                                        </div>
                                    )}

                                    {project.clientName && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Client</p>
                                            <p className="text-white font-medium">{project.clientName}</p>
                                        </div>
                                    )}

                                    {project.location && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Location</p>
                                            <p className="text-white font-medium">{project.location}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-gray-400 text-sm">Year</p>
                                        <p className="text-white font-medium">{project.year}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-400 text-sm">Status</p>
                                        <span className={`inline-block px-3 py-1 ${getStatusColor(project.projectStatus || project.status)} text-white font-medium rounded text-sm`}>
                                            {getStatusLabel(project.projectStatus || project.status)}
                                        </span>
                                    </div>

                                    {project.materials?.length > 0 && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Materials Used</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {project.materials.map((material, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-[#1a1a1a] text-gray-300 text-xs rounded">
                                                        {material}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {}
                                <div className="mt-8 pt-6 border-t border-gray-700">
                                    <p className="text-gray-400 text-sm mb-4">Interested in a similar project?</p>
                                    <Link
                                        to="/contact"
                                        className="block w-full text-center bg-[#d4a853] text-black py-3 rounded font-semibold hover:bg-[#c49743] transition"
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectDetail;
