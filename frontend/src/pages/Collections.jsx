import { Link } from "react-router-dom";
import Marble from "../assets/CollectionImagesHome/Marble.png"
import Bookmatch from "../assets/CollectionImagesHome/Bookmatch.jpeg"
import Onyx from "../assets/CollectionImagesHome/Onyx.png"
import ExoticGranite from "../assets/CollectionImagesHome/Exotic_Granite.jpeg"
import Granite from "../assets/CollectionImagesHome/Granite.jpeg"
import Travertine from "../assets/CollectionImagesHome/Travertine.png"
import Limestone from "../assets/CollectionImagesHome/Limestone.png"
import Sandstone from "../assets/CollectionImagesHome/Sandstone.jpeg"
import Slate from "../assets/CollectionImagesHome/Slate.jpeg"
import EngineeredMarble from "../assets/CollectionImagesHome/Engineered_Marble.jpeg"
import Quartz from "../assets/CollectionImagesHome/Quartz.jpeg"
import Terrazzo from "../assets/CollectionImagesHome/Terrazzo.jpeg"
import CollectionBanner from "../assets/BannerImages/CollectionBanner.jpeg"
const Collections = () => {
  const categories = [
    {
                  name: "Marble",
                  img: Marble,
                },
                {
                  name: "Marble Bookmatch",
                  img: Bookmatch,
                },
                {
                  name: "Onyx",
                  img: Onyx,
                },
                {
                  name: "Exotic Color",
                  img: ExoticGranite,
                },
                {
                  name: "Granite",
                  img: Granite,
                },
                {
                  name: "Travertine",
                  img: Travertine,
                },
                {
                  name: "Limestone",
                  img: Limestone,
                },
                {
                  name: "Sandstone",
                  img: Sandstone,
                },
                {
                  name: "Slate",
                  img: Slate,
                },
                {
                  name: "Engineered Marble",
                  img: EngineeredMarble,
                },
                {
                  name: "Quartz",
                  img: Quartz,
                },
                {
                  name: "Terrazzo",
                  img: Terrazzo,
                },
  ];

  return (
    <div>
      {/* ✅ COLLECTIONS BANNER */}
      <section
        data-aos="fade-up"
        className="w-full h-64 sm:h-80 md:h-[400px] bg-fixed bg-center bg-cover relative flex items-center justify-center"
        style={{
          backgroundImage:
            `url(${CollectionBanner})`,
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
        className="w-full px-6 sm:px-10 md:px-16 lg:px-24 py-16"
        data-aos="fade-up"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={`/collections/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div
                className="
      relative h-72 sm:h-96 md:h-108
      rounded-xl overflow-hidden
      bg-black
      shadow-[0_20px_45px_rgba(0,0,0,0.55)]
      transition-all duration-500
      [clip-path:polygon(8%_0%,100%_0%,92%_100%,0%_100%)]
      cursor-pointer
      transform-gpu
      group
    "
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotateY = (x / rect.width - 0.5) * 10;
                  const rotateX = -(y / rect.height - 0.5) * 10;
                  card.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.06)
        translateY(-10px)
      `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
                }}
              >
                {/* ✅ MAIN IMAGE */}
                <div
                  className="
        absolute inset-0 bg-center bg-cover
        transition-all duration-700
        group-hover:scale-110
      "
                  style={{ backgroundImage: `url(${cat.img})` }}
                ></div>

                {/* ✅ SIDE EDGE THICKNESS */}
                <div
                  className="
        absolute right-0 top-0 h-full w-3
        bg-black/60
        translate-x-1
        blur-[1px]
        opacity-70
      "
                ></div>

                {/* ✅ TOP EDGE HIGHLIGHT */}
                <div
                  className="
        absolute top-0 left-0 w-full h-2
        bg-white/10
      "
                ></div>

                {/* ✅ LOOPING REFLECTION SHIMMER */}
                <div
                  className="
        absolute inset-0 bg-gradient-to-r
    from-transparent via-white/10 to-transparent
    skew-x-12 pointer-events-none
    shine-loop
      "
                  style={{
                    maskImage:
                      "linear-gradient(90deg, transparent, black, transparent)",
                  }}
                ></div>

                {/* ✅ GLOSS SWEEP ON HOVER */}
                <div
                  className="
        absolute inset-0
        bg-gradient-to-r from-white/5 via-white/30 to-transparent
        translate-x-[-150%]
        group-hover:translate-x-[150%]
        transition-all duration-700 ease-out
        skew-x-12
      "
                ></div>

                {/* ✅ GOLD LABEL BAR */}
                <div
                  className="
        absolute bottom-0 left-0 w-full
        bg-black/85 py-3 px-2
      "
                >
                  <h3 className="font-bold text-xs sm:text-sm md:text-base text-center tracking-wide">
                    {cat.name.toUpperCase()}
                  </h3>
                  <p className="text-white/70 text-[10px] sm:text-xs text-center tracking-wide">
                    SERIES
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Collections;
