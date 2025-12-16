import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await api.get('/enquiries');
            setEnquiries(res.data);
        } catch (err) {
            console.error('Error fetching enquiries:', err);
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

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Enquiries</h1>
            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.map(enquiry => (
                            <tr key={enquiry._id} className="border-t">
                                <td className="p-4">{enquiry.name}</td>
                                <td className="p-4">{enquiry.email}</td>
                                <td className="p-4 truncate max-w-xs">{enquiry.message}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-sm ${enquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                            enquiry.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {enquiry.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={enquiry.status}
                                        onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                                        className="p-1 border rounded"
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
            </div>
        </div>
    );
};

export default Enquiries;
