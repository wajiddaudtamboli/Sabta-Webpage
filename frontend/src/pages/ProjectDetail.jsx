import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/api';

const ProjectDetail = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);

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
            {}
            {lightboxOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white text-4xl hover:text-[#d4a853] z-50 cursor-pointer"
                    >
                        ×
                    </button>
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {}
            <section className="relative h-[60vh] min-h-[500px]">
                <div className="absolute inset-0">
                    <img
                        src={project.imageUrl || 'https://via.placeholder.com/1920x1080?text=Project'}
                        alt={project.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => project.imageUrl && setLightboxOpen(true)}
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
                            <span className={`px-4 py-1 ${getStatusColor(project.status)} text-white font-medium rounded`}>
                                {getStatusLabel(project.status)}
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

                            {}
                            {project.imageUrl && (
                                <div>
                                    <h2 className="text-2xl font-bold text-[#d4a853] mb-6">Project Image</h2>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="cursor-pointer overflow-hidden rounded-lg group"
                                        onClick={() => setLightboxOpen(true)}
                                    >
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </motion.div>
                                </div>
                            )}
                        </div>

                        {}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-[#2a2a2a] rounded-lg p-6 border border-gray-700">
                                <h3 className="text-xl font-bold text-[#d4a853] mb-6">Project Details</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Client</p>
                                        <p className="text-white font-medium">{project.clientName}</p>
                                    </div>

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
                                        <span className={`inline-block px-3 py-1 ${getStatusColor(project.status)} text-white font-medium rounded text-sm`}>
                                            {getStatusLabel(project.status)}
                                        </span>
                                    </div>
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
