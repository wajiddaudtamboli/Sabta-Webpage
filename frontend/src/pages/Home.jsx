import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import gif from "/Sabta_Gif.gif";
import ExperienceSection from "../components/ExperienceSection";
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
import MainImage from "../assets/BannerImages/Exotic-Granite.jpeg"
import { api } from "../api/api";

const Home = () => {
  const videoRef = useRef(null);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await api.get('/pages/home');
        setPageData(res.data);
      } catch (err) {
        console.error("Error fetching home page data:", err);
      }
    };
    fetchPageData();
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video?.play().catch(() => { });
          } else {
            video?.pause();
          }
        });
      },
      {
        threshold: 0.2, // 20% of video must be visible to play
      }
    );

    if (video) observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const content = pageData?.content || {};

  return (
    <div>
      {/* ✅ HERO SECTION */}
      <section data-aos="fade-up">
        <Hero />
      </section >
      {/* ✅ INTRODUCTION SECTION */}
      <section data-aos="fade-up">
        <div className="w-[90%] container mx-auto py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="justify-between">
              <h2
                className="text-4xl font-bold mb-4"
                style={{ textAlign: "justify" }}
              >
                {content.introTitle || "Why Sabta Granite Is the UAE’s Trusted Choice for Premium Marble and Natural Stone"}
              </h2>
              <p
                className="mb-6"
                style={{ textAlign: "justify" }}
              >
                {content.introText || "Marble brings a sense of luxury, elegance and lasting beauty to any space. At Sabta Granite, we supply a wide range of natural and engineered surfaces to projects across the UAE. Our collection includes handpicked marble, exotic granite, onyx, travertine, limestone, engineered marble, quartz and terrazzo. Each product is selected for quality, durability and visual impact. With long experience in the industry, we support architects, designers and homeowners who want reliable materials and a smooth project experience."}
              </p>
            </div>
          </div>
          <div>
            <img
              src={content.introImage || MainImage}
              alt=""
            />
          </div>
        </div>
      </section>
      {/* ✅ COMPACT POINTS LIST */}
      <section
        data-aos="fade-up"
        className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-8"
      >
        <ul
          className="
      list-disc 
      pl-5
      grid 
      grid-cols-1 
      md:grid-cols-3 
      lg:grid-cols-4 
      gap-y-2 
      gap-x-6 
      text-sm 
      sm:text-base 
      leading-snug
    "
        >
          <li>Natural Beauty Preserved</li>
          <li>Geological Elegance</li>
          <li>Luxury Marble Selection</li>
          <li>Exotic Granite Collection</li>
          <li>Bookmatch Designs</li>
          <li>Engineered Marble Solutions</li>
          <li>Quality Beyond Expectations</li>
          <li>Premium Quartz Surfaces</li>
          <li>Terrazzo Collections for Modern Interiors</li>
          <li>Unmatched Variety and Premium Finishes</li>
          <li>Trusted Stone Supplier in UAE</li>
          <li>Fast Delivery and Installation Support</li>
          <li>
            Materials Suitable for Villas, Hotels, Retail, Hospitality & Commercial
            Projects
          </li>
        </ul>
      </section>

      {/* ✅ COLLECTIONS CAROUSEL */}
      <section data-aos="fade-up" className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-12">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8">
          Our Collections
        </h2>

        <Swiper
          modules={[Autoplay, Pagination, A11y]}
          spaceBetween={16}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: false,
            pauseOnMouseEnter: true,
          }}
          speed={4000}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {[
            { name: "Marble", img: Marble, description: "Timeless elegance & natural veining ", link: "/collections/marble" },
            { name: "Marble Bookmatch", img: Bookmatch, description: "Mirrored beauty, bold design", link: "/collections/marble-bookmatch" },
            { name: "Onyx", img: Onyx, description: "Luxurious translucency & color depth ", link: "/collections/onyx" },
            { name: "Exotic Granite", img: ExoticGranite, description: "Rare patterns, vivid character", link: "/collections/exotic-granite" },
            { name: "Granite", img: Granite, description: "Strength, durability & rich texture", link: "/collections/granite" },
            { name: "Travertine", img: Travertine, description: "Earthy warmth with classic charm", link: "/collections/travertine" },
            { name: "Limestone", img: Limestone, description: "Subtle tones, soft elegance", link: "/collections/limestone" },
            { name: "Sandstone", img: Sandstone, description: "Natural, rustic, warm appeal", link: "/collections/sandstone" },
            { name: "Slate", img: Slate, description: "Layered texture with rugged style", link: "/collections/slate" },
            { name: "Engineered Marble", img: EngineeredMarble, description: "Refined finish, cost-effective", link: "/collections/engineered-marble" },
            { name: "Quartz", img: Quartz, description: "Sleek, durable & low-maintenance", link: "/collections/quartz" },
            { name: "Terrazzo", img: Terrazzo, description: "Artistic blend of fragments", link: "/collections/terrazzo" },
          ].map((item, index) => (
            <SwiperSlide key={index}>
              <Link to={item.link}>
                <div
                  className="
        relative cursor-pointer h-[420px] rounded-xl overflow-hidden
        transition-all duration-700
        transform-gpu
        perspective-distant
        group
      "
                >

                  {/* BACKGROUND IMAGE (moves slightly) */}
                  <div
                    className="
          absolute inset-0
          transition-transform duration-700 ease-out
          group-hover:scale-110
          group-hover:translate-z-[-40px]
          transform-gpu
        "
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>

                  {/* TEXT LAYER (moves more for parallax) */}
                  <div
                    className="
          absolute top-6 left-6 right-20 text-white z-30
          transition-transform duration-700 ease-out transform-gpu
          group-hover:translate-z-[60px] group-hover:-translate-y-2
        "
                  >
                    <h2 className="text-3xl font-extrabold capitalize leading-tight drop-shadow-lg">
                      {item.name}
                    </h2>

                    <p className="mt-2 leading-snug drop-shadow-md">
                      {item.description}
                    </p>
                  </div>

                  {/* WHOLE CARD TILT EFFECT */}
                  <div
                    className="
          absolute inset-0 z-50
          group-hover:rotate-x-6 group-hover:rotate-y-3 group-hover:scale-[1.03]
          transition-transform duration-700 ease-out transform-gpu
          pointer-events-none
        "
                  ></div>

                  {/* SHADOW */}
                  <div
                    className="
          absolute inset-0 rounded-xl
          group-hover:shadow-2xl group-hover:shadow-black/50
          transition-shadow duration-700
          pointer-events-none
        "
                  ></div>
                </div>
              </Link>
            </SwiperSlide>

          ))}
        </Swiper>
      </section>

      {/* ✅ WHY CHOOSE SABTA SECTION */}
      <section data-aos="fade-up" className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-16">
        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-12">
          Why Choose Sabta Granite
        </h2>

        {/* Tiles Grid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ✅ Tile 1 */}
          <div
            className="
      border rounded-lg p-6 
      shadow-sm hover:shadow-md
      transition-all duration-300
      hover:-translate-y-1
      flex flex-col justify-between h-full
    "
          >
            <div className="space-y-3 text-center">
              <h3 className="text-xl font-semibold">Unmatched Selection</h3>
              <p
                className="leading-relaxed"
                style={{ textAlign: "justify" }}
              >
                Extensive range of Natural and Engineered Stones, Including
                Granite, Marble, Onyx, Limestone, Travertine, Engineered Marble,
                Quartz, and Terrazzo, to suit any design vision.
              </p>
            </div>
          </div>

          {/* ✅ Tile 2 */}
          <div
            className="
      border rounded-lg p-6 
      shadow-sm hover:shadow-md
      transition-all duration-300
      hover:-translate-y-1
      flex flex-col justify-between h-full
    "
          >
            <div className="space-y-3 text-center">
              <h3 className="text-xl font-semibold">Superior Quality</h3>
              <p
                className="leading-relaxed"
                style={{ textAlign: "justify" }}
              >
                We partner with trusted quarries worldwide to provide materials
                known for their strength, consistency, and lasting beauty.
              </p>
            </div>
          </div>

          {/* ✅ Tile 3 */}
          <div
            className="
      border rounded-lg p-6 
      shadow-sm hover:shadow-md
      transition-all duration-300
      hover:-translate-y-1
      flex flex-col justify-between h-full
    "
          >
            <div className="space-y-3 text-center">
              <h3 className="text-xl font-semibold">Expert Craftsmanship</h3>
              <p
                className="leading-relaxed"
                style={{ textAlign: "justify" }}
              >
                Our craftsmen work with precision at every stage. Your stone is
                fabricated and finished with care to deliver a clean, seamless
                result.
              </p>
            </div>
          </div>

          {/* ✅ Tile 4 */}
          <div
            className="
      border rounded-lg p-6 
      shadow-sm hover:shadow-md
      transition-all duration-300
      hover:-translate-y-1
      flex flex-col justify-between h-full
    "
          >
            <div className="space-y-3 text-center">
              <h3 className="text-xl font-semibold">Exceptional Service</h3>
              <p
                className="leading-relaxed"
                style={{ textAlign: "justify" }}
              >
                From selecting the right material to final installation, our
                team is with you at every step. We keep the process clear,
                smooth, and tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        data-aos="fade-up"
        className="w-full px-6 md:px-12 lg:px-20 py-16"
      >
        <div
          className="
      w-full
      h-[40vh]
      sm:h-[50vh]
      md:h-[60vh]
      lg:h-[70vh]
      xl:h-[80vh]
      rounded-xl
      overflow-hidden
      border border-(--brand-accent)/40
      shadow-lg
    "
        >
          <video
            ref={videoRef}
            src="/Sabta_Video.mp4"
            className="w-full h-full object-cover"
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </section>


      {/* ✅ GIF SECTION */}
      <section data-aos="fade-up" className="w-full px-6 md:px-12 lg:px-20 py-16">
        <img
          src={gif}
          alt="Sabta GIF"
          className="w-full aspect-video rounded-xl overflow-hidden border border-(--brand-accent)/40 shadow-lg"
        />
      </section>

      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-16">
        <ExperienceSection />
      </section>
    </div>
  );
};

export default Home;
