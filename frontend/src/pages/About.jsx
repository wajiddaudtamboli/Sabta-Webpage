import React, { useEffect, useState } from 'react'
import { api } from '../api/api'
import AboutBanner from "../assets/BannerImages/AboutBanner.jpeg"
import AboutImage from "../assets/BannerImages/AboutImage.jpeg"
import Certificate1 from "/FIRESTONE-9001.pdf"
import Certificate2 from "/FIRESTONE-14001.pdf"
import Certificate3 from "/FIRESTONE-45001.pdf"

const About = () => {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await api.get('/pages/about');
        setPageData(res.data?.content);
      } catch (err) {
        console.error("Error fetching about page data:", err);
      }
    };
    fetchPageData();
  }, []);

  const content = pageData || {};

  return (
    <div>
      {/* ABOUT PARALLAX BANNER */}
      <section data-aos="fade-up"
        className="w-full h-64 sm:h-80 md:h-[400px] bg-fixed bg-center bg-cover relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${content.bannerImage || AboutBanner})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* CENTERED HEADING */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white relative z-10 uppercase">
          {content.title || "About Us"}
        </h1>
      </section>

      {/* WHO WE ARE SECTION */}
      <section data-aos="fade-up" className="w-[90%] container mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* TEXT BLOCK */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Who We Are
            </h2>

            <p className="leading-relaxed mb-4" style={{ textAlign: "justify" }}>
              {content.whoWeAre || `Founded in 2003, SABTA is one of the UAE's most trusted suppliers of natural stone,
              known for premium-quality Marble, Onyx, Granite, Travertine, Limestone, Sandstone,
              and Slate. With over two decades of experience, we've built a reputation for
              precision, reliability, and craftsmanship making us a preferred partner for
              architects, interior designers, and contractors across the Middle East.`}
            </p>

            <p className="leading-relaxed mb-4" style={{ textAlign: "justify" }}>
              {content.expansion || `Recognizing the latest market trends, SABTA has expanded its portfolio to include
              Engineered Marble, Terrazzo, and Quartz, offering a complete range of natural and
              engineered stone solutions for every project.`}
            </p>

            <p className="leading-relaxed" style={{ textAlign: "justify" }}>
              {content.inventory || `We maintain an extensive inventory of 200+ colors in both natural and engineered
              materials, ensuring clients have unmatched variety and availability.`}
            </p>
          </div>

          {/* IMAGE BLOCK */}
          <div className="w-full h-64 sm:h-80 lg:h-full">
            <img
              src={content.whoWeAreImage || AboutImage}
              alt="Who We Are"
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>
      </section>

      {/* CAPABILITIES + GLOBAL SOURCING SECTION */}
      <section data-aos="fade-up" className="w-[90%] mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT BLOCK - Comprehensive Capabilities */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Comprehensive Capabilities
            </h2>

            <p className="leading-relaxed mb-4" style={{ textAlign: "justify" }}>
              {content.capabilities || `All fabrication and finishing processes are managed in-house from slabs and tiles to
              custom cut-to-size stones giving SABTA full control over quality and precision.`}
            </p>

            <p className="leading-relaxed" style={{ textAlign: "justify" }}>
              {content.finishes || `We provide a wide selection of surface finishes, including Polished, Honed,
              Sandblasted, Flamed, Antique, Leather, and Bush Hammered, to match diverse design
              and architectural needs.`}
            </p>
          </div>

          {/* RIGHT BLOCK - Global Sourcing */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Global Sourcing, Local Expertise
            </h2>

            <p className="leading-relaxed" style={{ textAlign: "justify" }}>
              {content.globalSourcing || `Our materials are sourced from the finest quarries across Italy, Turkey, India, Brazil,
              Spain, and other key regions. Every block is carefully selected to ensure quality,
              consistency, and visual impact. Our team visits quarries regularly to maintain
              strong supplier relationships and secure exclusive materials.`}
            </p>
          </div>
        </div>
      </section>

      {/* NOTABLE PROJECTS SECTION */}
      <section data-aos="fade-up" className="w-[90%] mx-auto py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Notable Projects
        </h2>
        <p className="leading-relaxed mb-8 text-center max-w-3xl mx-auto" style={{ textAlign: "justify" }}>
          {content.projectsIntro || `SABTA has contributed to some of the region's most prestigious developments,
          including luxury hotels, high-end residences, retail destinations, and corporate interiors.
          Our portfolio reflects our commitment to quality and design excellence.`}
        </p>
      </section>

      {/* ISO CERTIFICATIONS SECTION */}
      <section data-aos="fade-up" className="w-[90%] mx-auto py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Certifications & Standards
          </h2>
          <p className="mt-2 text-gray-600">
            Our commitment to global quality standards is backed by internationally recognized certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ISO 9001 */}
          <a
            href={Certificate1}
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
