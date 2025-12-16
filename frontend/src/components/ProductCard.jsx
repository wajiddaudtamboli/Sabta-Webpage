import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/collections/${product.category}/${product._id}`} className="rounded-lg overflow-hidden shadow-md hover:shadow-xl group">
      <div className="w-full h-44 bg-center bg-cover" style={{ backgroundImage: `url(${product.image})` }}></div>
      <div className="p-3 bg-white">
        <p className="text-sm font-semibold">{product.name}</p>
        <p className="text-xs text-gray-600">{product.finish || ""}{product.color ? " • " + product.color : ""}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
