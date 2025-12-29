require('dotenv').config();
const { mongoose, connectToDatabase } = require('./db');
const Project = require('./models/Project');

const projects = [
    {
        title: 'Consultative Council of Sharjah',
        clientName: 'Department of Public Work Sharjah',
        year: 2022,
        status: 'completed',
        description: 'Premium marble and granite flooring installation for the prestigious Consultative Council of Sharjah. Features intricate marble inlay patterns, decorative floor medallions, and luxurious stone cladding throughout the interior spaces.',
        location: 'Sharjah, UAE',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        displayOrder: 1
    },
    {
        title: 'Police Academy of Sharjah',
        clientName: 'Department of Public Work Sharjah',
        year: 2021,
        status: 'completed',
        description: 'Comprehensive exterior stone work and landscape paving for the Police Academy of Sharjah. Includes granite pavement, decorative stone elements, and durable outdoor flooring solutions designed for high-traffic areas.',
        location: 'Sharjah, UAE',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        displayOrder: 2
    },
    {
        title: 'Higher College of Technology Women\'s Campus',
        clientName: 'Department of Public Work Sharjah',
        year: 2020,
        status: 'completed',
        description: 'Large-scale exterior stonework and landscaping project for the Higher College of Technology Women\'s Campus. Features premium granite paving, decorative stone borders, and elegant outdoor flooring throughout the campus grounds.',
        location: 'Sharjah, UAE',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
        displayOrder: 3
    }
];

async function seedProjects() {
    try {
        await connectToDatabase();
        console.log('Connected to database');

        for (const projectData of projects) {
            
            const existing = await Project.findOne({ title: projectData.title });
            if (existing) {
                console.log(`Project "${projectData.title}" already exists, skipping...`);
                continue;
            }

            
            let baseSlug = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            let slug = baseSlug;
            let counter = 1;
            while (await Project.findOne({ slug })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            projectData.slug = slug;

            
            await Project.collection.insertOne({
                ...projectData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(`✅ Added project: ${projectData.title}`);
        }

        console.log('\n🎉 All projects seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding projects:', error);
        process.exit(1);
    }
}

seedProjects();
