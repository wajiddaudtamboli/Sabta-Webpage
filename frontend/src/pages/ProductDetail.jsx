import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { api } from "../api/api";

// COMPONENTS
import ImageSlider1 from "../components/ImageSlider1";
import ImageSlider2 from "../components/ImageSlider2";

// IMAGES
import ProductPageImage from "../assets/ProductImages/ProductPageImage.jpeg";

// ⭐ TAG COMPONENT — FULL & COMPLETE
const ProductTags = ({ product }) => {
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {/* TYPE */}
      {product.type && (
        <span className="px-4 py-1.5 rounded-full border border-(--brand-accent) text-sm flex items-center gap-2">
          {product.type}
        </span>
      )}

      {/* COLOR */}
      {product.color && product.color !== "N/A" && (
        <span className="px-4 py-1.5 rounded-full border border-(--brand-accent) text-sm flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: product.colorDot || product.color }}
          />
          {product.color}
        </span>
      )}

      {/* COUNTRY/ORIGIN */}
      {product.country && product.country !== "Unknown" && (
        <span className="px-4 py-1.5 rounded-full border border-(--brand-accent) text-sm flex items-center gap-2">
          🌍 {product.country}
        </span>
      )}

      {/* NATURAL */}
      {product.natural && (
        <span className="px-4 py-1.5 rounded-full border border-(--brand-accent) text-sm bg-green-900/30">
          Natural Stone
        </span>
      )}

      {/* BOOKMATCH */}
      {product.bookmatch && (
        <span className="px-4 py-1.5 rounded-full border border-(--brand-accent) text-sm bg-(--brand-bg)">
          Bookmatch
        </span>
      )}

      {/* TRANSLUCENT */}
      {product.translucent && (
        <span className="px-4 py-1.5 rounded-full border border-(--brand-accent) text-sm">
          Translucent
        </span>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  // Map API data to UI structure - now using actual database fields
  const selectedProduct = {
    code: product.code || (product._id ? product._id.substring(product._id.length - 4) : "0000"),
    name: product.name,
    description: product.description || "No description available.",
    hero: product.images && product.images.length > 0 ? product.images[0] : ProductPageImage,
    allImages: product.images || [ProductPageImage],
    type: product.category,
    color: product.color || "N/A",
    colorDot: "#cccccc",
    country: product.origin || "Unknown",
    countryCode: "un",
    bookmatch: product.isBookmatch || false,
    translucent: product.isTranslucent || false,
    natural: product.isNatural !== false,
    collectionName: product.collectionName || product.category || "Natural Stone",
  };

  // Stone properties from database
  const stoneProperties = {
    origin: product.origin || "Not specified",
    grade: product.grade || "Premium / Export Grade",
    compressionStrength: product.compressionStrength || "Not Published",
    impactTest: product.impactTest || "Not Published",
    bulkDensity: product.bulkDensity || "Not Published",
    waterAbsorption: product.waterAbsorption || "Not Published",
    thermalExpansion: product.thermalExpansion || "Not Published",
    flexuralStrength: product.flexuralStrength || "Not Published",
  };

  return (
    <div className="w-full">
      {/* ⭐ TAGS AT VERY TOP */}
      <section className="w-full px-6 sm:px-12 md:px-20 pt-30">
        <ProductTags product={selectedProduct} />
      </section>

      {/* ⭐ SECTION 1 — PRODUCT INTRO */}
      <section className="w-full px-6 sm:px-12 md:px-20 pt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* LEFT TEXT */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mt-2 mb-4">
              <p className="text-3xl font-semibold">{selectedProduct.code}</p>
              <div className="h-px w-12 bg-(--brand-accent)"></div>
              <p className="text-xs sm:text-sm tracking-wide uppercase">
                Natural Stone Collections by{" "}
                <span className="font-semibold">SABTA GRANITE</span>
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              {selectedProduct.name}
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-4 text-base sm:text-lg leading-relaxed max-w-lg text-justify">
              {selectedProduct.description}
            </p>

            <div className="space-y-4 mt-5 text-sm leading-snug">
              {/* Inventory Maintained In */}
              <div>
                <h4 className="font-semibold">Inventory Maintained</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>2CM and 3CM Polished Slabs</li>
                  <li>Ready Polished 2CM Tiles in 60 X 30 and 60 X 60</li>
                </ul>
              </div>

              {/* Available on Request */}
              <div>
                <h4 className="font-semibold">Available on Request</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Custom Sizes</li>
                  <li>Custom Surface Finishes</li>
                </ul>
              </div>

              {/* Product Advantage */}
              <div>
                <h4 className="font-semibold">Product Advantage</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Strong Production Control for Large Projects</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="md:col-span-7 flex justify-center aspect-4/3 w-full">
            <img
              src={selectedProduct.hero}
              alt={selectedProduct.name}
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Divider */}
      <section>
        <div className="w-full h-px mx-auto my-1 bg-linear-to-r from-transparent via-(--brand-accent) to-transparent"></div>
      </section>

      {/* ⭐ SECTION 2 — PROPERTIES + SLIDER */}
      <section className="w-full px-6 sm:px-12 md:px-20 py-20">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-(--brand-accent) mb-20">
          Overview of Natural Stone Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* LEFT SIDE PROPERTIES */}
          <div className="space-y-4 md:col-span-5">
            {Object.entries(stoneProperties).map(([key, value], idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 border-b border-gray-700 pb-2"
              >
                <span className="text-gray-300 capitalize">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
                <span className="text-(--brand-accent)">{value}</span>
              </div>
            ))}
          </div>

          {/* RIGHT SLIDER */}
          <div className="md:col-span-7">
            <ImageSlider1 />
          </div>
        </div>
      </section>

      {/* Divider */}
      <section>
        <div className="w-full h-px mx-auto my-1 bg-linear-to-r from-transparent via-(--brand-accent) to-transparent"></div>
      </section>

      {/* ⭐ SECTION 3 — SECOND IMAGE SLIDER */}
      <section className="w-full px-6 sm:px-12 md:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <ImageSlider2 />
          </div>

          <div className="md:col-span-5">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-(--brand-accent) opacity-10 text-center">
              Exceptional Quality You Can Trust
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
