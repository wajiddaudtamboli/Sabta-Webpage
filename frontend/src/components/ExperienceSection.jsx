import React, { useEffect, useState } from "react";
import ParallaxImage from "../assets/BannerImages/Terrazzo.jpeg"

const ExperienceSection = () => {
  const startYear = 2003;
  const currentYear = new Date().getFullYear();
  const totalYears = currentYear - startYear;

  const [yearsCount, setYearsCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(duration / totalYears);

    const timer = setInterval(() => {
      start += 1;
      setYearsCount(start);
      if (start >= totalYears) clearInterval(timer);
    }, step);

    return () => clearInterval(timer);
  }, [totalYears]);

  return (
    <section
  className="
    w-[90%] mx-auto 
    px-4 sm:px-6 md:px-12 lg:px-20 
    py-16                      /* FIXED HERE */
    flex justify-center
    bg-cover bg-center
    md:bg-fixed
    bg-scroll
    rounded-xl
  "
  style={{ backgroundImage: `url(${ParallaxImage})` }}
>


      <div
        className="
          w-full max-w-4xl
          border rounded-xl bg-(--brand-bg) border-transparent
          shadow-sm hover:shadow-xl
          transition-all duration-300
          p-6 sm:p-10
          flex flex-col sm:flex-row
          items-center justify-between
          gap-6
          text-center
          hover:border-[#D4AF37]
        "
      >

        {/* ✅ LEFT */}
        <div className="text-lg font-semibold w-full sm:w-1/3">
          {startYear}
        </div>

        {/* ✅ DIVIDER */}
        <div className="hidden sm:block w-px h-10 "></div>

        {/* ✅ CENTER (No Glow) */}
        <div className="text-4xl sm:text-5xl font-bold tracking-wide w-full sm:w-1/3">
          {yearsCount}+ Years
        </div>

        {/* ✅ DIVIDER */}
        <div className="hidden sm:block w-px h-10 "></div>

        {/* ✅ RIGHT */}
        <div className="text-lg font-semibold w-full sm:w-1/3">
          {currentYear}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
