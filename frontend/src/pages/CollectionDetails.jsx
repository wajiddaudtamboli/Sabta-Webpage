import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import Filters from "../components/Filters";
import Marble from "../assets/BannerImages/Marble2.jpeg";
import Granite from "../assets/BannerImages/Granite.jpeg";
import Onyx from "../assets/BannerImages/Onyx.jpeg";
import Travertine from "../assets/BannerImages/Travertine.jpeg";
import Limestone from "../assets/BannerImages/Limestone.jpeg";
import Sandstone from "../assets/BannerImages/Sandstone.jpeg";
import Slate from "../assets/BannerImages/Slate.jpeg";
import EngineeredMarble from "../assets/BannerImages/Engineered-Marble.jpeg";
import Quartz from "../assets/BannerImages/Quartz.jpeg";
import Terrazzo from "../assets/BannerImages/Terrazzo.jpeg";
import ExoticGranite from "../assets/BannerImages/Exotic-Granite.jpeg";
import BookmatchMarble from "../assets/BannerImages/Bookmatch-Marble.jpeg";
import Marble1 from "../assets/Marble/Marble1.jpeg";
import Marble2 from "../assets/Marble/Marble2.jpeg";
import Marble3 from "../assets/Marble/Marble3.jpeg";
import Marble4 from "../assets/Marble/Marble4.jpeg";
import Marble5 from "../assets/Marble/Marble5.jpeg";
import Marble6 from "../assets/Marble/Marble6.jpeg";
import Marble7 from "../assets/Marble/Marble7.jpeg";
import Marble8 from "../assets/Marble/Marble8.jpeg";
import Marble9 from "../assets/Marble/Marble9.jpeg";
import Marble10 from "../assets/Marble/Marble10.jpeg";
import Marble11 from "../assets/Marble/Marble11.jpeg";
import Marble12 from "../assets/Marble/Marble12.jpeg";
import Marble13 from "../assets/Marble/Marble13.jpeg";
import Marble14 from "../assets/Marble/Marble14.jpeg";
import Marble15 from "../assets/Marble/Marble15.jpeg";
import Marble16 from "../assets/Marble/Marble16.jpeg";
import Marble17 from "../assets/Marble/Marble17.jpeg";
import Marble18 from "../assets/Marble/Marble18.jpeg";

const CollectionDetail = () => {
  const { collectionName } = useParams();
  const title = collectionName.replace(/-/g, " ");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [filters, setFilters] = useState({
    color: "",
    finish: "",
  });

  const loadProducts = async () => {
    try {
      const params = new URLSearchParams({
        category: collectionName,
        color: filters.color,
        finish: filters.finish,
      });

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [collectionName, filters]);

  const collectionContent = {
    marble: {
      hero: Marble,
      heading: "Where Luxury Meets the Art of Nature",
      subheading:
        "Our Natural Marble line celebrates the beauty only nature can create. Every slab is a one-of-a-kind composition of deep veining, refined tone and timeless elegance. These stones bring quiet sophistication to interiors and transform everyday spaces into lasting statements.",
      heading1: "The Journey of a Stone That Defines Luxury",
      description1:
        "Marble begins its life as limestone, reshaped by heat, pressure and time into a material admired for centuries. Each block is carefully quarried, then cut and finished to reveal the depth and character hidden within. The result is a surface that blends durability with natural artistry.",
      applications:
        "Flooring, wall cladding, kitchen tops, islands, bathrooms, staircases, windowsills and feature interiors",
      care: "Clean with a soft cloth and pH-neutral cleaner. Avoid acids and reseal when needed.",
      finishes: "Polished, Honed and Leathered",
      background: "MARBLE",
    },
    "marble-bookmatch": {
      hero: BookmatchMarble,
      heading: "Artistry Created by Nature, Perfected in Pairs",
      subheading:
        "Our Marble Bookmatch series highlights the dramatic symmetry that happens when two adjoining slabs are opened like a book. The result is a striking mirror effect that enhances the stone’s veining, movement and color. These slabs turn walls and feature areas into statement pieces that feel both artistic and timeless.",
      heading1: "A Natural Masterpiece in Perfect Symmetry",
      description1:
        "Bookmatched marble begins with a single block, cut into sequential slabs and placed side by side to create a balanced reflection. This technique brings out the full expression of the stone’s natural patterns, making it ideal for designs that aim for visual impact and refined elegance. Each pair is selected and processed with careful precision to preserve the beauty formed over centuries.",
      applications:
        "Feature walls, lobbies, living room backdrops, bathroom walls, shower features, reception areas, fireplaces and artistic installations",
      care: "Clean with a soft cloth and pH-neutral cleaner. Avoid acidic products and maintain sealing based on usage.",
      finishes: "Polished and Honed (most popular for bookmatch installations)",
      background: "MARBLE BOOKMATCH",
    },
    "exotic-color": {
      hero: ExoticGranite,
      heading: "Bold Patterns for Designs That Stand Out",
      subheading:
        "Our Exotic Color range is chosen for its dramatic colors, rare mineral formations and striking movement. These slabs bring a distinctive character to any setting, offering a balance of strength and visual depth. Each piece is naturally formed over millions of years, giving your project a surface that feels unique and unforgettable.",
      heading1: "A Rare Expression of Nature’s Craft",
      description1:
        "Exotic Color forms deep within the earth, shaped by intense heat and mineral-rich magma. This slow creation process produces bold veining, vibrant tones and unusual textures found only in select regions around the world. After quarrying, each block is cut and finished to highlight the natural artistry inside, resulting in a surface that is both durable and visually captivating.",
      applications:
        "High-end kitchens, countertops, islands, feature walls, bar counters, luxury bathrooms, staircases, outdoor applications and statement décor elements",
      care: "Clean with mild soap or a gentle cleaner. Avoid strong chemicals. Seal periodically to maintain performance and color richness.",
      finishes:
        "Polished, Leathered, Honed and Flamed (depending on stone type)",
      background: "EXOTIC COLOR",
    },
    onyx: {
      hero: Onyx,
      heading: "A Stone That Glows With Natural Luxury",
      subheading:
        "Our Onyx collection is known for its translucent beauty, vibrant colors and flowing patterns. Each slab carries a soft glow that elevates interiors with a sense of refinement. When backlit, Onyx transforms into a luminous feature that brings warmth and drama to any space. It’s a material chosen for designs that want to feel artistic and unforgettable.",
      heading1: "A Stone Formed in Layers of Light and Color",
      description1:
        "Onyx is created through layers of mineral deposits built over thousands of years. This slow formation gives it its signature bands, soft tones and crystalline structure. The stone is carefully cut and finished to bring out its natural depth, making it one of the most visually expressive materials used in luxury interiors.",
      applications:
        "Backlit walls, reception counters, bathroom vanities, feature panels, bar fronts, decorative elements and premium interior accents",
      care: "Clean with a soft cloth and pH-neutral cleaner. Avoid acids and abrasive products. Recommended to seal regularly due to its delicate nature.",
      finishes:
        "Polished and Honed (polished is most popular to enhance translucency)",
      background: "ONYX",
    },
    granite: {
      hero: Granite,
      heading: "Where Strength Meets Natural Beauty",
      subheading:
        "Our Granite selection is known for its durability, distinctive grain patterns and rich mineral colors. Each slab reflects the raw power of the earth, shaped over millions of years. These surfaces bring a bold and confident character to any interior or exterior space while maintaining a refined, timeless look.",
      heading1: "From Earth’s Core to Timeless Design",
      description1:
        "Granite forms deep within the earth’s crust, created by the slow cooling of molten rock. This natural process gives the stone its signature strength and unique crystalline patterns. Once extracted, each block is cut and finished to highlight its natural structure, offering a surface that stands up to heavy use without losing its appeal.",
      applications:
        "Flooring, wall cladding, countertops, islands, bathrooms, staircases, outdoor kitchens, facades and high-traffic areas",
      care: "Clean with a soft cloth and mild soap solution. Avoid harsh chemicals. Seal when required for long-term protection.",
      finishes: "Polished, Honed, Flamed, Leathered and Bush-Hammered",
      background: "GRANITE",
    },
    travertine: {
      hero: Travertine,
      heading: "Timeless Texture Inspired by Nature",
      subheading:
        "Our Travertine range is valued for its warm tones, natural pores and organic movement. Each slab reflects a calm, earthy character that brings a sense of comfort and understated elegance to any space. Whether used in classic or modern settings, Travertine adds a natural charm that never feels out of place.",
      heading1: "A Stone Formed by Nature’s Flow",
      description1:
        "Travertine is created from mineral-rich springs, where water movement slowly forms layers of stone over thousands of years. This process gives it its signature porous texture and soft, neutral colors. Once quarried, each slab is shaped and finished to highlight these natural variations, resulting in surfaces that feel both authentic and soothing.",
      applications:
        "Flooring, wall cladding, bathrooms, shower walls, outdoor areas, pool decks, façades and feature interiors",
      care: "Clean with a soft cloth and pH-neutral cleaner. Avoid acids and keep the stone sealed to protect its natural pores.",
      finishes: "Honed, Brushed, Tumbled and Polished",
      background: "TRAVERTINE",
    },
    limestone: {
      hero: Limestone,
      heading: "Natural Elegance for Every Space",
      subheading:
        "Our Limestone collection is prized for its soft textures, subtle tones, and timeless appeal. Each slab reflects the quiet beauty of nature, offering a versatile surface that complements both classic and contemporary designs. Limestone adds warmth and sophistication to interiors and exteriors alike.",
      heading1: "A Stone Shaped by Time and Elements",
      description1:
        "Limestone forms from compacted marine sediments over millions of years, creating a stone with natural texture and gentle tonal variations. Carefully quarried and finished, each slab highlights its unique character, making it perfect for spaces that value understated luxury and natural beauty.",
      applications:
        "Flooring, wall cladding, facades, staircases, bathrooms, patios, garden pathways and feature interiors",
      care: "Clean with a soft cloth and pH-neutral solution. Avoid acidic or abrasive cleaners. Seal periodically to maintain longevity and appearance.",
      finishes: "Honed, Polished, Brushed and Tumbled",
      background: "LIMESTONE",
    },
    sandstone: {
      hero: Sandstone,
      heading: "Earthy Beauty for Timeless Designs",
      subheading:
        "Our Sandstone collection is celebrated for its warm colors, natural texture, and organic appeal. Each slab carries the character of the earth, bringing a rustic yet refined charm to both interiors and exteriors. Sandstone is perfect for creating spaces that feel natural, welcoming, and enduring.",
      heading1: "A Stone Formed by Nature’s Layers",
      description1:
        "Sandstone forms from compacted sand over millions of years, creating a stone with distinctive grain and subtle color variations. Once quarried, each slab is carefully cut and finished to highlight its natural patterns, providing surfaces that are both durable and visually captivating.",
      applications:
        "Flooring, wall cladding, patios, garden paths, facades, fireplaces, pool surrounds and feature interiors",
      care: "Clean with a soft cloth or brush and pH-neutral cleaner. Avoid acidic or harsh chemicals. Seal periodically to preserve texture and color.",
      finishes: "Natural, Honed, Flamed, Sandblasted and Bush-Hammered",
      background: "SANDSTONE",
    },
    slate: {
      hero: Slate,
      heading: "Refined Texture with Natural Strength",
      subheading:
        "Our Slate collection is prized for its layered texture, natural cleft, and deep, earthy tones. Each slab offers a distinctive character that brings elegance and durability to interiors and exteriors. Slate is ideal for spaces that require a sophisticated, yet resilient surface.",
      heading1: "A Stone Carved by Time",
      description1:
        "Slate forms from compressed layers of clay and volcanic ash over millions of years, giving it its unique cleft surface and rich coloration. Each slab is carefully selected, cut, and finished to reveal its natural texture, resulting in surfaces that are both visually appealing and highly durable.",
      applications:
        "Flooring, wall cladding, roofing, patios, fireplaces, pool surrounds, garden pathways and feature interiors",
      care: "Clean with a soft brush or cloth and pH-neutral cleaner. Avoid acids and harsh chemicals. Seal periodically for enhanced durability.",
      finishes: "Natural Cleft, Honed, Polished, Brushed, Sandblasted",
      background: "SLATE",
    },
    "engineered-marble": {
      hero: EngineeredMarble,
      heading: "Luxury with Consistent Perfection",
      subheading:
        "Our Engineered Marble collection offers the elegance of natural marble with enhanced durability and consistency. Each slab is crafted using natural stone particles and resin, resulting in a surface that is visually stunning, easy to maintain, and ideal for high-performance spaces. It combines the timeless beauty of marble with modern practicality.",
      heading1: "Crafted for Beauty and Durability",
      description1:
        "Engineered Marble is produced by blending crushed natural marble with resins and pigments, then curing and polishing the mixture into slabs. This controlled process ensures uniformity in color, veining, and size while maintaining the rich texture and sophistication of natural stone. It is ideal for spaces where both aesthetics and durability are essential.",
      applications:
        "Countertops, kitchen islands, bathroom vanities, flooring, wall cladding, staircases, and feature surfaces",
      care: "Clean with a soft cloth and pH-neutral cleaner. Avoid harsh chemicals and abrasive materials. Resistant to stains and scratches but periodic sealing is optional for extra protection.",
      finishes: "Polished, Honed, and Matte",
      background: "ENGINEERED MARBLE",
    },
    quartz: {
      hero: Quartz,
      heading: "Strength and Beauty in Perfect Harmony",
      subheading:
        "Our Quartz collection offers the elegance of natural stone with unmatched durability and consistency. Made from natural quartz crystals combined with resins and pigments, each slab delivers a flawless, non-porous surface that resists scratches, stains, and heat. Quartz is ideal for both contemporary and classic interiors, offering timeless beauty with practical performance.",
      heading1: "Engineered for Reliability and Style",
      description1:
        "Quartz is an engineered surface crafted by blending natural quartz crystals with resins and pigments, then curing the mixture into durable slabs. This process ensures consistent color, pattern, and thickness, making it highly versatile for design projects. Quartz combines the visual appeal of stone with the benefits of low maintenance and long-lasting durability.",
      applications:
        "Kitchen countertops, islands, bathroom vanities, flooring, wall cladding, staircases, and feature surfaces",
      care: "Clean regularly with a soft cloth and mild pH-neutral cleaner. Avoid harsh chemicals or abrasive tools. Quartz does not require sealing.",
      finishes: "Polished, Honed, Matte, and Leathered",
      background: "QUARTZ",
    },
    terrazzo: {
      hero: Terrazzo,
      heading: "Durable Design Meets Creative Expression",
      subheading:
        "Our Terrazzo collection combines strength with artistic flair. Made from a blend of natural stone chips, glass, and cement or resin, each slab offers a unique pattern and color composition. Terrazzo brings modern elegance and versatility to interiors, making it perfect for statement floors, feature walls, and custom surfaces.",
      heading1: "A Surface That Blends Art and Function",
      description1:
        "Terrazzo is crafted by embedding stone, glass, or other aggregates into a binding matrix, then polished to reveal its intricate composition. This technique allows for endless design possibilities, combining durability with visual appeal. Each slab is finished to enhance its pattern, color depth, and smoothness, offering a long-lasting surface ideal for high-traffic areas.",
      applications:
        "Flooring, wall cladding, countertops, feature interiors, staircases, commercial spaces, and decorative installations",
      care: "Clean regularly with a soft cloth or mop and mild pH-neutral cleaner. Avoid harsh acids and abrasive tools. Seal if necessary to maintain finish and longevity.",
      finishes: "Polished, Honed, Matte, and Terrazzo Resin Finish",
      background: "TERRAZZO",
    },
  };

  const info = collectionContent[collectionName] || {};
  // ❌ If invalid collection, return 404 page
  if (!collectionContent[collectionName]) {
    return <NotFound />;
  }

  const sampleProducts = [
    {
      _id: "1",
      name: "Royal White Marble",
      image:
        Marble1,
    },
    {
      _id: "2",
      name: "Italian Grey Onyx",
      image:
        Marble2,
    },
    {
      _id: "3",
      name: "Golden Portoro",
      image: Marble3,
    },
    {
      _id: "4",
      name: "Agate Blue Slab",
      image: Marble4,
    },
    {
      _id: "5",
      name: "Arabescato Marble",  
      image: Marble5,
    },
    {
      _id: "6",
      name: "Alaska Marble",  
      image: Marble6,
    },{
      _id: "7",
      name: "Ukraine Marble",  
      image: Marble7,
    },{
      _id: "8",
      name: "Arabic Marble",  
      image: Marble8,
    },{
      _id: "9",
      name: "Indian Marble",  
      image: Marble9,
    },{
      _id: "10",
      name: "USA Marble",  
      image: Marble10,
    },{
      _id: "11",
      name: "Arabescato Marble",  
      image: Marble11,
    },{
      _id: "12",
      name: "Arabescato Marble",  
      image: Marble12,
    },{
      _id: "13",
      name: "Arabescato Marble",  
      image: Marble13,
    },{
      _id: "14",
      name: "Arabescato Marble",  
      image: Marble14,
    },{
      _id: "15",
      name: "Arabescato Marble",  
      image: Marble15,
    },{
      _id: "16",
      name: "Arabescato Marble",  
      image: Marble16,
    },{
      _id: "17",
      name: "Arabescato Marble",  
      image: Marble17,
    },{
      _id: "18",
      name: "Arabescato Marble",  
      image: Marble18,
    },
  ];

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section
        className="w-full h-64 sm:h-80 md:h-[380px] bg-center bg-cover relative flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url("${info.hero}")` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* TITLE */}
        <h1 className="relative z-10 font-bold text-3xl sm:text-4xl uppercase tracking-wide drop-shadow-lg">
          {title} Series
        </h1>

        {/* BREADCRUMB */}
        <p className="relative z-10 mt-5 text-sm sm:text-base bg-(--brand-bg) flex gap-2 px-3 py-1 rounded">
          <Link
            to="/"
            className="hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="hover:opacity-100 transition-opacity cursor-pointer">
              Home
            </span>
          </Link>
          <span>/</span>
          <Link
            to="/collections"
            className="hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="hover:opacity-100 transition-opacity cursor-pointer">
              Collections
            </span>
          </Link>
          <span>/</span>
          <span className="capitalize text-(--brand-accent)">{title}</span>
        </p>
      </section>

      {/* PREMIUM INTRO SECTION */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 relative overflow-hidden">
        {/* ⭐ MAIN TITLE - CENTER ⭐ */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-10 bg-(--brand-accent)"></div>
            <p className="tracking-widest  text-sm font-bold">
              Exclusive Collection of{" "}
              <span className="capitalize">{title}</span> by SABTA GRANITE
            </p>
            <div className="h-px w-10 bg-(--brand-accent)"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          {/* LEFT SIDE */}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-4xl leading-tight mb-6 uppercase">
              {info.heading}
            </h2>

            <p className="text-lg sm:text-xl font-semibold leading-relaxed text-justify">
              {info.subheading}
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* SAME STYLE AS LEFT SIDE */}
            <h3 className="text-xl sm:text-2xl md:text-4xl leading-tight mb-6 uppercase">
              {info.heading1}
            </h3>

            <p className="text-lg sm:text-xl font-semibold leading-relaxed text-justify mb-8">
              {info.description1}
            </p>
          </div>
        </div>
      </section>
      <section>
        <div
          className="w-full h-px mx-auto my-1 
      bg-linear-to-r from-transparent via-(--brand-accent) to-transparent"
        ></div>
      </section>
      {/* ADDITIONAL INFO SECTION */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 relative overflow-hidden">
        {/* Applications */}
        <div className="mb-6">
          <h4 className="text-base sm:text-lg font-semibold uppercase mb-1">
            Applications
          </h4>
          <p className="text-sm sm:text-base leading-relaxed text-justify">
            {info.applications}
          </p>
        </div>

        {/* Care */}
        <div className="mb-6">
          <h4 className="text-base sm:text-lg font-semibold uppercase mb-1">
            Care
          </h4>
          <p className="text-sm sm:text-base leading-relaxed text-justify">
            {info.care}
          </p>
        </div>

        {/* Finishes */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold uppercase mb-1">
            Finishes
          </h4>
          <p className="text-sm sm:text-base leading-relaxed text-justify">
            {info.finishes}
          </p>
        </div>
      </section>

      {/* BACKGROUND TEXT */}
      <section>
        <div className="w-full">
          <p
            className="
  text-4xl     /* mobile */
  sm:text-6xl  /* small screens */
  md:text-7xl  /* tablets */
  lg:text-8xl  /* laptops */
  xl:text-9xl  /* large screens */
  tracking-widest text-center opacity-5 select-none pb-20
"
          >
            {info.background}
          </p>
        </div>
      </section>
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 pb-5">
        <Filters filters={filters} setFilters={setFilters} />
      </section>
      {/* PRODUCT GRID WITH HOVER EFFECT */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 pb-20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6"></h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-20">
          {sampleProducts.map((p) => (
            <div key={p._id} className="mx-auto w-full max-w-[230px]">
              {/* TITLE ABOVE IMAGE */}
              <div className="text-center mb-3">
                <p className="text-lg font-semibold tracking-wide">
                  {p.code || "8050"}
                </p>

                <div
                  className="w-32 h-px mx-auto my-1 
      bg-linear-to-r from-transparent via-(--brand-accent) to-transparent"
                ></div>

                <p className="text-lg font-extrabold uppercase tracking-wide">
                  {p.name}
                </p>
              </div>

              {/* TILE IMAGE CARD */}
              <div className="relative h-[350px] rounded-lg overflow-hidden shadow-lg group">
                {/* IMAGE */}
                <div
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${p.image})` }}
                ></div>

                {/* OVERLAY */}
                <div
                  className="
        absolute inset-0 
        bg-black/30            /* MOBILE: always slightly dark */
        md:bg-black/10         /* DESKTOP: default light */
        md:group-hover:bg-black/60 
        transition-all duration-500
      "
                ></div>

                {/* DETAILS */}
                <div
                  className="
        absolute inset-0 flex flex-col items-center justify-center text-center px-4
       

        /* MOBILE ALWAYS VISIBLE */
        opacity-100 translate-y-0

        /* DESKTOP: reveal on hover */
        md:opacity-0 md:translate-y-6
        md:group-hover:opacity-100 md:group-hover:translate-y-0

        transition-all duration-700 ease-out
      "
                >
                  <h3 className="text-sm sm:text-base font-bold uppercase">
                    Elegance is Hidden in the Details
                  </h3>

                  <div className="h-10 w-px bg-(--brand-accent) my-3"></div>

                  <p className="text-xs sm:text-sm leading-relaxed">
                    Adds strong and characterful elegance with veining details.
                  </p>

                  <button className="mt-4 flex items-center gap-2 bg-(--brand-bg) text-(--brand-accent) px-4 py-1 rounded-full font-semibold text-xs sm:text-sm">
                    VIEW →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CollectionDetail;
