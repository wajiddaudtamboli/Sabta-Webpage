import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import Slab1 from "../assets/ProductImages/Slab1.jpeg";
import Slab2 from "../assets/ProductImages/Slab2.jpeg";
import Slab3 from "../assets/ProductImages/Slab3.jpeg";
import Slab4 from "../assets/ProductImages/Slab4.jpeg";
import Slab5 from "../assets/ProductImages/Slab5.jpeg";

const ImageSlider1 = () => {
  const images = [Slab1, Slab2, Slab3, Slab4, Slab5];

  const [popupOpen, setPopupOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // Close popup with ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setPopupOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* ---------- MAIN SLIDER ---------- */}
      <div className="relative">
        {/* CUSTOM ARROWS MUST COME BEFORE SWIPER */}
        <button
          className="prev-main-1 absolute left-2 top-1/2 -translate-y-1/2 z-20 
                   bg-(--brand-bg) rounded-full p-1 "
        >
          <RxDoubleArrowLeft size={30} />
        </button>

        <button
          className="next-main-1 absolute right-2 top-1/2 -translate-y-1/2 z-20 
                   bg-(--brand-bg) rounded-full p-1 "
        >
          <RxDoubleArrowRight size={30} />
        </button>

        <Swiper
          key="Slider1Main"
          loop={true}
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = ".prev-main-1";
            swiper.params.navigation.nextEl = ".next-main-1";
          }}
          navigation={{
            prevEl: ".prev-main-1",
            nextEl: ".next-main-1",
          }}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                onClick={() => {
                  setActiveIndex(i);
                  setPopupOpen(true);
                }}
                className="flex justify-center aspect-4/3 w-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ---------- POPUP SLIDER ---------- */}
{popupOpen && (
  <div
    className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
    onClick={() => setPopupOpen(false)}
  >
    <div
      className="relative w-[95%] max-w-5xl max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* CLOSE BUTTON (INSIDE IMAGE TOP-RIGHT) */}
      <button
        onClick={() => setPopupOpen(false)}
        className="absolute top-3 right-3 z-30 
                   text-3xl font-bold 
                   bg-(--brand-bg) 
                   rounded-full w-8 h-8 flex items-center justify-center"
      >
        <IoCloseOutline />

      </button>

      {/* LEFT ARROW (INSIDE IMAGE) */}
      <button
        className="prev-popup-1 absolute left-3 top-1/2 -translate-y-1/2 z-30 
                   bg-(--brand-bg) 
                   rounded-full p-2"
      >
        <RxDoubleArrowLeft size={20} />
      </button>

      {/* RIGHT ARROW (INSIDE IMAGE) */}
      <button
        className="next-popup-1 absolute right-3 top-1/2 -translate-y-1/2 z-30 
                   bg-(--brand-bg) 
                   rounded-full p-2"
      >
        <RxDoubleArrowRight size={20} />
      </button>

      <Swiper
        key="Slider1Popup"
        loop={true}
        initialSlide={activeIndex}
        modules={[Navigation]}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = ".prev-popup-1";
          swiper.params.navigation.nextEl = ".next-popup-1";
        }}
        navigation={{
          prevEl: ".prev-popup-1",
          nextEl: ".next-popup-1",
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              className="
                max-h-[85vh] max-w-full mx-auto 
                object-contain rounded-lg shadow-xl
              "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
)}

    </>
  );
};

export default ImageSlider1;
