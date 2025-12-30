import { useState, useEffect, useRef } from 'react';
import { HiTrash, HiSave, HiX, HiPlus, HiPhotograph, HiStar } from 'react-icons/hi';
import { api } from '../../api/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    
    const imageInputRef = useRef(null);
    const galleryInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        title: '',
        clientName: '',
        year: new Date().getFullYear(),
        projectStatus: 'ongoing',
        category: 'Commercial',
        imageUrl: '',
        featuredImage: '',
        gallery: [],
        description: '',
        location: '',
        scope: '',
        materials: [],
        displayOrder: 0,
        isActive: true
    });

    const statusOptions = [
        { value: 'ongoing', label: 'Ongoing', color: 'bg-blue-500' },
        { value: 'completed', label: 'Completed', color: 'bg-green-500' },
        { value: 'awarded', label: 'Awarded', color: 'bg-yellow-500' }
    ];

    const categoryOptions = [
        { value: 'Residential', label: 'Residential' },
        { value: 'Commercial', label: 'Commercial' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Educational', label: 'Educational' },
        { value: 'Government', label: 'Government' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Other', label: 'Other' }
    ];

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await api.get('/projects/admin');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setMessage({ type: 'error', text: 'Failed to fetch projects' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setFormData({
            title: project.title || '',
            clientName: project.clientName || '',
            year: project.year || new Date().getFullYear(),
            projectStatus: project.projectStatus || project.status || 'ongoing',
            category: project.category || 'Commercial',
            imageUrl: project.imageUrl || '',
            featuredImage: project.featuredImage || project.imageUrl || '',
            gallery: project.gallery || [],
            description: project.description || '',
            location: project.location || '',
            scope: project.scope || '',
            materials: project.materials || [],
            displayOrder: project.displayOrder || 0,
            isActive: project.isActive !== undefined ? project.isActive : true
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = async (e) => {
        // Removed file upload functionality - now using URL inputs only
        return;
    };

    const handleGalleryUpload = async (e) => {
        // Removed file upload functionality - now using URL inputs only
        return;
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const setAsFeatured = (url) => {
        setFormData(prev => ({ ...prev, featuredImage: url }));
        setMessage({ type: 'success', text: 'Featured image updated!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.year) {
            setMessage({ type: 'error', text: 'Please fill in required fields: Title and Year' });
            return;
        }

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                featuredImage: formData.featuredImage || formData.imageUrl
            };

            if (selectedProject) {
                await api.put(`/projects/${selectedProject._id}`, submitData);
                setMessage({ type: 'success', text: 'Project updated successfully!' });
            } else {
                await api.post('/projects', submitData);
                setMessage({ type: 'success', text: 'Project created successfully!' });
            }
            
            fetchProjects();
            resetForm();
        } catch (error) {
            console.error('Error saving project:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error saving project' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        
        setLoading(true);
        try {
            await api.delete(`/projects/${projectId}`);
            setMessage({ type: 'success', text: 'Project deleted successfully!' });
            fetchProjects();
            resetForm();
        } catch (error) {
            console.error('Error deleting project:', error);
            setMessage({ type: 'error', text: 'Error deleting project' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const toggleActive = async (project) => {
        try {
            await api.put(`/projects/${project._id}`, { isActive: !project.isActive });
            fetchProjects();
            setMessage({ type: 'success', text: `Project ${!project.isActive ? 'activated' : 'deactivated'}!` });
            setTimeout(() => setMessage({ type: '', text: '' }), 2000);
        } catch (error) {
            console.error('Error toggling project status:', error);
        }
    };

    const resetForm = () => {
        setSelectedProject(null);
        setFormData({
            title: '',
            clientName: '',
            year: new Date().getFullYear(),
            projectStatus: 'ongoing',
            category: 'Commercial',
            imageUrl: '',
            featuredImage: '',
            gallery: [],
            description: '',
            location: '',
            scope: '',
            materials: [],
            displayOrder: 0,
            isActive: true
        });
    };

    const filteredProjects = projects.filter(p => {
        const statusMatch = filterStatus === 'all' || (p.projectStatus || p.status) === filterStatus;
        const categoryMatch = filterCategory === 'all' || p.category === filterCategory;
        return statusMatch && categoryMatch;
    });

    const getStatusColor = (status) => {
        const option = statusOptions.find(o => o.value === status);
        return option?.color || 'bg-gray-500';
    };

    return (
        <div className="p-4 md:p-6 text-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">
                    <span className="text-[#d4a853]">Projects</span> Management
                </h1>
                <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-[#d4a853] text-black rounded hover:bg-[#c49743] transition cursor-pointer font-medium"
                >
                    + Add New Project
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-4 p-4 rounded ${
                    message.type === 'success' ? 'bg-green-900/50 border border-green-500 text-green-300' : 'bg-red-900/50 border border-red-500 text-red-300'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Projects List */}
                <div className="lg:col-span-1">
                    <div className="bg-[#2a2a2a] rounded-lg border border-gray-700 p-4">
                        <h2 className="text-lg font-semibold mb-4 text-[#d4a853]">Projects</h2>
                        
                        {/* Status Filter */}
                        <div className="mb-3">
                            <label className="block text-xs text-gray-400 mb-1">Filter by Status</label>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-3 py-1 rounded text-sm cursor-pointer ${
                                        filterStatus === 'all' ? 'bg-[#d4a853] text-black' : 'bg-[#1a1a1a] text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    All
                                </button>
                                {statusOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFilterStatus(option.value)}
                                        className={`px-3 py-1 rounded text-sm cursor-pointer ${
                                            filterStatus === option.value 
                                                ? `${option.color} text-white` 
                                                : 'bg-[#1a1a1a] text-white hover:bg-[#3a3a3a]'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-4">
                            <label className="block text-xs text-gray-400 mb-1">Filter by Category</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full p-2 bg-[#1a1a1a] border border-gray-600 rounded text-white text-sm"
                            >
                                <option value="all">All Categories</option>
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Projects List */}
                        {loading && !projects.length ? (
                            <div className="text-center py-4 text-gray-400">Loading...</div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="text-center py-4 text-gray-400">No projects found</div>
                        ) : (
                            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                                {filteredProjects.map(project => (
                                    <div
                                        key={project._id}
                                        className={`p-3 border rounded transition ${
                                            selectedProject?._id === project._id 
                                                ? 'border-[#d4a853] bg-[#3a3a3a]' 
                                                : 'border-gray-700 bg-[#1a1a1a]'
                                        } ${!project.isActive ? 'opacity-60' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            {(project.featuredImage || project.imageUrl) && (
                                                <img 
                                                    src={project.featuredImage || project.imageUrl} 
                                                    alt={project.title}
                                                    className="w-16 h-16 object-cover rounded cursor-pointer"
                                                    onClick={() => handleProjectSelect(project)}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleProjectSelect(project)}>
                                                <h3 className="font-medium text-white truncate">{project.title}</h3>
                                                <p className="text-sm text-gray-400">{project.category || 'Commercial'}</p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className={`text-xs px-2 py-0.5 rounded text-white ${getStatusColor(project.projectStatus || project.status)}`}>
                                                        {project.projectStatus || project.status}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{project.year}</span>
                                                    {project.gallery?.length > 0 && (
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <HiPhotograph className="w-3 h-3" /> {project.gallery.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleActive(project); }}
                                                className={`self-start px-2 py-1 text-xs rounded cursor-pointer ${
                                                    project.isActive 
                                                        ? 'bg-green-900/50 text-green-400 border border-green-600' 
                                                        : 'bg-red-900/50 text-red-400 border border-red-600'
                                                }`}
                                                title={project.isActive ? 'Click to deactivate' : 'Click to activate'}
                                            >
                                                {project.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="bg-[#2a2a2a] rounded-lg border border-gray-700 p-4 md:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-[#d4a853]">
                                {selectedProject ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            {selectedProject && (
                                <button
                                    onClick={() => handleDelete(selectedProject._id)}
                                    className="px-3 py-1 text-red-400 border border-red-400 rounded hover:bg-red-900/30 cursor-pointer flex items-center gap-1"
                                >
                                    <HiTrash className="w-4 h-4" /> Delete
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Active Toggle */}
                            <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded border border-gray-600">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 accent-[#d4a853] cursor-pointer"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">
                                    <span className="font-medium">Active on Website</span>
                                    <span className="text-gray-500 ml-2">- Project will be visible on the public website</span>
                                </label>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Project Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                    placeholder="Enter project title"
                                    required
                                />
                            </div>

                            {/* Category & Year */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                    >
                                        {categoryOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Year <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        min="1900"
                                        max="2100"
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Client & Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                                    <input
                                        type="text"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                        placeholder="Client name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                        placeholder="e.g., Dubai, UAE"
                                    />
                                </div>
                            </div>

                            {/* Status & Display Order */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Status</label>
                                    <select
                                        name="projectStatus"
                                        value={formData.projectStatus}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        name="displayOrder"
                                        value={formData.displayOrder}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Featured Image <span className="text-gray-500">(Main display image)</span>
                                </label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            name="featuredImage"
                                            value={formData.featuredImage}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                            placeholder="Enter featured image URL"
                                        />
                                    </div>
                                    {formData.featuredImage && (
                                        <div className="relative">
                                            <img src={formData.featuredImage} alt="Featured" className="w-24 h-24 object-cover rounded border-2 border-[#d4a853]" />
                                            <HiStar className="absolute -top-2 -right-2 w-5 h-5 text-[#d4a853]" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none resize-none"
                                    placeholder="Project description..."
                                />
                            </div>

                            {/* Scope */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Scope of Work</label>
                                <textarea
                                    name="scope"
                                    value={formData.scope}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none resize-none"
                                    placeholder="e.g., Flooring, Wall Cladding, Countertops..."
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-[#d4a853] text-black font-medium rounded hover:bg-[#c49743] transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            {selectedProject ? <HiSave className="w-4 h-4" /> : <HiPlus className="w-4 h-4" />}
                                            {selectedProject ? 'Update Project' : 'Create Project'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 border border-gray-600 rounded hover:bg-[#3a3a3a] transition cursor-pointer text-white flex items-center gap-2"
                                >
                                    <HiX className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;
