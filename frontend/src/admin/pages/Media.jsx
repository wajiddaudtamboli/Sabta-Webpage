import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

const Media = () => {
    const [mediaList, setMediaList] = useState([]);
    const [url, setUrl] = useState('');

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const res = await api.get('/media');
            setMediaList(res.data);
        } catch (err) {
            console.error('Error fetching media:', err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/media', { url, type: 'image' }); // Assuming image for now
            setUrl('');
            fetchMedia();
        } catch (err) {
            console.error('Error adding media:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/media/${id}`);
                fetchMedia();
            } catch (err) {
                console.error('Error deleting media:', err);
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Media Manager</h1>

            <div className="bg-white p-6 rounded shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Add Media URL</h2>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Image URL"
                        className="flex-1 p-2 border rounded"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Add
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaList.map(media => (
                    <div key={media._id} className="bg-white p-2 rounded shadow relative group">
                        <img src={media.url} alt="Media" className="w-full h-32 object-cover rounded" />
                        <button
                            onClick={() => handleDelete(media._id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Delete
                        </button>
                        <p className="text-xs text-gray-500 mt-2 truncate">{media.url}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Media;
