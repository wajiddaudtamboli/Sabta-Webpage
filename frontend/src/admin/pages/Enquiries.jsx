import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const res = await api.get('/enquiries');
            setEnquiries(res.data);
        } catch (err) {
            console.error('Error fetching enquiries:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/enquiries/${id}`, { status: newStatus });
            fetchEnquiries();
        } catch (err) {
            console.error('Error updating enquiry:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            try {
                await api.delete(`/enquiries/${id}`);
                fetchEnquiries();
                setSelectedEnquiry(null);
            } catch (err) {
                console.error('Error deleting enquiry:', err);
            }
        }
    };

    const ActionButton = ({ onClick, children, variant = 'primary' }) => (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors cursor-pointer ${
                variant === 'primary' ? 'bg-[#d4a853] text-black hover:bg-[#c49743]' :
                variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                'bg-gray-600 text-white hover:bg-gray-700'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="text-white max-w-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 px-4 md:px-0">Enquiries</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Enquiries List */}
                <div className="lg:col-span-2 bg-[#2a2a2a] mx-4 md:mx-0 rounded border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Loading...</div>
                    ) : enquiries.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No enquiries yet.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-[#1a1a1a]">
                                <tr>
                                    <th className="p-2 md:p-4 text-[#d4a853] text-sm md:text-base">Name</th>
                                    <th className="p-2 md:p-4 text-[#d4a853] text-sm md:text-base hidden sm:table-cell">Email</th>
                                    <th className="p-2 md:p-4 text-[#d4a853] text-sm md:text-base">Status</th>
                                    <th className="p-2 md:p-4 text-[#d4a853] text-sm md:text-base hidden md:table-cell">Date</th>
                                    <th className="p-2 md:p-4 text-[#d4a853] text-sm md:text-base">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.map(enquiry => (
                                    <tr 
                                        key={enquiry._id} 
                                        className={`border-t border-gray-700 hover:bg-[#3a3a3a] cursor-pointer ${
                                            selectedEnquiry?._id === enquiry._id ? 'bg-[#3a3a3a]' : ''
                                        }`}
                                        onClick={() => setSelectedEnquiry(enquiry)}
                                    >
                                        <td className="p-2 md:p-4 text-sm md:text-base">
                                            <div className="max-w-[120px] md:max-w-none truncate">{enquiry.name}</div>
                                            <div className="sm:hidden text-xs text-gray-400 mt-1">{enquiry.email}</div>
                                        </td>
                                        <td className="p-2 md:p-4 text-gray-400 text-sm md:text-base hidden sm:table-cell">{enquiry.email}</td>
                                        <td className="p-2 md:p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                enquiry.status === 'new' ? 'bg-blue-900 text-blue-300' :
                                                enquiry.status === 'read' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-green-900 text-green-300'
                                            }`}>
                                                {enquiry.status}
                                            </span>
                                        </td>
                                        <td className="p-2 md:p-4 text-gray-400 text-xs md:text-sm hidden md:table-cell">
                                            {new Date(enquiry.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-2 md:p-4">
                                            <select
                                                value={enquiry.status}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(enquiry._id, e.target.value);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1 bg-[#1a1a1a] border border-gray-600 rounded text-white text-xs md:text-sm w-full md:w-auto"
                                            >
                                                <option value="new">New</option>
                                                <option value="read">Read</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    </div>
                </div>

                {/* Enquiry Detail */}
                <div className="bg-[#2a2a2a] mx-4 md:mx-0 rounded border border-gray-700 p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-4 text-[#d4a853]">Enquiry Details</h2>
                    {selectedEnquiry ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm">Name</label>
                                <p className="text-white">{selectedEnquiry.name}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Email</label>
                                <p className="text-white">{selectedEnquiry.email}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Phone</label>
                                <p className="text-white">{selectedEnquiry.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Message</label>
                                <p className="text-white bg-[#1a1a1a] p-3 rounded border border-gray-600 mt-1">
                                    {selectedEnquiry.message}
                                </p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Received</label>
                                <p className="text-white">
                                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="pt-4 flex gap-2">
                                <ActionButton onClick={() => handleDelete(selectedEnquiry._id)} variant="danger">
                                    Delete Enquiry
                                </ActionButton>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">Select an enquiry to view details</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Enquiries;
