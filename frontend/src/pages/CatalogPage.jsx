import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import CatalogueBanner from "../assets/BannerImages/Quartz.jpeg";

const CatalogPage = () => {
  useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setShowForm(false);
      setShowPdfViewer(false);
    }
  };

  window.addEventListener("keydown", handleEsc);

  return () => window.removeEventListener("keydown", handleEsc);
}, []);

  const [showForm, setShowForm] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const [selectedFile, setSelectedFile] = useState("");
  const [pdfFile, setPdfFile] = useState("");

  // VIEW PDF POPUP
  const handleView = (file) => {
    setPdfFile(file);
    setShowPdfViewer(true);
  };

  // DOWNLOAD WINDOW
  const handleDownloadClick = (file) => {
    setSelectedFile(file);
    setShowForm(true);
  };

  // AFTER FORM SUBMISSION → DOWNLOAD PDF
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const url = selectedFile;
    setShowForm(false);

    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  return (
    <div className="w-full">

      {/* ========================= BANNER ========================= */}
      <section
        data-aos="fade-up"
        className="w-full h-64 sm:h-80 md:h-[400px] bg-fixed bg-center bg-cover relative flex items-center justify-center"
        style={{ backgroundImage: `url(${CatalogueBanner})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold relative z-10 uppercase text-white">
          Catalogues
        </h1>
      </section>

      {/* ========================= GRID ========================= */}
      <div data-aos="fade-up" className="px-6 md:px-16 lg:px-32 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* ---------- CATALOG 1 ---------- */}
        <div className="rounded-xl border shadow-md p-5 space-y-4">
          <img
            src="/catalogues/New_Engineered_Marble.jpeg"
            alt="Engineered Stone Catalogue"
            className="w-full object-cover rounded-lg"
          />

          <h3 className="text-xl font-semibold">Engineered Stone</h3>

          <div className="flex gap-6">
            <button
              onClick={() => handleView("/catalogues/Engineered_Stone.pdf")}
              className="underline"
            >
              View Online
            </button>

            <button
              onClick={() => handleDownloadClick("/catalogues/Engineered_Stone.pdf")}
              className="border px-4 py-2 rounded-lg hover:opacity-80"
            >
              Download
            </button>
          </div>
        </div>

        {/* ---------- CATALOG 2 ---------- */}
        <div className="rounded-xl border shadow-md p-5 space-y-4">
          <img
            src="/catalogues/New_Natural_Stone.jpeg"
            alt="Natural Stone Catalogue"
            className="w-full object-cover rounded-lg"
          />

          <h3 className="text-xl font-semibold">Natural Stone</h3>

          <div className="flex gap-6">
            <button
              onClick={() => handleView("/catalogues/Engineered_Stone.pdf")}
              className="underline"
            >
              View Online
            </button>

            <button
              onClick={() => handleDownloadClick("/catalogues/Engineered_Stone.pdf")}
              className="border px-4 py-2 rounded-lg hover:opacity-80"
            >
              Download
            </button>
          </div>
        </div>

      </div>

      {/* ========================= PDF VIEWER POPUP ========================= */}
      {showPdfViewer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-xl relative">

            {/* CLOSE */}
            <button
              onClick={() => setShowPdfViewer(false)}
              className="absolute top-3 right-3 text-2xl"
            >
              <IoCloseOutline />
            </button>

            <iframe
              src={`${pdfFile}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full rounded-xl"
            ></iframe>
          </div>
        </div>
      )}

      {/* ========================= DOWNLOAD FORM POPUP ========================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-(--brand-bg) border rounded-xl p-8 w-full max-w-lg shadow-xl relative">

            {/* CLOSE */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 text-xl"
            >
              <IoCloseOutline />
            </button>

            <h2 className="text-2xl font-semibold mb-6">Download Catalogue</h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">

              {/* NAME */}
              <div className="relative pt-3">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border rounded-lg bg-transparent outline-none peer placeholder-transparent transition"
                />
                <label className="absolute left-3 top-6 px-1 text-sm opacity-70 bg-(--brand-bg) transition-all duration-200 pointer-events-none
                  peer-focus:-top-3 peer-focus:text-xs peer-valid:-top-3 peer-valid:text-xs">
                  Full Name
                </label>
              </div>

              {/* PHONE */}
              <div className="relative pt-3">
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border rounded-lg bg-transparent outline-none peer placeholder-transparent transition"
                />
                <label className="absolute left-3 top-6 px-1 text-sm opacity-70 bg-(--brand-bg) transition-all duration-200 pointer-events-none
                  peer-focus:-top-3 peer-focus:text-xs peer-valid:-top-3 peer-valid:text-xs">
                  Phone Number
                </label>
              </div>

              {/* EMAIL */}
              <div className="relative pt-3">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border rounded-lg bg-transparent outline-none peer placeholder-transparent transition"
                />
                <label className="absolute left-3 top-6 px-1 text-sm opacity-70 bg-(--brand-bg) transition-all duration-200 pointer-events-none
                  peer-focus:-top-3 peer-focus:text-xs peer-valid:-top-3 peer-valid:text-xs">
                  Email Address
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 border rounded-lg tracking-wide hover:opacity-80"
              >
                Download Now
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CatalogPage;
