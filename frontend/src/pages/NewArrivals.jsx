import React, { useState } from "react";
import Filters from "../components/Filters";

// IMAGES
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

const NewArrivals = () => {
  const [filters, setFilters] = useState({
    color: "",
    finish: "",
  });

  const sampleProducts = [
    { _id: "1", name: "Royal White Marble", image: Marble1 },
    { _id: "2", name: "Italian Grey Onyx", image: Marble2 },
    { _id: "3", name: "Golden Portoro", image: Marble3 },
    { _id: "4", name: "Agate Blue Slab", image: Marble4 },
    { _id: "5", name: "Arabescato Marble", image: Marble5 },
    { _id: "6", name: "Alaska Marble", image: Marble6 },
    { _id: "7", name: "Ukraine Marble", image: Marble7 },
    { _id: "8", name: "Arabic Marble", image: Marble8 },
    { _id: "9", name: "Indian Marble", image: Marble9 },
    { _id: "10", name: "USA Marble", image: Marble10 },
    { _id: "11", name: "Arabescato Marble", image: Marble11 },
    { _id: "12", name: "Arabescato Marble", image: Marble12 },
    { _id: "13", name: "Arabescato Marble", image: Marble13 },
    { _id: "14", name: "Arabescato Marble", image: Marble14 },
    { _id: "15", name: "Arabescato Marble", image: Marble15 },
    { _id: "16", name: "Arabescato Marble", image: Marble16 },
    { _id: "17", name: "Arabescato Marble", image: Marble17 },
    { _id: "18", name: "Arabescato Marble", image: Marble18 },
  ];

  return (
    <div data-aos="fade-up" className="w-full mt-30">
      {/* BACKGROUND TITLE */}
      <section>
        <div className="w-full">
          <p
            className="
              text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 
              tracking-widest text-center opacity-5 select-none pb-20
            "
          >
            New Arrivals
          </p>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 pb-5">
        <Filters filters={filters} setFilters={setFilters} />
      </section>

      {/* PRODUCT GRID */}
      <section className="px-6 sm:px-10 md:px-16 lg:px-20 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          
          {sampleProducts.map((p) => (
            <div key={p._id} className="group">
              {/* Card Container */}
              <div className="flex flex-col items-center">
                {/* IMAGE CARD */}
                <div 
                  className="relative w-full aspect-3/4 rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2"
                  style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
                >
                  {/* IMAGE */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* TITLE BELOW IMAGE */}
                <div className="mt-4 text-center">
                  <h3 className="text-white text-base sm:text-lg font-bold uppercase tracking-wider">
                    {p.name}
                  </h3>
                  <p className="text-[#d4a853] text-xs uppercase tracking-widest mt-1">
                    {p.code || "New Arrival"}
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
};

export default NewArrivals;
