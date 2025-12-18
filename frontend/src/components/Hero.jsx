import React, { useState, useEffect } from "react";
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

  // Default slides (fallback)
  const defaultSlides = [
    {
      img: Marble,
      heading: "Where Nature's Beauty Meets Expert Craftsmanship",
      sub: "We create modern, high-performing websites.",
      button: "Get Started"
    },
    {
      img: Granite,
      heading: "Premium Marble and Stone Designed to Elevate Your Interiors",
      sub: "Solutions tailored for your brand.",
      button: "View Services"
    },
    {
      img: Quartz,
      heading: "Classic Design and Enduring Strength for Modern Spaces",
      sub: "Delivering quality, speed & results.",
      button: "Contact Us"
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
  const slides = heroData?.heroSlides?.length > 0 
    ? heroData.heroSlides.map((slide, i) => ({
        img: slide.image || defaultSlides[i]?.img || Marble,
        heading: slide.heading || defaultSlides[i]?.heading,
        sub: slide.subtext || defaultSlides[i]?.sub,
        button: slide.button || defaultSlides[i]?.button
      }))
    : defaultSlides;

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay, EffectFade]}
        slidesPerView={1}
        loop={true}
        effect="fade"
        speed={800}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        fadeEffect={{ crossFade: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="w-full h-screen bg-cover bg-center flex items-center justify-center md:justify-start relative"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Text Block */}
              <div
                key={activeIndex}
                className="relative px-4 sm:px-6 md:pl-16 max-w-xl animate-fade-slide text-center md:text-left"
              >
                <div className="mt-3 text-base sm:text-lg drop-shadow-xl flex items-center gap-3 justify-center md:justify-start mb-5">
                  <div className="h-px w-10 bg-(--brand-accent)"></div>
                  <span className="uppercase">welcome to sabta granite</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-xl leading-tight">
                  {slide.heading}
                </h1>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
