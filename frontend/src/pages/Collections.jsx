import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

// Fallback images for when API doesn't provide images
import Marble from "../assets/CollectionImagesHome/Marble.png";
import Bookmatch from "../assets/CollectionImagesHome/Bookmatch.jpeg";
import Onyx from "../assets/CollectionImagesHome/Onyx.png";
import ExoticGranite from "../assets/CollectionImagesHome/Exotic_Granite.jpeg";
import Granite from "../assets/CollectionImagesHome/Granite.jpeg";
import Travertine from "../assets/CollectionImagesHome/Travertine.png";
import Limestone from "../assets/CollectionImagesHome/Limestone.png";
import Sandstone from "../assets/CollectionImagesHome/Sandstone.jpeg";
import Slate from "../assets/CollectionImagesHome/Slate.jpeg";
import EngineeredMarble from "../assets/CollectionImagesHome/Engineered_Marble.jpeg";
import Quartz from "../assets/CollectionImagesHome/Quartz.jpeg";
import Terrazzo from "../assets/CollectionImagesHome/Terrazzo.jpeg";
import CollectionBanner from "../assets/BannerImages/CollectionBanner.jpeg";

// Fallback image mapping for collections without images
const fallbackImages = {
  'marble': Marble,
  'marble-series': Marble,
  'marble-bookmatch': Bookmatch,
  'marble-bookmatch-series': Bookmatch,
  'onyx': Onyx,
  'onyx-series': Onyx,
  'exotic-color': ExoticGranite,
  'exotic-colors-series': ExoticGranite,
  'granite': Granite,
  'granite-series': Granite,
  'travertine': Travertine,
  'travertine-series': Travertine,
  'limestone': Limestone,
  'limestone-series': Limestone,
  'sandstone': Sandstone,
  'sandstone-series': Sandstone,
  'slate': Slate,
  'slate-series': Slate,
  'engineered-marble': EngineeredMarble,
  'engineered-marble-series': EngineeredMarble,
  'quartz': Quartz,
  'quartz-series': Quartz,
  'terrazzo': Terrazzo,
  'terrazzo-series': Terrazzo
};

// Static fallback collections (used if API fails)
const staticCollections = [
  { name: "Marble", slug: "marble", img: Marble },
  { name: "Marble Bookmatch", slug: "marble-bookmatch", img: Bookmatch },
  { name: "Onyx", slug: "onyx", img: Onyx },
  { name: "Exotic Color", slug: "exotic-color", img: ExoticGranite },
  { name: "Granite", slug: "granite", img: Granite },
  { name: "Travertine", slug: "travertine", img: Travertine },
  { name: "Limestone", slug: "limestone", img: Limestone },
  { name: "Sandstone", slug: "sandstone", img: Sandstone },
  { name: "Slate", slug: "slate", img: Slate },
  { name: "Engineered Marble", slug: "engineered-marble", img: EngineeredMarble },
  { name: "Quartz", slug: "quartz", img: Quartz },
  { name: "Terrazzo", slug: "terrazzo", img: Terrazzo }
];

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if device is touch-based
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // Get initial tilt angle based on card position (like fanned playing cards)
  const getInitialTilt = (index) => {
    // Alternate between left and right tilt for playing card effect
    const tiltDirection = index % 2 === 0 ? -1 : 1;
    const rotateY = tiltDirection * 8; // 8 degrees tilt
    const rotateX = 3; // Slight forward tilt
    return { rotateX, rotateY };
  };

  // Handle mouse enter - straighten the card and add dynamic tilt
  const handleMouseEnter = useCallback((e, cardElement, index) => {
    if (isTouchDevice() || !cardElement) return;
    // Store the initial tilt for this card
    cardElement.dataset.initialTiltY = getInitialTilt(index).rotateY;
  }, []);

  // 3D Tilt effect handlers - dynamic mouse tracking on hover
  const handleMouseMove = useCallback((e, cardElement, index) => {
    if (isTouchDevice() || !cardElement) return;

    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate dynamic tilt angles based on mouse position
    const rotateX = (mouseY / (rect.height / 2)) * -8;
    const rotateY = (mouseX / (rect.width / 2)) * 8;
    
    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateY(-10px)`;
    cardElement.style.boxShadow = '0 40px 70px rgba(0,0,0,0.5), 0 0 30px rgba(212,168,83,0.2)';
    cardElement.style.zIndex = '10';
    
    // Update glare effect
    const glareEl = cardElement.querySelector('.tilt-glare');
    if (glareEl) {
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`;
      glareEl.style.opacity = '1';
    }
  }, []);

  // Handle mouse leave - return to initial tilted position
  const handleMouseLeave = useCallback((cardElement, index) => {
    if (!cardElement) return;
    const { rotateX, rotateY } = getInitialTilt(index);
    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
    cardElement.style.boxShadow = '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)';
    cardElement.style.zIndex = '1';
    
    const glareEl = cardElement.querySelector('.tilt-glare');
    if (glareEl) {
      glareEl.style.opacity = '0';
    }
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await api.get('/collections');
        if (res.data && res.data.length > 0) {
          // Map API data to include fallback images
          const mappedCollections = res.data.map(col => ({
            _id: col._id,
            name: col.name,
            slug: col.slug || col.name.toLowerCase().replace(/\s+/g, '-'),
            img: col.image || fallbackImages[col.slug] || fallbackImages[col.name?.toLowerCase().replace(/\s+/g, '-')] || Marble
          }));
          setCollections(mappedCollections);
        } else {
          // Use static fallback if no data from API
          setCollections(staticCollections);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
        // Use static fallback on error
        setCollections(staticCollections);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading collections...</div>
      </div>
    );
  }

  return (
    <div>
      {/* ✅ COLLECTIONS BANNER */}
      <section
        data-aos="fade-up"
        className="w-full h-64 sm:h-80 md:h-[400px] bg-fixed bg-center bg-cover relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${CollectionBanner})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold relative z-10 uppercase">
          Collections
        </h1>
      </section>

      {/* ✅ TILE GRID SECTION */}
      <section
        className="w-full px-6 sm:px-10 md:px-16 lg:px-24 py-16 bg-[#1a1a1a]"
        data-aos="fade-up"
      >
        {/* Premium Tile Grid with Playing Card Style Tilt */}
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          style={{ perspective: '1500px' }}
        >
          {collections.map((cat, index) => {
            const { rotateX, rotateY } = getInitialTilt(index);
            return (
              <Link
                key={cat._id || index}
                to={`/collections/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="block group"
              >
                {/* Card + Title Container */}
                <div className="flex flex-col items-center">
                  {/* 3D Tilted Card - Playing Card Style */}
                  <div
                    className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out, z-index 0s',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                      willChange: 'transform',
                      zIndex: 1
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, e.currentTarget, index)}
                    onMouseMove={(e) => handleMouseMove(e, e.currentTarget, index)}
                    onMouseLeave={(e) => handleMouseLeave(e.currentTarget, index)}
                  >
                    {/* Stone Image - Full Coverage */}
                    <img
                      src={cat.img || cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    
                    {/* Glare Effect Overlay */}
                    <div 
                      className="tilt-glare absolute inset-0 pointer-events-none z-10 rounded-2xl transition-opacity duration-300"
                      style={{ opacity: 0 }}
                    />
                    
                    {/* Card Border Glow on Hover */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#d4a853]/50 transition-all duration-300"></div>
                  </div>

                  {/* Title Below Card - Centered */}
                  <div className="mt-4 text-center">
                    <h3 className="text-white text-lg sm:text-xl font-bold uppercase tracking-wider">
                      {cat.name.replace(' Series', '')}
                    </h3>
                    <p className="text-[#d4a853] text-xs sm:text-sm uppercase tracking-widest mt-1">
                      Series
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ✅ CTA SECTION */}
      <section className="bg-linear-to-r from-amber-600 to-amber-800 py-16 px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Our team of experts can help you find the perfect stone for your project.
            Contact us today for personalized recommendations.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Collections;
