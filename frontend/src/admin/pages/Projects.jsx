import { useState, useEffect, useRef } from 'react';
import { HiTrash, HiSave, HiX, HiPlus } from 'react-icons/hi';
import { api } from '../../api/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filterStatus, setFilterStatus] = useState('all');
    
    const imageInputRef = useRef(null);
    
    
    const [formData, setFormData] = useState({
        title: '',
        clientName: '',
        year: new Date().getFullYear(),
        status: 'ongoing',
        imageUrl: '',
        description: '',
        location: '',
        displayOrder: 0
    });

    const statusOptions = [
        { value: 'ongoing', label: 'Ongoing', color: 'bg-blue-500' },
        { value: 'completed', label: 'Completed', color: 'bg-green-500' },
        { value: 'awarded', label: 'Awarded', color: 'bg-yellow-500' }
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
            status: project.status || 'ongoing',
            imageUrl: project.imageUrl || '',
            description: project.description || '',
            location: project.location || '',
            displayOrder: project.displayOrder || 0
        });
    };

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await api.post('/media/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setUploading(false);
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        if (!formData.title || !formData.clientName || !formData.year) {
            setMessage({ type: 'error', text: 'Please fill in required fields: Title, Client Name, Year' });
            return;
        }

        setLoading(true);
        try {
            if (selectedProject) {
                await api.put(`/projects/${selectedProject._id}`, formData);
                setMessage({ type: 'success', text: 'Project updated successfully!' });
            } else {
                await api.post('/projects', formData);
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

    
    const resetForm = () => {
        setSelectedProject(null);
        setFormData({
            title: '',
            clientName: '',
            year: new Date().getFullYear(),
            status: 'ongoing',
            imageUrl: '',
            description: '',
            location: '',
            displayOrder: 0
        });
    };

    
    const filteredProjects = filterStatus === 'all' 
        ? projects 
        : projects.filter(p => p.status === filterStatus);

    const getStatusColor = (status) => {
        const option = statusOptions.find(o => o.value === status);
        return option?.color || 'bg-gray-500';
    };

    return (
        <div className="p-4 md:p-6 text-white min-h-screen">
            {}
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

            {}
            {message.text && (
                <div className={`mb-4 p-4 rounded ${
                    message.type === 'success' ? 'bg-green-900/50 border border-green-500 text-green-300' : 'bg-red-900/50 border border-red-500 text-red-300'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {}
                <div className="lg:col-span-1">
                    <div className="bg-[#2a2a2a] rounded-lg border border-gray-700 p-4">
                        <h2 className="text-lg font-semibold mb-4 text-[#d4a853]">Projects</h2>
                        
                        {}
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1 rounded text-sm cursor-pointer ${
                                    filterStatus === 'all' ? 'bg-[#d4a853] text-black' : 'bg-[#1a1a1a] text-white hover:bg-[#3a3a3a]'
                                }`}
                            >
                                All ({projects.length})
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
                                    {option.label} ({projects.filter(p => p.status === option.value).length})
                                </button>
                            ))}
                        </div>

                        {}
                        {loading && !projects.length ? (
                            <div className="text-center py-4 text-gray-400">Loading...</div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="text-center py-4 text-gray-400">No projects found</div>
                        ) : (
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                {filteredProjects.map(project => (
                                    <div
                                        key={project._id}
                                        onClick={() => handleProjectSelect(project)}
                                        className={`p-3 border rounded cursor-pointer transition hover:bg-[#3a3a3a] ${
                                            selectedProject?._id === project._id 
                                                ? 'border-[#d4a853] bg-[#3a3a3a]' 
                                                : 'border-gray-700 bg-[#1a1a1a]'
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            {project.imageUrl && (
                                                <img 
                                                    src={project.imageUrl} 
                                                    alt={project.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white truncate">{project.title}</h3>
                                                <p className="text-sm text-gray-400">{project.clientName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded text-white ${getStatusColor(project.status)}`}>
                                                        {project.status}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{project.year}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {}
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
                                    title="Delete Project"
                                    aria-label="Delete Project"
                                >
                                    <HiTrash className="w-4 h-4" /> Delete
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {}
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

                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Client Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                        placeholder="Client name"
                                        required
                                    />
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

                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
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

                            {}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                                <input
                                    type="number"
                                    name="displayOrder"
                                    value={formData.displayOrder}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                    placeholder="0 = default ordering"
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded text-white focus:border-[#d4a853] focus:outline-none"
                                            placeholder="Image URL or upload below"
                                        />
                                        <input
                                            type="file"
                                            ref={imageInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="mt-2 text-sm text-gray-400"
                                        />
                                    </div>
                                    {formData.imageUrl && (
                                        <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded" />
                                    )}
                                </div>
                            </div>
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

                            {}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-[#d4a853] text-black font-medium rounded hover:bg-[#c49743] transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                                    title={selectedProject ? 'Update Project' : 'Create Project'}
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
                                    title="Cancel"
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
