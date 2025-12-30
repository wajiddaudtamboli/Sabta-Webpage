import React, { useState, useEffect, useRef } from "react";
import { api } from "../api/api";

import {
  Navigation,
  Pagination,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import Marble from "../assets/BannerImages/Marble1.jpeg";
import Granite from "../assets/BannerImages/Granite.jpeg";
import Quartz from "../assets/BannerImages/Quartz.jpeg";


const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroData, setHeroData] = useState(null);
  const videoRefs = useRef({});

  // Default slides (fallback)
  const defaultSlides = [
    {
      img: Marble,
      heading: "Where Nature's Beauty Meets Expert Craftsmanship",
      sub: "We create modern, high-performing websites.",
      button: "Get Started",
      buttonLink: "/collections",
      mediaType: "image"
    },
    {
      img: Granite,
      heading: "Premium Marble and Stone Designed to Elevate Your Interiors",
      sub: "Solutions tailored for your brand.",
      button: "View Services",
      buttonLink: "/collections",
      mediaType: "image"
    },
    {
      img: Quartz,
      heading: "Classic Design and Enduring Strength for Modern Spaces",
      sub: "Delivering quality, speed & results.",
      button: "Contact Us",
      buttonLink: "/contact",
      mediaType: "image"
    },
  ];

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await api.get('/pages/home');
        if (res.data?.content) {
          setHeroData(res.data.content);
        }
      } catch (err) {
        console.error("Error fetching hero data:", err);
      }
    };
    fetchHeroData();
  }, []);

  // Use dynamic slides if available, otherwise use defaults
  // Filter only active slides
  const slides = heroData?.heroSlides?.length > 0 
    ? heroData.heroSlides
        .filter(slide => slide.isActive !== false) // Only show active slides
        .map((slide, i) => ({
          img: slide.image || defaultSlides[i]?.img || Marble,
          videoUrl: slide.videoUrl || null,
          gifUrl: slide.gifUrl || null,
          mediaType: slide.mediaType || 'image',
          heading: slide.heading || defaultSlides[i]?.heading,
          sub: slide.subtext || defaultSlides[i]?.sub,
          button: slide.button || defaultSlides[i]?.button,
          buttonLink: slide.buttonLink || defaultSlides[i]?.buttonLink || '/collections'
        }))
    : defaultSlides;

  // Handle video play/pause on slide change
  useEffect(() => {
    // Pause all videos except the active one
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key];
      if (video) {
        if (parseInt(key) === activeIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [activeIndex]);

  // Render background based on media type
  const renderBackground = (slide, index) => {
    const mediaType = slide.mediaType || 'image';

    if (mediaType === 'video' && slide.videoUrl) {
      return (
        <video
          ref={(el) => (videoRefs.current[index] = el)}
          src={slide.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          autoPlay={index === 0}
        />
      );
    }

    if (mediaType === 'gif' && slide.gifUrl) {
      return (
        <img
          src={slide.gifUrl}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      );
    }

    // Default: image
    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.img})` }}
      />
    );
  };

  return (
    <div className="w-full max-w-full h-screen relative overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay, EffectFade]}
        slidesPerView={1}
        loop={true}
        effect="fade"
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        fadeEffect={{ crossFade: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="w-full max-w-full h-screen flex items-center justify-center md:justify-start relative">
              {/* Background Media */}
              {renderBackground(slide, i)}

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Text Block */}
              <div
                key={activeIndex}
                className="relative px-4 sm:px-6 md:pl-16 max-w-full md:max-w-xl animate-fade-slide text-center md:text-left z-10"
              >
                <div className="mt-3 text-base sm:text-lg drop-shadow-xl flex items-center gap-3 justify-center md:justify-start mb-5">
                  <div className="h-px w-10 bg-(--brand-accent)"></div>
                  <span className="uppercase">welcome to sabta granite</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-xl leading-tight">
                  {slide.heading}
                </h1>

                {slide.button && (
                  <a
                    href={slide.buttonLink || '/collections'}
                    className="inline-block mt-6 px-6 py-3 bg-[#d4a853] text-black font-semibold rounded hover:bg-[#c49743] transition"
                  >
                    {slide.button}
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
