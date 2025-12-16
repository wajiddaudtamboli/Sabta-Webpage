import React from 'react'
import AboutBanner from "../assets/BannerImages/AboutBanner.jpeg"
import AboutImage from "../assets/BannerImages/AboutImage.jpeg"
import Certificate1 from "/FIRESTONE-9001.pdf"
import Certificate2 from "/FIRESTONE-14001.pdf"
import Certificate3 from "/FIRESTONE-45001.pdf"

const About = () => {
  return (
    <div>
{/* ✅ ABOUT PARALLAX BANNER */}
<section data-aos="fade-up"
  className="w-full h-64 sm:h-80 md:h-[400px] bg-fixed bg-center bg-cover relative flex items-center justify-center"
  style={{
    backgroundImage:
      `url(${AboutBanner})`,
  }}
>
  {/* ✅ Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* ✅ CENTERED HEADING */}
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white relative z-10 uppercase">
    About Us
  </h1>
</section>

{/* ✅ WHO WE ARE SECTION */}
<section data-aos="fade-up" className="w-[90%] container mx-auto py-16">

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

    {/* ✅ TEXT BLOCK */}
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        Who We Are
      </h2>

      <p className=" leading-relaxed mb-4" style={{ textAlign: "justify" }}>
        Founded in 2003, SABTA is one of the UAE’s most trusted suppliers of natural stone,
        known for premium-quality Marble, Onyx, Granite, Travertine, Limestone, Sandstone,
        and Slate. With over two decades of experience, we’ve built a reputation for
        precision, reliability, and craftsmanship making us a preferred partner for
        architects, interior designers, and contractors across the Middle East.
      </p>

      <p className=" leading-relaxed mb-4" style={{ textAlign: "justify" }}>
        Recognizing the latest market trends, SABTA has expanded its portfolio to include
        Engineered Marble, Terrazzo, and Quartz, offering a complete range of natural and
        engineered stone solutions for every project.
      </p>

      <p className=" leading-relaxed" style={{ textAlign: "justify" }}>
        We maintain an extensive inventory of 200+ colors in both natural and engineered
        materials, ensuring clients have unmatched variety and availability.
      </p>
    </div>

    {/* ✅ IMAGE BLOCK */}
    <div className="w-full h-64 sm:h-80 lg:h-full">
      <img
        src={AboutImage}
        alt="Who We Are"
        className="w-full h-full object-cover rounded"
      />
    </div>

  </div>

</section>
{/* ✅ CAPABILITIES + GLOBAL SOURCING SECTION */}
<section data-aos="fade-up" className="w-[90%] mx-auto py-16">

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

    {/* ✅ LEFT BLOCK — Comprehensive Capabilities */}
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        Comprehensive Capabilities
      </h2>

      <p className=" leading-relaxed mb-4" style={{ textAlign: "justify" }}>
        All fabrication and finishing processes are managed in-house from slabs and tiles to
        custom cut-to-size stones giving SABTA full control over quality and precision.
      </p>

      <p className=" leading-relaxed" style={{ textAlign: "justify" }}>
        We provide a wide selection of surface finishes, including Polished, Honed,
        Sandblasted, Flamed, Antique, Leather, and Bush Hammered, to match diverse design
        and architectural needs.
      </p>
    </div>

    {/* ✅ RIGHT BLOCK — Global Sourcing */}
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        Global Sourcing, Local Expertise
      </h2>

      <p className=" leading-relaxed" style={{ textAlign: "justify" }}>
        SABTA sources high-quality stone from around the world, including Italy, Turkey,
        Spain, Brazil, Greece, Portugal, India, Vietnam, and China. Our strong global
        partnerships ensure a steady supply of world-class materials at competitive prices,
        meeting the UAE’s demanding standards for quality and timely delivery.
      </p>
    </div>

  </div>

</section>
{/* ✅ MISSION & VISION SECTION */}
<section data-aos="fade-up" className="w-[90%] mx-auto py-16">

  <div className="text-center mb-12">
    <h2 className="text-2xl sm:text-3xl font-bold">
      Mission & Vision
    </h2>
  </div>

  {/* ✅ Two-Card Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

    {/* ✅ Mission Card */}
    <div className="border rounded-xl p-8 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Our Mission
      </h3>
      <p className=" leading-relaxed" style={{ textAlign: "justify" }}>
        Our mission is to transform spaces with nature’s finest materials, offering unmatched
        quality, sustainability, and service.
      </p>
    </div>

    {/* ✅ Vision Card */}
    <div className="border rounded-xl p-8 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Our Vision
      </h3>
      <p className=" leading-relaxed" style={{ textAlign: "justify" }}>
        We aim to be the most trusted and ethical natural stone brand in the region — leading
        through innovation, integrity, and craftsmanship while setting higher standards in the
        UAE’s stone industry.
      </p>
    </div>

  </div>

</section>
{/* ✅ ISO CERTIFICATIONS SECTION */}
<section data-aos="fade-up" className="w-[90%] mx-auto py-16">

  <div className="text-center mb-12">
    <h2 className="text-2xl sm:text-3xl font-bold">
      ISO Certifications
    </h2>
    <p className="mt-2 text-gray-600">
      Our commitment to global quality standards is backed by internationally recognized certifications.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* ISO 9001 */}
    <a
      href= {Certificate1}
      target="_blank"
      className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition text-center"
    >
      <h3 className="font-semibold mb-3">ISO 9001</h3>
      <p className="text-sm text-gray-600">Quality Management Systems</p>
    </a>

    {/* ISO 14001 */}
    <a
      href={Certificate2}
      target="_blank"
      className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition text-center"
    >
      <h3 className="font-semibold mb-3">ISO 14001</h3>
      <p className="text-sm text-gray-600">Environmental Management</p>
    </a>

    {/* ISO 45001 */}
    <a
      href={Certificate3}
      target="_blank"
      className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition text-center"
    >
      <h3 className="font-semibold mb-3">ISO 45001</h3>
      <p className="text-sm text-gray-600">Occupational Health & Safety</p>
    </a>

  </div>

</section>


    </div>
  )
}

export default About
