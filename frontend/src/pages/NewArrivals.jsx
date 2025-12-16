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
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-20">
          
          {sampleProducts.map((p) => (
            <div key={p._id} className="mx-auto w-full max-w-[230px]">
              
              {/* PRODUCT TITLE */}
              <div className="text-center mb-3">
                <p className="text-lg font-semibold tracking-wide">
                  {p.code || "8050"}
                </p>

                <div
                  className="w-32 h-px mx-auto my-1 
                    bg-linear-to-r from-transparent via-(--brand-accent) to-transparent
                  "
                ></div>

                <p className="text-lg font-extrabold uppercase tracking-wide">
                  {p.name}
                </p>
              </div>

              {/* IMAGE CARD */}
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
                    bg-black/30 md:bg-black/10 
                    md:group-hover:bg-black/60 
                    transition-all duration-500
                  "
                ></div>

                {/* TEXT CONTENT */}
                <div
                  className="
                    absolute inset-0 flex flex-col items-center justify-center text-center px-4
                    opacity-100 md:opacity-0 md:translate-y-6 
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

export default NewArrivals;
