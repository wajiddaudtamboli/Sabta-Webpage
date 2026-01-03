import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { HiDocumentText, HiDownload } from "react-icons/hi";
import CatalogueBanner from "../assets/BannerImages/Quartz.jpeg";
import { api } from "../api/api";

const CatalogPage = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfFile] = useState("");

  // Fetch catalogues from API
  useEffect(() => {
    const fetchCatalogues = async () => {
      try {
        const res = await api.get('/catalogues');
        setCatalogues(res.data);
      } catch (err) {
        console.error('Error fetching catalogues:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogues();
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowForm(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
      <div data-aos="fade-up" className="px-6 md:px-16 lg:px-32 py-20">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#d4a853] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading catalogues...</p>
          </div>
        ) : catalogues.length === 0 ? (
          <div className="text-center py-12">
            <HiDocumentText className="w-16 h-16 text-[#d4a853] mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Catalogues will be available soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {catalogues.map((catalogue) => (
              <div key={catalogue._id} className="rounded-xl border shadow-md p-5 space-y-4">
                {catalogue.thumbnailUrl ? (
                  <img
                    src={catalogue.thumbnailUrl}
                    alt={catalogue.title}
                    className="w-full object-cover rounded-lg"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Catalogue'; }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                    <HiDocumentText className="w-16 h-16 text-[#d4a853]" />
                  </div>
                )}

                <h3 className="text-xl font-semibold">{catalogue.title}</h3>
                {catalogue.description && (
                  <p className="text-gray-400 text-sm">{catalogue.description}</p>
                )}

                <div className="flex gap-6">
                  <button
                    onClick={() => handleDownloadClick(catalogue.fileUrl)}
                    className="border px-4 py-2 rounded-lg hover:opacity-80 flex items-center gap-1"
                  >
                    <HiDownload className="w-4 h-4" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
