const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://sabta_admin:Sabta123@cluster0.ljde3yn.mongodb.net/sabta-granite?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Collection Schema
const collectionSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  tagline1: String,
  tagline2: String,
  tagline3: String,
  description: String,
  displayOrder: Number,
  status: String
}, { timestamps: true });

const Collection = mongoose.model('Collection', collectionSchema);

// Function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function fixSlugs() {
  try {
    // Get all collections
    const collections = await Collection.find({});
    console.log(`Found ${collections.length} collections\n`);

    for (const collection of collections) {
      const correctSlug = generateSlug(collection.name);
      const currentSlug = collection.slug;
      
      if (currentSlug !== correctSlug) {
        console.log(`Fixing: "${collection.name}"`);
        console.log(`  Current slug: ${currentSlug || '(none)'}`);
        console.log(`  Correct slug: ${correctSlug}`);
        
        // Update the collection with correct slug
        await Collection.updateOne(
          { _id: collection._id },
          { $set: { slug: correctSlug } }
        );
        console.log(`  ✓ Updated!\n`);
      } else {
        console.log(`OK: "${collection.name}" - slug: ${currentSlug}`);
      }
    }

    console.log('\nAll slugs have been fixed!');
    
    // Verify the fix
    console.log('\n--- Verification ---');
    const updated = await Collection.find({}).select('name slug');
    for (const col of updated) {
      console.log(`${col.name}: ${col.slug}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

fixSlugs();
